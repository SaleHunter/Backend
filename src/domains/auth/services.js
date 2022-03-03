const DataAccessLayer = require('./DAL');
const Helper = require('./helpers');
const { IncorrectPasswordError } = require('./errors');

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
}

module.exports = new Service();
