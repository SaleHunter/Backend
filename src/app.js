const express = require('express');
const logger = require('morgan');

const app = express();

//Global middlewares

//Request Logger
app.use(logger('dev'));
//Allowing app to recieve and parse json in request body
app.use(express.json());
//Authentication Router
app.use('/api/v1/auth/', require('./api/routes/authRoutes.js'));

//Error Handler
app.use(function (error, req, res, next) {
  res.status(error.statusCode).json({
    status: 'error',
    message: error.message,
  });
});

module.exports = app;
