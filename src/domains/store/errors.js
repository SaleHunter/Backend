const BaseError = require('../shared/errors/BaseError');

class NoStoreFoundError extends BaseError {
  /**
   * Creating a NoStoreFoundError
   */
  constructor() {
    super(`There is no store with this id`);
    this.statusCode = 404;
    this.status = 'Fail';
  }
}

class AlreadyHaveStoreError extends BaseError {
  /**
   * Creating an AlreadyHaveStoreError
   */
  constructor() {
    super(`You Already Own a Store`);
    this.statusCode = 403;
    this.status = 'Fail';
  }
}
module.exports = { NoStoreFoundError, AlreadyHaveStoreError };
