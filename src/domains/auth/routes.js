/**
 * TODO: add (migrate) all auth routes
 * 1. login route
 * 2. signup route
 * 3. third-party route
 * 4. forget-password route
 * 5. verify-resetToken route
 * 6. reset password route
 */

const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const initializePassport = require('../../libraries/passport');

const controller = require('./controllers');
const validation = require('./validations');

initializePassport(passport);

const router = Router();

// express-flash
router.use(flash());

// session
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
//passport
router.use(passport.initialize());
router.use(passport.session());

router.post(
  '/signin',
  asyncHandler(validation.signin),
  asyncHandler(controller.signin)
);

router.post(
  '/forgetPassword',
  asyncHandler(validation.forgetPassword),
  asyncHandler(controller.forgetPassword)
);

router.get(
  '/verifyResetToken/:resetToken',
  asyncHandler(validation.verifyResetToken),
  asyncHandler(controller.verifyResetToken)
);

router.patch(
  '/resetPassword/:resetToken',
  asyncHandler(validation.resetPassword),
  asyncHandler(controller.resetPassword)
);

router.post(
  '/signup',
  asyncHandler(validation.signup),
  asyncHandler(controller.signup)
);

router.post(
  '/thirdparty',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/',
  passport.authenticate('google', {
    successRedirect: 'https://sale-hunter.vercel.app/',
    failureRedirect: 'https://sale-hunter.vercel.app/signin-failed',
  })
);

router.get('https://sale-hunter.vercel.app/signin-failed', (req, res) => {
  res.sendStatus(404);

  res.send('Failed to login using google');
});

module.exports = router;
