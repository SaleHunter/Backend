const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../../config/db');
const { OAuth2Client } = require('google-auth-library');
const { compareSync } = require('bcrypt');
const AuthUtil = require('../utils/authUtils');
const EmailUtil = require('../utils/emailUtils');
const cloudinary = require('./CloudinaryService');
const SQLError = require('../error/SQLError');
const BaseError = require('../error/BaseError');

class Service {
  async signup(userInfo) {
    try {
      const { fullname, password, passwordConfirm, email, profile_img } =
        userInfo;

      if (password !== passwordConfirm)
        throw new SQLError().unmatchedPasswords();

      //generate a unique uuid for the user
      const id = uuidv4();

      //Hash user's password
      const hashedPassword = await AuthUtil.hashPassword(password);

      const uploaded_img = cloudinary.uploadProfilePhoto(profile_img);

      //insert user to the database
      const insertUserQuery = `INSERT INTO users (id, full_name, email, password, profile_img) VALUES(?, ?, ?, ?, ?);`;
      const affectedRows = await sequelize.query(insertUserQuery, {
        replacements: [
          id,
          fullname,
          email,
          hashedPassword,
          uploaded_img.public_id,
        ],
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
      if (error.name === 'SequelizeUniqueConstraintError') {
        const attributeName = error.errors[0].path.split('_')[0];
        const attributeValue = error.errors[0].value;
        // console.log(error.name, attributeName, attributeValue);
        throw new SQLError().duplicateEntry(
          'User',
          attributeName,
          attributeValue
        );

        throw new SQLError().duplicateEntry('User');
      }
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
        throw new SQLError().noEntityFound('User', 'Email', email);
      }

      //Compare password with hashed password in db
      const isPasswordMatched = await AuthUtil.comparePassword(
        password,
        user[0].password
      );

      // Check if password does not match, then throw error
      if (!isPasswordMatched) {
        throw new SQLError().incorrectPassword();
      }

      //sign jwt-token for the user, so can access protected routes
      const token = await AuthUtil.signJWT(user[0].id);

      //unsend password with user info
      user[0].password = undefined;

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  async verifyGoogleUser(userInfo) {
    // Verify the token
    const { access_token, client_id } = userInfo;
    const client = new OAuth2Client(client_id);
    const payload = await AuthUtil.verifyThirdPartyAuth(
      client,
      client_id,
      access_token
    );
    return payload;
  }

  async verifyFacebookUser(userInfo) {
    try {
      const { access_token, client_id } = userInfo;
      const confirmUser = fetch(
        `https://graph.facebook.com/me?access_token=${access_token}`
      );
      if (confirmUser.id === client_id) {
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
      throw error;
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
        throw new SQLError().noEntityFound('User', 'Email', email);
      }

      const resetToken = await AuthUtil.generateResetToken();

      var now = new Date();
      now.setMinutes(now.getMinutes() + 30); // timestamp
      now = new Date(now); // Date object

      const updateUserTokenQuery = `UPDATE users SET token = ? , token_expire = ? WHERE email = ?`;
      const [results, metadata] = await sequelize.query(updateUserTokenQuery, {
        replacements: [resetToken, now, email],
        type: sequelize.QueryTypes.UPDATE,
      });

      const emailResponse = await new EmailUtil().sendResetPasswordEmail(
        user,
        resetToken
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async resetPassword(resetToken, passwords) {
    try {
      const { password, passwordConfirm } = passwords;

      //get user info based on reset token
      const selectUserQuery = `SELECT token, token_expire FROM users WHERE token= ?;`;
      const user = await sequelize.query(selectUserQuery, {
        replacements: [resetToken],
        type: sequelize.QueryTypes.SELECT,
      });
      console.log(user);

      //check if reset token is valid
      if (user.length === 0) {
        throw new SQLError().invalidResetToken();
      }

      //check if reset token is expired
      if (user[0].token_expire < new Date()) {
        throw new SQLError().resetTokenExpired();
      }

      //update the password with the new password
      // 1- Hash the given password
      const hashPassword = await AuthUtil.hashPassword(password);

      const updateUserPasswordQuery = `UPDATE users SET password = ? WHERE token = ?`;
      const [results, metadata] = await sequelize.query(
        updateUserPasswordQuery,
        {
          replacements: [hashPassword, resetToken],
          type: sequelize.QueryTypes.UPDATE,
        }
      );

      console.log(selectUserQuery);
      console.log(results, metadata);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Service();
