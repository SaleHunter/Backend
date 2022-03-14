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
const isAuthenticated = require('../shared/middlewares/isAuthenticated');

const router = Router();
// user main routes
router.get(
  '/',
  asyncHandler(isAuthenticated),
  asyncHandler(validation.getUser),
  asyncHandler(controller.getUser)
);
router.patch(
  '/',
  asyncHandler(isAuthenticated),
  asyncHandler(validation.updateUser),
  asyncHandler(controller.updateUser)
);
router.patch(
  '/updatePassword',
  asyncHandler(isAuthenticated),
  asyncHandler(validation.updatePassword),
  asyncHandler(controller.updatePassword)
);

// user authentication routes
router.post(
  '/auth/signin',
  asyncHandler(validation.signin),
  asyncHandler(controller.signin)
);

router.post(
  '/auth/forgetPassword',
  asyncHandler(validation.forgetPassword),
  asyncHandler(controller.forgetPassword)
);

router.get(
  '/auth/verifyResetToken/:resetToken',
  asyncHandler(validation.verifyResetToken),
  asyncHandler(controller.verifyResetToken)
);

router.patch(
  '/auth/resetPassword/:resetToken',
  asyncHandler(validation.resetPassword),
  asyncHandler(controller.resetPassword)
);

router.post(
  '/auth/signup',
  asyncHandler(validation.signup),
  asyncHandler(controller.signup)
);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/v1/users/auth/google/fail',
    successRedirect: '/api/v1/users/auth/google/success',
  })
);

router.get('/auth/google/success', (req, res) => {
  res.json({
    status: 'success',
    user: req.user,
  });
});

router.get('/auth/google/fail', (req, res) => {
  res.json({
    status: 'failed',
  });
});

router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['email', 'profile'] })
);

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/api/v1/users/auth/facebook/fail',
    successRedirect: '/api/v1/users/auth/facebook/success',
  })
);

router.get('/auth/facebook/success', (req, res) => {
  res.json({
    status: 'success',
    user: req.user,
  });
});

router.get('/auth/facebook/fail', (req, res) => {
  res.json({
    status: 'failed',
  });
});

module.exports = router;
