const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { googleAuth } = require('../domains/auth/controllers');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.G_CLIENT_ID,
      clientSecret: process.env.G_SECRET,
      callbackURL: 'https://sale-hunter.vercel.app/',
      passReqToCallback: true,
    },
    googleAuth
  )
);

passport.serializeUser(function (user, done) {
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});
