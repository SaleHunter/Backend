const BaseError = require('../shared/errors/BaseError');

/**
 * @class
 * @classdesc Represents a class for No User Found in database
 * @extends BaseError
 */
class NoUserFoundError extends BaseError {
  /**
   * Creating a NoUserFoundError
   * @param {string} email - The email of the user
   */
  constructor(email) {
    super(`There is no user with given email: ${email}`);
    this.statusCode = 404;
    this.status = 'Fail';
  }
}

/**
 * @class
 * @classdesc Represents a class for Incorrect password Error
 * @extends BaseError
 */
class IncorrectPasswordError extends BaseError {
  /**
   * Creating an IncorrectPasswordError
   */
  constructor() {
    super(`Incorrect password`);
    this.statusCode = 400;
    this.status = 'Fail';
  }
}
module.exports = { NoUserFoundError, IncorrectPasswordError };
