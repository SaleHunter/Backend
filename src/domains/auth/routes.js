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

router.get(
  '/thirdParty/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/thirdParty/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/v1/auth/thirdParty/google/fail',
    successRedirect: '/api/v1/auth/thirdParty/google/success',
  })
);

router.get('/thirdParty/google/success', (req, res) => {
  res.json({
    status: 'success',
    user: req.user,
  });
});

router.get('/thirdParty/google/fail', (req, res) => {
  res.json({
    status: 'failed',
  });
});

router.get(
  '/thirdParty/facebook',
  passport.authenticate('facebook', { scope: ['email', 'profile'] })
);

router.get(
  '/thirdParty/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/api/v1/auth/thirdParty/facebook/fail',
    successRedirect: '/api/v1/auth/thirdParty/facebook/success',
  })
);

router.get('/thirdParty/facebook/success', (req, res) => {
  res.json({
    status: 'success',
    user: req.user,
  });
});

router.get('/thirdParty/facebook/fail', (req, res) => {
  res.json({
    status: 'failed',
  });
});

module.exports = router;
