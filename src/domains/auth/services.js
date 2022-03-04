const DataAccessLayer = require('./DAL');
const Helper = require('./helpers');
const { IncorrectPasswordError } = require('./errors');
const EmailService = require('../shared/services/email');

/**
 * @class
 * @classdesc Class for Authentication Services
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
      const user = await DataAccessLayer.getUserbyEmail(email);

      //Compare the given password with the stored one
      const isMatched = await Helper.comparePasswords(password, user.password);
      if (isMatched === false) {
        throw new IncorrectPasswordError();
      }

      //Sign jwToken for the user, so can access protected routes
      const jwToken = Helper.signJWT(user.id);

      //Return the user info and jwToken
      //Exclude password from user info
      delete user.password;
      return { user, jwToken };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method Service for Serving Forget Password by sending token if browser client or pin if mobile to given email
   * @access public
   * @async
   * @param {object} payload - Object contains user's email
   * @throws {IncorrectPasswordError}
   * @returns {Promise<void>} User's info and jwToken
   */
  async forgetPassword(payload, client) {
    try {
      const { email } = payload;

      //Fetch the user information from the database
      const user = await DataAccessLayer.getUserbyEmail(email);
      console.log(user);

      let token;
      //Generate Reset Token if Request comming from browser
      if (client !== 'mobile') token = await Helper.generateResetToken(12);
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
}

module.exports = new Service();
