/**
 * TODO: Implement Error handlers
 * 1. Extend errors from base error when needed (apply OCP Princples).
 */
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

class FailedToSignUp extends BaseError {
  constructor(email) {
    super(`sign up failed: ${email}`);
    this.statusCode = 501;
    this.status = 'Fail';
  }
}

module.exports = { NoUserFoundError, IncorrectPasswordError, FailedToSignUp };
