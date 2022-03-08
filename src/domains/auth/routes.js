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
const Email = require('../shared/services/email');

const controller = require('./controllers');
const validation = require('./validations');

const router = Router();

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

require('../../libraries/passport')(controller.googleAuth);

router.get(
  '/googleAuth',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  'https://sale-hunter.vercel.app/',
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
