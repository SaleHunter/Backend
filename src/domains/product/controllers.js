const service = require('./services');

class Controller {
  async searchForProducts(req, res, next) {
    const products = await service.searchForProducts(req.query, req.headers);

    res.status(200).json({
      status: 'success',
      results: products.length,
      products,
    });
  }

  async getProductById(req, res, next) {
    const productId = req.params.id;
    const product = await service.getProductById(productId);

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
}
module.exports = new Controller();
