/**
 * TODO: implement General baseError class and export it
 */

/**
 * @class
 * @classdesc Represents a The Base Error class
 * @extends Error
 */
class BaseError extends Error {
  constructor(message) {
    super(message);
    this.operational = true;
  }
}

module.exports = BaseError;
