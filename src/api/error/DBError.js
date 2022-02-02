class DBError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.type = 'db';
  }
}

module.exports = DBError;
