const GoogleTokenStrategy = require('passport-google-oauth-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const {
  googleStrategyHandler,
  facebookStrategyHandler,
} = require('../domains/user/controllers');

module.exports = function initializePassport(passport) {
  // Initializing Google Strategy
  passport.use(
    new GoogleTokenStrategy(
      {
        clientID: process.env.G_CLIENT_ID,
        clientSecret: process.env.G_SECRET,
      },
      function (accessToken, refreshToken, profile, done) {
        console.log(accessToken);
        googleStrategyHandler(
          accessToken,
          refreshToken,
          profile,
          function (err, user) {
            return done(err, user);
          }
        );
      }
    )
  );

  // Initialize Facebook Strategy
  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: process.env.F_CLIENT_ID,
        clientSecret: process.env.F_SECRET,
        fbGraphVersion: 'v13.0',
      },
      function (accessToken, refreshToken, profile, done) {
        console.log(accessToken);

        facebookStrategyHandler(
          accessToken,
          refreshToken,
          profile,
          function (err, user) {
            return done(err, user);
          }
        );
      }
    )
  );
};
