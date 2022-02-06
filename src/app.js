const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
// const swaggerJsDoc = require('swagger-jsdoc');

const swaggerSpecs = require('./config/swagger');
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
// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'SaleHunter RESTful API',
//       version: '1.0.0',
//       description: 'A dedicated RESTful API for SaleHunter',
//     },
//     servers: [
//       {
//         url: 'http://localhost:4000',
//       },
//     ],
//   },
//   apis: ['./src/api/routes/*.js'],
// };

// const swaggerSpecs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
// console.log(swaggerSpecs);

// ALl Routes
//Authentication Router
app.use('/api/v1/auth/', require('./api/routes/authRoutes.js'));

//Error Handlers
// 1- Error Logger
app.use(errorLogger);

// 2- Globale Error Handler
app.use(globalErrorHandler);

module.exports = app;
