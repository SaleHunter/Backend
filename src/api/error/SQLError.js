function aOrAn(word) {
  return ['a', 'e', 'o', 'u', 'i'].some(vowle => word.startsWith(vowle))
    ? 'an'
    : 'a';
}

class SQLError extends Error {
  constructor() {
    super();

    Object.setPrototypeOf(this, new.target.prototype);
    this.message;
    this.statusCode;
    this.name = this.constructor.name;
    this.type = 'SQL';

    Error.captureStackTrace(this);
  }

  duplicateEntry(entity, attributeName, attributeValue) {
    this.statusCode = 400;
    this.message = `There is already ${aOrAn(
      entity
    )} ${entity} with ${attributeName}: ${attributeValue}`;

    return this;
  }

  noEntityFound(entity, attributeName, attributeValue) {
    this.statusCode = 404;
    this.message = `There is no ${entity} with ${aOrAn(
      entity
    )} ${attributeName}: ${attributeValue}`;

    return this;
  }

  incorrectPassword() {
    this.statusCode = 400;
    this.message = `Incorrect password, please try again with the correct password`;

    return this;
  }

  invalidResetToken() {
    this.statusCode = 404;
    this.message = `Invalid Reset Token, please try again with the correct token`;

    return this;
  }

  resetTokenExpired() {
    this.statusCode = 400;
    this.message = `Reset Token Expired, please request another reset token and try again`;

    return this;
  }
}

module.exports = SQLError;
