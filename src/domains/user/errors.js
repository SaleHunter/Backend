const BaseError = require('../shared/errors/BaseError');

/**
 * @class
 * @classdesc Represents a class for No User Found in database
 * @extends BaseError
 */
class NoUserFoundError extends BaseError {
  /**
   * Creating a NoUserFoundError
   */
  constructor() {
    super(`There is no user Found`);
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
    this.statusCode = 401;
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
class FailedToSignUp extends BaseError {
  constructor(email) {
    super(`sign up failed: ${email}`);
    this.statusCode = 501;
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

/**
 * @class
 * @classdesc Represents a class for User Already Exits Error
 * @extends BaseError
 */
class UserAlreadyExitsError extends BaseError {
  /**
   * Creating an UserAlreadyExitsError
   */
  constructor() {
    super(`User Already Exits, Please try again with another email`);
    this.statusCode = 409;
    this.status = 'Fail';
  }
}
module.exports = {
  NoUserFoundError,
  IncorrectPasswordError,
  InvalidResetTokenError,
  ExpiredResetTokenError,
  FailedToSignUp,
  UserAlreadyExitsError,
};
