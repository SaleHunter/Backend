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
const helpers = require('./helpers');

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
  '/verifyEmail',
  asyncHandler(validation.verifyEmail),
  asyncHandler(controller.verifyEmail)
);

router.get(
  '/verifyEmailToken/:resetToken',
  asyncHandler(validation.verifyEmailToken),
  asyncHandler(controller.verifyEmailToken)
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

router.post(
  '/auth/google',
  controller.googleAuth
);

router.post(
  '/auth/facebook',
  passport.authenticate('facebook-token', { session: false }),
  controller.socialAuthHandler
);

module.exports = router;
