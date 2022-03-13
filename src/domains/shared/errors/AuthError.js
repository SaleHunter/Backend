const BaseError = require('./BaseError');

class UnAuthorizedError extends BaseError {
  constructor() {
    super(`User not signed in, Please sign in and try again later`);
    this.statusCode = 401;
    this.status = 'Fail';
  }
}

module.exports = { UnAuthorizedError };
