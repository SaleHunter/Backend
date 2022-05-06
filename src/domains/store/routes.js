const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const controller = require('./controllers');
const validation = require('./validations');
const {
  isAuthenticatedWithOutException,
  isAuthenticated,
} = require('../shared/middlewares/Authentication');
const router = Router();

router.get(
  '/',
  asyncHandler(isAuthenticated),
  asyncHandler(controller.getAllStores)
);

router
  .route('/:id')
  .get(
    asyncHandler(isAuthenticated),
    asyncHandler(validation.getStoreById),
    asyncHandler(controller.getStoreById)
  );

module.exports = router;
