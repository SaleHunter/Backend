const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const exphbs = require('express-handlebars');
var path = require('path');
const passport = require('passport');
const cookieSession = require('cookie-session');

// const swaggerJsDoc = require('swagger-jsdoc');
require('./libraries/passport')(passport);
const swaggerSpecs = require('./config/swagger');
const {
  errorLogger,
  globalErrorHandler,
} = require('./api/error/errorHandlers');

const app = express();

// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require('./helpers/hbs');
const exp = require('constants');

// Handlebars
app.engine(
  '.hbs',
  exphbs.engine({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// setup cookies
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
//Global middlewares

//Enable all CORS requests
app.use(cors());

//Request Logger
app.use(logger('dev'));
console.log(app.get('env'));
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

app.use('/api/v1/auth/', require('./domains/auth/routes'));

app.get('/', (req, res) => {
  res.render('login', {
    layout: 'login',
  });
});
app.get('/dashboard', (req, res) => {
  res.render('dashboard', {
    name: 'youssef',
  });
});
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
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

// 3- Globale Error Handler
app.use((err, req, res, next) => {
  res.status(err.statusCode).json({
    status: err.status || 'Error',
    message: err.message,
  });
});

module.exports = app;
