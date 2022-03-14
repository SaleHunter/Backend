const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const exphbs = require('express-handlebars');
var path = require('path');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

require('./libraries/passport')(passport);
// const swaggerJsDoc = require('swagger-jsdoc');
const swaggerDocs = require('./config/swagger-specs');
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
// app.set('view engine', '.hbs');
// app.set('views', path.join(__dirname, 'views'));

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

// app.use(express.static(path.join(__dirname, 'public')));
//Global middlewares

//Enable all CORS requests
app.use(
  cors({
    exposedHeaders: 'Authorization',
    origin: 'https://localhost:3000',
    credentials: true,
  })
);

//Request Logger
app.use(logger('dev'));

//Allowing app to recieve and parse json in request body
app.use(express.json());

//Parse Cookies into req.cookies
app.use(cookieParser());

//Configure Swagger API documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, PUT, POST, DELETE, HEAD, OPTIONS'
  );

  next();
});

// All Routes
//User Router
app.use('/api/v1/users', require('./domains/user/routes'));

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

// 3- Global Error Handler
app.use((err, req, res, next) => {
  return res.status(err.statusCode).json({
    status: err.status || 'Error',
    message: err.message,
  });
});

module.exports = app;
