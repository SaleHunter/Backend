const DataAccessLayer = require('./DAL');
const Helper = require('./helpers');
const { IncorrectPasswordError, ExpiredResetTokenError } = require('./errors');
const EmailService = require('../shared/services/email');
const { cloudinary } = require('../../config/cloudinary');
const helpers = require('./helpers');
/**
 * @class
 * @classdesc Class for Users Services
 */
class Service {
  /**
   * @method Service for signing user in
   * @access public
   * @async
   * @param {object} payload - Object contains user's email and password
   * @throws {IncorrectPasswordError}
   * @returns {Promise<object>} User's info and jwToken
   */
  async signin(payload) {
    try {
      const { email, password } = payload;

      //Fetch the user information from the database
      const user = await DataAccessLayer.getUserby('email', email);

      //Compare the given password with the stored one
      const isMatched = await Helper.comparePasswords(password, user.password);
      if (isMatched === false) {
        throw new IncorrectPasswordError();
      }

      //Sign jwToken for the user, so he can access protected routes
      const jwToken = Helper.signJWT(user.id, user.store_id);

      //Return the user info and jwToken
      //Exclude password from user info
      delete user.password;
      return { user, jwToken };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method Service for Serving Verify Email by sending token if browser client or pin if mobile to given email
   * @access public
   * @async
   * @param {object} payload - Object contains user's email
   * @returns {Promise<void>} User's info and jwToken
   */
  async verifyEmail(payload, client) {
    try {
      const { email } = payload;

      //Fetch the user information from the database
      const user = await DataAccessLayer.getUserby('email', email);
      console.log(user);

      let token;
      //Generate Reset Token if Request comming from browser
      if (client !== 'mobile') token = await Helper.generateResetToken(8);
      //Generate 6-digits Pin if Request comming from mobile app
      else token = Helper.generateResetPin();

      //Add the reset token\pin to the database
      const results = await DataAccessLayer.addResetToken(email, token);

      //Send an email to the user with the Reset Token\Pin
      const emailInstance = new EmailService();
      emailInstance.sendResetTokenEmail(user, token, client);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method Service for Verifing the Password's Reset Token
   * @access public
   * @async
   * @param {object} payload - Object contains user's token
   * @throws {ExpiredResetTokenError}
   * @returns {Promise<boolean>} If reset token is valid
   */
  async verifyEmailToken(payload) {
    try {
      const { token } = payload;
      console.log('resetToken is: ', token);

      //Check if the Reset token is already in the database or not
      const results = await DataAccessLayer.findResetToken(token);

      console.log(results.token_expire, new Date().toISOString());
      if (Helper.isResetTokenExpired(results.token_expire)) {
        throw new ExpiredResetTokenError();
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method Service for Reseting user's Password
   * @access public
   * @async
   * @param {object} payload - Object contains user's token, password, passwordConfirm
   * @throws {ExpiredResetTokenError}
   * @returns {Promise<boolean>} If reset token is valid
   */
  async resetPassword(payload) {
    try {
      const { token, password } = payload;

      //Check if the Reset token is already in the database or not
      const results = await DataAccessLayer.findResetToken(token);

      if (Helper.isResetTokenExpired(results.token_expire)) {
        throw new ExpiredResetTokenError();
      }

      //Hash the password
      const hashedPassword = await Helper.hashPassword(password);

      //Update the user's password
      const result = await DataAccessLayer.updatePassword(
        hashedPassword,
        'token',
        token
      );
    } catch (error) {
      throw error;
    }
  }
  async signup(payload) {
    try {
      const { password } = payload;

      payload.password = await Helper.hashPassword(password);

      const user = await DataAccessLayer.createUser(payload);

      const jwToken = Helper.signJWT(user.id);

      return { user, jwToken };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method Service for getting user's info
   * @access public
   * @async
   * @param {number} id - user's id
   * @returns {Promise<object>} users's info object
   */
  async getUser(id) {
    try {
      const user = await DataAccessLayer.getUserby('id', id);

      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method Service for updating user's info
   * @access public
   * @async
   * @param {object} payload - Object contains user's id, email and fullname
   * @returns {Promise<object>} users's info object
   */
  async updateUser(payload) {
    try {
      const { id, profile_img } = payload;
      if (profile_img) {
        const user = await DataAccessLayer.getUserby('id', id);
        // Delete old profile image
        if (user.profile_img) {
          const oldPhoto = helpers.getImagePublicId(user.profile_img);
          await this.deleteImage(oldPhoto);
        }
        // set new profile image
        const { url, public_id } = await this.uploadImage(
          profile_img,
          process.env.PROFILE_IMAGES_PRESET
        );
        payload.profile_img = url;
      }

      // update user with new data
      const user = await DataAccessLayer.updateUser(payload);
      user.profile_img = user.profile_img.split('|')[0];
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method Service for updating user's Password info
   * @access public
   * @async
   * @param {object} payload - Object contains user's id, oldPassword, newPassword
   * @returns {Promise<object>} users's info object
   */
  async updatePassword(payload) {
    try {
      const { id, oldPassword, newPassword } = payload;

      //Fetch the user information from the database
      const user = await DataAccessLayer.getUserby('id', id);

      //Compare the given password with the stored one
      const isMatched = await Helper.comparePasswords(
        oldPassword,
        user.password
      );

      //If the passwords do not match, Throw an Error
      if (isMatched === false) {
        throw new IncorrectPasswordError();
      }

      //Hash the new password
      const hashedPassword = await Helper.hashPassword(newPassword);

      //Store the new hashed password into the database
      await DataAccessLayer.updatePassword(hashedPassword, 'id', id);

      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }
  async thirdPartyAuth(payload) {
    try {
      const thirdParty_id = payload.thirdParty_id;
      let user = await DataAccessLayer.getUserbyThirdPartyID(thirdParty_id);
      console.log(user);
      if (!user) {
        await DataAccessLayer.createUser(payload);
      }
      user = await DataAccessLayer.getUserbyThirdPartyID(thirdParty_id);
      const jwToken = await Helper.signJWT(user.id);
      return { user, jwToken };
    } catch (error) {
      throw error;
    }
  }
  async uploadImage(base64Encodeing, preset) {
    try {
      const uploadedResponse = await cloudinary.uploader.upload(
        base64Encodeing,
        {
          upload_preset: preset,
        }
      );
      return uploadedResponse;
    } catch (e) {
      console.log({ error: 'Error in cloudinary service' });
      console.log(e);
      return {};
    }
  }
  async deleteImage(id) {
    try {
      await cloudinary.uploader.destroy(id);
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  async googleAuth(payload) {
    try {
      const user = await DataAccessLayer.googleAuth(payload);

      const jwToken = Helper.signJWT(user.id);

      return { user, jwToken };
    } catch (error) {
      throw error;
    }
  }

  async facebookAuth(payload) {
    try {
      const user = await DataAccessLayer.facebookAuth(payload);

      const jwToken = Helper.signJWT(user.id);

      return { user, jwToken };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Service();
