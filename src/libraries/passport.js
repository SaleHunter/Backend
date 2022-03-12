const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const DAL = require('../domains/auth/DAL');
const helpers = require('../domains/auth/helpers');
const { googleAuth, facebookAuth } = require('../domains/auth/controllers');

function initializePassport(passport) {
  // Initializing Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.G_CLIENT_ID,
        clientSecret: process.env.G_SECRET,
        callbackURL:
          'http://localhost:6200/api/v1/auth/thirdParty/google/callback',
        passReqToCallback: true,
      },
      googleAuth
    )
  );

  // Initialize Facebook Strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.F_CLIENT_ID,
        clientSecret: process.env.F_SECRET,
        callbackURL:
          'http://localhost:6200/api/v1/auth/thirdParty/facebook/callback',
        passReqToCallback: true,
        profileFields: ['email', 'id', 'name'],
      },
      facebookAuth
    )
  );

  // post jwt into cookies
  passport.serializeUser((token, done) => {
    return done(null, token);
  });

  // restore token from cookies and decode it
  // return user to the req

  /**
   * TODO: separate what varies
   * mode getting user and decoding token from here
   */
  passport.deserializeUser(async (token, done) => {
    // console.log('iam the problem', token);
    // return done(null, token);
    const { id } = helpers.restoreFromJWT(token);
    const user = await DAL.getUserbyID(id);
    return done(null, { ...user });
  });
}
module.exports = initializePassport;
