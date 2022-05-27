const { sequelize } = require('../../dataStores/sequelize');
const knex = require('../../dataStores/knex');

const {
  NoUserFoundError,
  InvalidResetTokenError,
  UserAlreadyExitsError,
} = require('./errors');
const SQLError = require('../../api/error/SQLError');

/**
 * @class
 * @classdesc Represents The Data Access Layer of Authentication Domain
 * Constains methods which talks with the Database and do some queries
 */
class DataAccessLayer {
  /**
   * @method Get user's info by his email from database
   * @access public
   * @async
   * @param {string} searchAttribute - Database attribute to search with
   * @param {string | number} value - attribute's value
   * @throws {NoUserFoundError}
   * @returns {Promise<object>} user info object
   */
  async getUserby(searchAttribute, value) {
    try {
      const queryString = `
        SELECT users.id, email, full_name as fullname, profile_img, last_seen, password
        password, profile_img, stores.id as store_id FROM users LEFT JOIN stores ON users.id = stores.user_id where users.${searchAttribute} = ?;
      `;

      const results = await sequelize.query(queryString, {
        type: sequelize.QueryTypes.SELECT,
        replacements: [value],
      });

      if (!results[0]) throw new NoUserFoundError();

      return results[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method Add Password Reset Token to the user
   * @async
   * @param {String} email - User's email address
   * @param {String} token - Password Reset Token\Pin
   * @returns {Promise<object>} Query metadata
   */
  async addResetToken(email, token) {
    try {
      const queryString = `
      UPDATE users SET token = ? , token_expire = ? WHERE email = ?
      `;

      //Set the token expiration time to 30 minutes
      let now = new Date();
      now.setMinutes(now.getMinutes() + 30);
      now = new Date(now).toISOString();

      const results = await sequelize.query(queryString, {
        type: sequelize.QueryTypes.UPDATE,
        replacements: [token, now, email],
      });

      return results;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method Find the Reset Token of the user
   * @async
   * @param {String} token - Password Reset Token\Pin
   * @throws {InvalidResetTokenError}
   * @returns {Promise<object>} object contains reset token and token_expire
   */
  async findResetToken(token) {
    try {
      const queryString = `SELECT token, token_expire FROM users WHERE token = ?`;
      console.log('token is: ', token);
      const results = await sequelize.query(queryString, {
        type: sequelize.QueryTypes.SELECT,
        replacements: [token],
      });

      if (!results[0]) {
        throw new InvalidResetTokenError();
      }

      return results[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method Update the password for the user
   * @async
   * @access public
   * @param {string} searchAttribute - Database attribute to search with
   * @param {string | number} value - attribute's value
   * @param {string} password - New hashed password
   */

  async updatePassword(password, searchAttribute, value) {
    try {
      const queryString = `UPDATE users SET password = ? WHERE ${searchAttribute} = ?`;
      await sequelize.query(queryString, {
        type: sequelize.QueryTypes.UPDATE,
        replacements: [password, value],
      });

      const results = await this.getUserby(searchAttribute, value);

      delete results.password;
      return results;
    } catch (error) {
      throw error;
    }
  }
  /**
   * @method Create new user
   * @async
   * @access public
   * @param {object} user - user's info
   * @throws {UserAlreadyExitsError}
   * @results
   */
  async createUser(user) {
    try {
      const queryString = `
        INSERT INTO users (email, full_name, password, profile_img, thirdParty_id, phone_number) VALUES (?, ?, ?, ?, ?, ?)
      `;

      await sequelize.query(queryString, {
        type: sequelize.QueryTypes.INSERT,
        replacements: [
          user.email,
          user.fullname,
          user.password,
          user.profile_img,
          user.thirdParty_id,
          user.phone_number,
        ],
      });

      const results = await this.getUserby('email', user.email);

      delete results.password;
      console.log(results);
      return results;
    } catch (error) {
      if (error.errors[0].validatorKey === 'not_unique')
        throw new UserAlreadyExitsError();
      throw error;
    }
  }

  /**
   * @method Create new user
   * @async
   * @access public
   * @param {object} user - user's info
   */
  async updateUser(user) {
    try {
      console.log('-----');
      console.log(user.profile_img);
      let queryString = `
        UPDATE users SET
      `;

      let replacementArray = [];

      if (user.email) {
        const str = queryString.endsWith('? ') ? ', email = ? ' : 'email = ? ';
        queryString = queryString.concat(str);
        replacementArray.push(user.email);
      }
      if (user.fullname) {
        const str = queryString.endsWith('? ')
          ? ', full_name = ? '
          : 'full_name = ? ';
        queryString = queryString.concat(str);
        replacementArray.push(user.fullname);
      }
      if (user.profile_img) {
        const str = queryString.endsWith('? ')
          ? ', profile_img = ? '
          : 'profile_img = ? ';
        queryString = queryString.concat(str);
        replacementArray.push(user.profile_img);
      }
      queryString = queryString.concat('WHERE id = ?');

      replacementArray.push(user.id);
      console.log(queryString, '\n', replacementArray);
      await sequelize.query(queryString, {
        type: sequelize.QueryTypes.UPDATE,
        replacements: replacementArray,
      });

      const results = await this.getUserby('id', user.id);

      delete results.password;
      return results;
    } catch (error) {
      throw error;
    }
  }
  async getUserbyThirdPartyID(thirdPartyID) {
    try {
      const queryString = `
        SELECT id, email, full_name as fullname, profile_img, phone_number, last_seen FROM users where thirdParty_id = ?;
      `;

      const results = await sequelize.query(queryString, {
        type: sequelize.QueryTypes.SELECT,
        replacements: [thirdPartyID],
      });
      return results[0];
    } catch (error) {
      throw error;
    }
  }
  async getUserbyID(user_id) {
    try {
      const queryString = `
        SELECT id, email, full_name as fullname, profile_img, phone_number, last_seen FROM
        users where id = ?;
      `;
      const results = await sequelize.query(queryString, {
        type: sequelize.QueryTypes.SELECT,
        replacements: [user_id],
      });

      return results[0];
    } catch (error) {
      throw error;
    }
  }

  async googleAuth(payload) {
    try {
      const { email, fullname, profileImg, thirdPartyId } = payload;

      const insertQueryString = `INSERT INTO users(full_name, email, profile_img, thirdParty_id)
      VALUES(?, ?, ?, ?)`;

      const selectQueryString = `SELECT id, full_name, email, profile_img, thirdParty_id
      FROM users WHERE email = ? || thirdParty_id = ?`;

      let user = await knex.raw(selectQueryString, [email, thirdPartyId]);

      if (user[0].length) {
        console.log('herererer', user[0][0]);
        user = user[0][0];
        return { ...user, thirdParty_provider: 'google' };
      }

      await knex.raw(insertQueryString, [
        fullname,
        email,
        profileImg,
        thirdPartyId,
      ]);

      user = await knex.raw(selectQueryString, [email, thirdPartyId]);
      user = user[0][0];

      return { ...user, thirdParty_provider: 'google' };
    } catch (error) {
      console.log(error);
    }
  }

  async facebookAuth(payload) {
    try {
      const { fullname, profileImg, thirdPartyId } = payload;

      const insertQueryString = `INSERT INTO users(full_name, profile_img, thirdParty_id)
      VALUES(?, ?, ?)`;

      const selectQueryString = `SELECT id, full_name, profile_img, thirdParty_id
      FROM users WHERE thirdParty_id = ?`;

      let user = await knex.raw(selectQueryString, [thirdPartyId]);

      if (user[0].length) {
        console.log('herererer', user[0][0]);
        user = user[0][0];
        return { ...user, thirdParty_provider: 'facebook' };
      }

      await knex.raw(insertQueryString, [fullname, profileImg, thirdPartyId]);

      user = await knex.raw(selectQueryString, [thirdPartyId]);
      user = user[0][0];
      return { ...user, thirdParty_provider: 'facebook' };
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new DataAccessLayer();
