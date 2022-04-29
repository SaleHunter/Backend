const BaseError = require('../shared/errors/BaseError');

class NoProductFoundError extends BaseError {
  /**
   * Creating a NoProductFoundError
   */
  constructor() {
    super(`There is no product Found`);
    this.statusCode = 404;
    this.status = 'Fail';
  }
}

module.exports = { NoProductFoundError };
