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

/**
 * @class
 * @classdesc Represents a class for Invalid Reset Token Error
 * @extends BaseError
 */
class InvalidResetTokenError extends BaseError {
  /**
   * Creating an InvalidResetTokenError
   */
  constructor() {
    super(`Invalid Reset Token, Please try again with the correct one`);
    this.statusCode = 404;
    this.status = 'Fail';
  }
}

/**
 * @class
 * @classdesc Represents a class for Expired Reset Token Error
 * @extends BaseError
 */
class ExpiredResetTokenError extends BaseError {
  /**
   * Creating an  ExpiredResetTokenError
   */
  constructor() {
    super(`Expired Reset Token, Please request another one`);
    this.statusCode = 400;
    this.status = 'Fail';
  }
}
module.exports = {
  NoUserFoundError,
  IncorrectPasswordError,
  InvalidResetTokenError,
  ExpiredResetTokenError,
};
