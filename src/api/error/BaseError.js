//Used if There is an internal server error and you want to hide it form the client
class BaseError extends Error {
  constructor() {
    super();

    Object.setPrototypeOf(this, new.target.prototype);
    this.message;
    this.satusCode;
    this.name = this.constructor.name;
    this.type = 'BASE';
    this.additionalInfo = null;

    Error.captureStackTrace(this);
  }
  customeError(message, statusCode, additionalInfo = null) {
    this.message = message;
    this.statusCode = statusCode;
    this.additionalInfo = additionalInfo;

    return this;
  }

  somethingWentWrong() {
    this.satusCode = 500;
    this.message = 'Something went wrong';

    return this;
  }
}

module.exports = BaseError;
