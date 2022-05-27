const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const controller = require('./controllers');
const validation = require('./validations');
const { isAuthenticated } = require('../shared/middlewares/Authentication');

const router = Router();
// user main routes
router.get(
  '/',
  asyncHandler(isAuthenticated),
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
  asyncHandler(validation.googleAuth),
  asyncHandler(controller.googleAuth)
);

router.post(
  '/auth/facebook',
  asyncHandler(validation.facebookAuth),
  asyncHandler(controller.facebookAuth)
);

module.exports = router;
