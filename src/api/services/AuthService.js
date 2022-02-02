const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../../config/db');
const { OAuth2Client } = require('google-auth-library');
const { compareSync } = require('bcrypt');
const AuthUtil = require('../utils/authUtils');
const EmailUtil = require('../utils/emailUtils');
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
      //TODO: Handle Duplicate user error form db
      console.log(error);
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

      console.log(user);

      // if user is not exist in db, throw error
      if (user.length == 0) {
        throw new DBError('There is no user with this email', 404);
      }

      //Compare password with hashed password in db
      const isPasswordMatched = await AuthUtil.comparePassword(
        password,
        user[0].password
      );

      //Check if password does not match, then throw error
      // if (!isPasswordMatched) {
      //   const error = new Error('Password does not match');
      //   return error;
      // }

      //sign jwt-token for the user, so can access protected routes
      const token = await AuthUtil.signJWT(user[0].id);

      //unsend password with user info
      user[0].password = undefined;

      return { user, token };
    } catch (error) {
      console.log(error);
    }
  }

  async verifyGoogleUser(userInfo) {
    // Verify the token
    const CLIENT_ID = userInfo.CLIENT_ID;
    const client = new OAuth2Client(CLIENT_ID);
    const payload = await AuthUtil.verifyThirdPartyAuth(
      client,
      CLIENT_ID,
      userInfo.token
    );
    return payload;
  }

  async verifyFacebookUser(userInfo) {
    try {
      const { access_token, user_id } = userInfo;
      const confirmUser = fetch(
        `https://graph.facebook.com/me?access_token=${access_token}`
      );
      if (confirmUser.id === user_id) {
        return confirmUser;
      } else {
        return 'Invalid User';
      }
    } catch (error) {
      console.log("Don't F With me");
    }
  }

  async socialAuth(userInfo) {
    try {
      if (userInfo.authFrom === 'google') {
        const payload = await this.verifyGoogleUser(userInfo);
      } else if (userInfo.authFrom === 'facebook') {
        const payload = await this.verifyFacebookUser(userInfo);
      }

      // Test if user exist already in db
      const selectUserQuery = `SELECT id, full_name as fullname, email, password, profile_img, last_seen FROM users where email = ?;`;

      let user = await sequelize.query(selectUserQuery, {
        replacements: [payload.email],
        type: sequelize.QueryTypes.SELECT,
      });

      // If user doesn't exist so sign him up
      if (user.length === 0) {
        //assign uuid to the new user
        payload.uuid = uuidv4();

        //sign up him
        const insertUserQuery = `INSERT INTO users (id, full_name, email, profile_img) VALUES(?, ?, ?, ?);`;
        const affectedRows = await sequelize.query(insertUserQuery, {
          replacements: [
            payload.uuid,
            payload.name,
            payload.email,
            payload.picture,
          ],
          type: sequelize.QueryTypes.INSERT,
        });

        //get the info of the inserted user

        const selectUserQuery = `SELECT id, full_name as fullname, email, profile_img, last_seen FROM users where id = ?;`;
        const user = await sequelize.query(selectUserQuery, {
          replacements: [payload.uuid],
          type: sequelize.QueryTypes.SELECT,
        });
      }
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async forgetPassword(userInfo) {
    try {
      const { email } = userInfo;

      const selectUserQuery = `SELECT email, full_name as fullname FROM users where email = ?;`;
      const user = await sequelize.query(selectUserQuery, {
        replacements: [email],
        type: sequelize.QueryTypes.SELECT,
      });

      // if user is not exist in db, throw error
      if (user.length == 0) {
        throw new DBError('There is no user with this email', 404);
      }

      const emailResponse = await new EmailUtil().sendResetPasswordEmail(
        user,
        '123456abc'
      );
      console.log(emailResponse);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = new Service();
