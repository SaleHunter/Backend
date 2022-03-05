const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
  hash(password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}

module.exports = new Helper();
