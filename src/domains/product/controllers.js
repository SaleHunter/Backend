const service = require('./services');
const publisher = require('../../pubSub/publisher');

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
    if (req.authenticated) publisher.publishProductView(productId, req.user.id);
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
      products = service.getRecommendedProductsByUserId(req.user.id);
    products = service.getTopProducts();

    res.status(200).json({
      status: 'success',
      Authenticated: authenticated,
      products,
    });
  }
}
module.exports = new Controller();
