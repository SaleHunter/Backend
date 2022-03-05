const SQLError = require('./SQLError');

function errorLogger(err, req, res, next) {
  console.error(err);
  next(err);
}

function globalErrorHandler(err, req, res, next) {
  // Check if the error has a type attribute i.e user defined error
  if (err.type) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  } else {
    return res.status(err.statusCode || 500).json({
      status: 'error',
      err,
    });
  }
}

module.exports = { errorLogger, globalErrorHandler };
