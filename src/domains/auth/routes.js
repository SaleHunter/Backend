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
const { celebrate, errors, Segments } = require('celebrate');

const controller = require('./controllers');
const validation = require('./validations');

const router = Router();

router.post(
  '/signin',
  celebrate({ [Segments.BODY]: validation.signin() }),
  asyncHandler(controller.signin)
);

router.post(
  '/signin',
  asyncHandler(validation.signup),
  asyncHandler(controller.signup)
);

router.use(errors());
module.exports = router;
