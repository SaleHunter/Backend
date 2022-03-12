const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');

const swaggerDocs = require('./config/swagger-specs');
const {
  errorLogger,
  globalErrorHandler,
} = require('./api/error/errorHandlers');

const app = express();

//Global middlewares

//Enable all CORS requests
app.use(cors());

//Request Logger
app.use(logger('dev'));

//Allowing app to recieve and parse json in request body
app.use(express.json());

//Configure Swagger API documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// All Routes
//User Router
app.use('/api/v1/users', require('./domains/user/routes'));

//Error Handlers
// 1- Error Logger
app.use(errorLogger);

//Handle Validation Errors
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    console.log('HERE: ', err.name);
    return res.status(400).json({
      status: 'Fail',
      message: 'Validation Error',
      details: err.message,
    });
  }

  next(err);
});

// 3- Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.statusCode).json({
    status: err.status || 'Error',
    message: err.message,
  });
});

module.exports = app;
