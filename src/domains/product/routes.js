/**
 * TODO: add all product routes
 * 1. search for products
 * 2. get product by id
 */

const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const controller = require('./controllers');
const validation = require('./validations');
const { prepareQueryObj } = require('./middlewares');
const router = Router();

// search for products
router.get(
  '/',
  asyncHandler(prepareQueryObj),
  asyncHandler(validation.searchForProducts),
  asyncHandler(controller.searchForProducts)
);

router.get(
  '/:id',
  asyncHandler(validation.getProductById),
  asyncHandler(controller.getProductById)
);
module.exports = router;
