const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const controller = require('./controllers');
const validation = require('./validations');
const { prepareQueryObj } = require('./middlewares');
const {
  isAuthenticatedWithOutException,
  isAuthenticated,
} = require('../shared/middlewares/Authentication');
const router = Router();

// auto complete for search bar
router.get(
  '/search',
  asyncHandler(isAuthenticatedWithOutException),
  asyncHandler(validation.autoCompleteSearch),
  asyncHandler(controller.autoCompleteSearch)
);

// search for products
router.get(
  '/',
  asyncHandler(prepareQueryObj),
  asyncHandler(validation.searchForProducts),
  asyncHandler(isAuthenticatedWithOutException),
  asyncHandler(controller.searchForProducts)
);


// search for favorite products
router.get(
  '/favourites',
  asyncHandler(isAuthenticated),
  asyncHandler(controller.getFavouriteProductsForUser)
);

// post/delete favorite product by id
router
  .route('/favourites/:productId')
  .post(
    asyncHandler(isAuthenticated),
    asyncHandler(validation.operationsOnFavourites),
    asyncHandler(controller.addProductToFavourites)
  )
  .delete(
    asyncHandler(isAuthenticated),
    asyncHandler(validation.operationsOnFavourites),
    asyncHandler(controller.removeProductFromFavourites)
  );

// get recommended products
router.get(
  '/recommended',
  (req, res, next) => {
    console.log('HERE in recommended');
    next();
  },
  asyncHandler(isAuthenticatedWithOutException),
  asyncHandler(controller.recommendProductsForUser)
);

// get viewed products
router.get(
  '/viewed',
  asyncHandler(isAuthenticated),
  asyncHandler(controller.getViewedProductsForUser)
);

// get product by id
router.get(
  '/sales',
  asyncHandler(isAuthenticatedWithOutException),
  asyncHandler(controller.getProductsOnSale)
);

router.get(
  '/:id',
  (req, res, next) => {
    console.log('HERE in get product');
    next();
  },
  asyncHandler(validation.getProductById),
  asyncHandler(isAuthenticatedWithOutException),
  asyncHandler(async (req, res, next) => {
    const publisher = require('../../pubSub/publisher');

    if (req.authenticated)
      publisher.publishProductView(req.params.id, req.user.id);

    await next();
  }),
  asyncHandler(controller.getProductById)
);

router.patch(
  '/:productId/rating',
  asyncHandler(isAuthenticated),
  asyncHandler(validation.changeProductRating),
  asyncHandler(controller.changeProductRating)
);

// create product
router.post(
  '/',
  asyncHandler(isAuthenticated),
  asyncHandler(validation.createProduct),
  asyncHandler(controller.createProduct)
);

// delete product
router.delete(
  '/:productId',
  asyncHandler(isAuthenticated),
  asyncHandler(validation.deleteProductById),
  asyncHandler(controller.deleteProductById)
);

// update product
router.patch(
  '/:productId',
  asyncHandler(isAuthenticated),
  asyncHandler(validation.updateProduct),
  asyncHandler(controller.updateProductById)
);

module.exports = router;
