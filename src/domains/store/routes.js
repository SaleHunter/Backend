const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const controller = require('./controllers');
const validation = require('./validations');
const {
  isAuthenticatedWithOutException,
  isAuthenticated,
  isOwningTheStore,
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

// add products to the store
router
  .route('/:storeId/products')
  .post(
    asyncHandler(isAuthenticated),
    asyncHandler(isOwningTheStore),
    asyncHandler(validation.validateStoreProducts),
    asyncHandler(controller.addProductToStore)
  );

// delete products from the store
router
  .route('/:storeId/products/:productId')
  .delete(
    asyncHandler(isAuthenticated),
    asyncHandler(isOwningTheStore),
    asyncHandler(validation.validateStoreProducts),
    asyncHandler(controller.deleteProductFromStore)
  );

// update products in the store
router
  .route('/:storeId/products/:productId')
  .patch(
    asyncHandler(isAuthenticated),
    asyncHandler(isOwningTheStore),
    asyncHandler(validation.validateStoreProducts),
    asyncHandler(controller.updateProductInStore)
  );

module.exports = router;
