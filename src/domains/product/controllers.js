const service = require('./services');

class Controller {
  async searchForProducts(req, res, next) {
    let userId = 0;
    if (req.user) userId = req.user.id;

    const { products, totalProductsNumber, categories, brands } =
      await service.searchForProducts(req.query, req.headers, userId);

    res.status(200).json({
      status: 'success',
      results: products.length,
      totalProductsNumber,
      products,
      categories,
      brands,
    });
  }

  async getProductById(req, res, next) {
    const productId = req.params.id;
    let userId = 0;
    if (req.user) userId = req.user.id;
    const product = await service.getProductById(productId, userId);
    res.status(200).json({
      status: 'success',
      product,
    });
  }

  async recommendProductsForUser(req, res, next) {
    const canRecommend = req.authenticated;
    let products = [];
    if (canRecommend)
      products = await service.getRecommendedProductsByUserId(req.user.id);
    else products = await service.getTopProducts();

    res.status(200).json({
      status: 'success',
      Authenticated: canRecommend,
      results: products.length,
      products,
    });
  }

  async getFavouriteProductsForUser(req, res, next) {
    const userId = req.user.id;

    let products = [];

    products = await service.getFavouriteProductsForUser(userId);

    res.status(200).json({
      status: 'success',
      results: products.length,
      products,
    });
  }

  async addProductToFavourites(req, res, next) {
    const userId = req.user.id,
      productId = req.params.productId;

    await service.addProductToFavourites(userId, productId);

    return res.status(201).json({
      status: 'success',
      message: 'Product successfully added to your Favourites',
    });
  }

  async removeProductFromFavourites(req, res, next) {
    const userId = req.user.id,
      productId = req.params.productId;

    console.log('HERERERERERER', userId, productId);

    await service.removeProductFromFavourites(userId, productId);

    return res.status(204).json();
  }

  async getViewedProductsForUser(req, res, next) {
    const userId = req.user.id;

    const products = await service.getViewedProductsForUser(userId);
    res.status(200).json({
      status: 'success',
      results: products.length,
      products,
    });
  }

  async getProductsOnSale(req, res, next) {
    const userId = req.user.id;
    const products = await service.getProductsOnSale(userId);

    res.status(200).json({
      status: 'success',
      results: products.length,
      products,
    });
  }

  async changeProductRating(req, res, next) {
    const userId = req.user.id,
      productId = req.params.productId,
      rating = req.body.rating;

    await service.changeProductRating(userId, productId, rating);

    res.status(200).json({
      status: 'success',
      message: 'Rating successfully changed for this product',
    });
  }
}
module.exports = new Controller();
