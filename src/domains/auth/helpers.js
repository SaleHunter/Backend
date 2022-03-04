const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * @class
 * @classdesc Represents Helper Class with alot of helping and reusable methods for Auth Domain
 */
class Helper {
  /**
   * @method Compare given password against password of the user stored in database
   * @access public
   * @async
   * @param {string} givenPassword - The given password of the user
   * @param {string} storedPassword - The stored password of the user in the database
   * @returns {Promise<boolean>} If passwords matched or not
   */
  async comparePasswords(givenPassword, storedPassword) {
    const isMatched = await bcrypt.compare(givenPassword, storedPassword);

    return isMatched;
  }

  /**
   * Sign a new jwt for the user with his id as payload
   * @access public
   * @param {UUID} id - the user id as jwt payload
   * @returns {string} the new jwt for the user
   */
  signJWT(id) {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '90d',
    });

    return token;
  }

  /**
   * Generate a new Reset Token for the user
   * @access public
   * @param {Number} size - The size of the reset token
   * @async
   * @returns {Promise<string>} the new Reset Token for the user
   */
  async generateResetToken(size = 8) {
    const resetToken = await crypto.randomBytes(size).toString('hex');

    return resetToken;
  }

  /**
   * Generate a new Reset Pin for the user if request comming from mobile app
   * @access public
   * @returns {number} the new Reset pin for the user
   */
  generateResetPin() {
    const resetPin = Math.floor(100000 + Math.random() * 900000);

    return resetPin;
  }
}

module.exports = new Helper();
