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
    const product = await service.getProductById(req.params.id);

    res.status(200).json({
      status: 'success',
      product,
    });
  }

  async recommendProductsForUser(req, res, next) {
    const canRecommend = req.canRecommend;
    let products = [];
    if (canRecommend)
      products = service.getRecommendedProductsByUserId(req.user.id);
    products = service.getTopProducts();

    res.status(200).json({
      status: 'success',
      Authenticated: canRecommend,
      products,
    });
  }
}
module.exports = new Controller();
