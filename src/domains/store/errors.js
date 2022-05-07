const BaseError = require('../shared/errors/BaseError');

class NoStoreFoundError extends BaseError {
  /**
   * Creating a NoStoreFoundError
   */
  constructor() {
    super(`You don't have store with this id`);
    this.statusCode = 404;
    this.status = 'Fail';
  }
}

module.exports = { NoStoreFoundError };
