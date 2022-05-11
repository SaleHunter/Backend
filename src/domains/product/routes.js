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

// search for products
router.get(
  '/',
  asyncHandler(prepareQueryObj),
  asyncHandler(validation.searchForProducts),
  asyncHandler(isAuthenticatedWithOutException),
  asyncHandler(controller.searchForProducts)
);

router.get(
  '/favourites',
  asyncHandler(isAuthenticated),
  asyncHandler(controller.getFavouriteProductsForUser)
);

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

router.get(
  '/recommended',
  (req, res, next) => {
    console.log('HERE in recommended');
    next();
  },
  asyncHandler(isAuthenticatedWithOutException),
  asyncHandler(controller.recommendProductsForUser)
);

router.get(
  '/viewed',
  asyncHandler(isAuthenticated),
  asyncHandler(controller.getViewedProductsForUser)
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

module.exports = router;
