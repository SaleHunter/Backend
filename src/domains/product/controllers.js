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
}
module.exports = new Controller();
