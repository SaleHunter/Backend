const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../../config/db');
const AuthUtil = require('../utils/authUtils');
const DBError = require('../error/DBError');

class Service {
  async signup(userInfo) {
    try {
      //destruct user information sent into request
      const { fullname, password, email } = userInfo;

      //generate a unique uuid for the user
      const id = uuidv4();

      //Hash user's password
      const hashedPassword = await AuthUtil.hashPassword(password);

      /*TODO:
       * accept profile_img for user and upload it cloud,
       * then put image url with user info in db
       */

      //insert user to the database
      const insertUserQuery = `INSERT INTO users (id, full_name, email, password) VALUES(?, ?, ?, ?);`;
      const affectedRows = await sequelize.query(insertUserQuery, {
        replacements: [id, fullname, email, hashedPassword],
        type: sequelize.QueryTypes.INSERT,
      });

      //get the info of the inserted user
      const selectUserQuery = `SELECT id, full_name as fullname, email, profile_img, last_seen FROM users where id = ?;`;
      const createdUser = await sequelize.query(selectUserQuery, {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      });

      //sign jwt-token for the user, so can access protected routes
      const token = await AuthUtil.signJWT(id);

      return { createdUser, token };
    } catch (error) {
      throw new DBError('Email already exists', 400);
    }
  }

  async signin(userInfo) {
    try {
      //destruct user information sent into request
      const { email, password } = userInfo;

      // Check if user exists in db
      const selectUserQuery = `SELECT id, full_name as fullname, email, password, profile_img, last_seen FROM users where email = ?;`;
      const user = await sequelize.query(selectUserQuery, {
        replacements: [email],
        type: sequelize.QueryTypes.SELECT,
      });

      // if user is not exist in db, throw throw error
      if (user.length == 0) {
        throw new DBError('There is no user with this email', 404);
      }

      //Compare password with hashed password in db
      const isPasswordMatched = await AuthUtil.comparePassword(
        password,
        user[0].password
      );

      //Check if password does not match, then throw error
      if (!isPasswordMatched) {
        throw new DBError('Incorrect Password', 400);
      }

      //sign jwt-token for the user, so can access protected routes
      const token = await AuthUtil.signJWT(user[0].id);

      //unsend password with user info
      user[0].password = undefined;

      return { user, token };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = new Service();
