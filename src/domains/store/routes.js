const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const controller = require('./controllers');
const validation = require('./validations');
const {
  isAuthenticatedWithOutException,
  isAuthenticated,
} = require('../shared/middlewares/Authentication');
const router = Router();

router.post(
  '/',
  asyncHandler(isAuthenticated),
  asyncHandler(validation.createStore),
  asyncHandler(controller.createStore)
);

router
  .route('/:id')
  .get(
    asyncHandler(validation.getStoreById),
    asyncHandler(controller.getStoreById)
  )
  .delete(
    asyncHandler(isAuthenticated),
    asyncHandler(validation.deleteStoreById),
    asyncHandler(controller.deleteStoreById)
  )
  .patch(
    asyncHandler(isAuthenticated),
    asyncHandler(validation.updateStoreById),
    asyncHandler(controller.updateStoreById)
  );

module.exports = router;
