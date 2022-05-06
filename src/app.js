const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const cookieParser = require('cookie-parser');

const swaggerDocs = require('./config/swagger-specs');
const {
  errorLogger,
  globalErrorHandler,
} = require('./api/error/errorHandlers');

const app = express();

//Request Logger
app.use(logger('dev'));

//Allowing app to recieve and parse json in request body
app.use(express.json({ limit: '50mb' }));

//Parse Cookies into req.cookies
app.use(cookieParser());

//Configure Swagger API documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(function (req, res, next) {
  console.log(req.headers);
  res.set('Content-Type', 'application/json;charset=UTF-8');
  // res.set('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.set(
    'Access-Control-Allow-Origin',
    'http://localhost:3000,https://localhost:3000,https://sale-hunter.vercel.app,http://sale-hunter.vercel.app,https://192.168.1.2:3000'
  );
  // res.header('Access-Control-Allow-Origin', 'https://localhost:3000');
  // res.header('Access-Control-Allow-Origin', 'https://sale-hunter.vercel.app');
  // res.header('Access-Control-Allow-Origin', 'http://sale-hunter.vercel.app');
  // res.header('Access-Control-Allow-Origin', 'https://192.168.1.2:3000');
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Expose-Headers', '*, Authorization');
  res.set(
    'set-Control-Allow-Headers',
    '*, Origin, X-Requested-With, Content-Type, Accept, Authorization, language, lan, lat'
  );
  res.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS,PATCH');

  next();
});

// All Routes
//Product Router
app.use('/api/v1/products', require('./domains/product/routes'));

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
  if (err.operational !== undefined && err.operational === true) {
    console.log('YAAAAAA');
    return res.status(err.statusCode).json({
      status: err.status || 'Error',
      message: err.message,
    });
  } else
    return res.status(500).json({
      status: 'Error',
      message: 'Something went wrong',
    });
});

module.exports = app;
