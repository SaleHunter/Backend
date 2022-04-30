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
  asyncHandler(controller.searchForProducts)
);

router.get(
  '/favourites',
  asyncHandler(isAuthenticated),
  asyncHandler(controller.getFavouriteProductsForUser)
);

router
  .use(asyncHandler(isAuthenticated))
  .route('/favourites/:productId')
  .post(asyncHandler(controller.addProductToFavourites))
  .delete(asyncHandler(controller.removeProductFromFavourites));

router.get(
  '/recommended',
  asyncHandler(isAuthenticatedWithOutException),
  asyncHandler(controller.recommendProductsForUser)
);

router.get(
  '/:id',
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

module.exports = router;
