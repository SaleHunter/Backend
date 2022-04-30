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

class ProductAlreadyInFavourites extends BaseError {
  /**
   * Creating a ProductAlreadyInFavourites
   */
  constructor() {
    super(`Product is already in your favorites`);
    this.statusCode = 409;
    this.status = 'Fail';
  }
}

module.exports = { NoProductFoundError, ProductAlreadyInFavourites };
