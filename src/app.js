const express = require('express');
const logger = require('morgan');

const app = express();

//Global middlewares
//Request Logger
app.use(logger('dev'));
//Allowing app to recieve and parse json in request body
app.use(express.json());
//------------------
const cookieParser = require('cookie-parser');
// Middleware

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/logout', (req, res) => {
  res.clearCookie('session-token');
  res.redirect('/login');
});

//------------------
//Authentication Router
app.use('/api/v1/auth/', require('./api/routes/authRoutes.js'));

module.exports = app;
