const { sequelize } = require('../../config/db');
const { NoUserFoundError, InvalidResetTokenError } = require('./errors');
const { v4: uuidv4 } = require('uuid');

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
   * @param {string} email - user's email
   * @throws {NoUserFoundError}
   * @returns {Promise<object>} user info object
   */
  async getUserbyEmail(email) {
    try {
      const queryString = `
        SELECT id, email, full_name as fullname,
        password, profile_img, last_seen FROM users where email = ?;
      `;

      const results = await sequelize.query(queryString, {
        type: sequelize.QueryTypes.SELECT,
        replacements: [email],
      });

      if (!results[0]) throw new NoUserFoundError(email);

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
   * @param {string} token - Current reset token
   * @param {string} password - New hashed password
   */
  async updatePassword(token, password) {
    try {
      const queryString = `UPDATE users SET password = ? WHERE token = ?`;
      const results = await sequelize.query(queryString, {
        type: sequelize.QueryTypes.UPDATE,
        replacements: [password, token],
      });

      return results;
    } catch (error) {
      throw error;
    }
  }
  async createUser(user) {
    try {
      user.id = uuidv4();
      const queryString = `
        INSERT INTO users (id, email, full_name, password, profile_img) VALUES (?, ?, ?, ?, ?)
      `;

      const results = await sequelize.query(queryString, {
        type: sequelize.QueryTypes.INSERT,
        replacements: [
          user.id,
          user.email,
          user.fullname,
          user.password,
          user.profile_img,
        ],
      });
      console.log(results);

      return results[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DataAccessLayer();
