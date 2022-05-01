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
}
module.exports = new Controller();
