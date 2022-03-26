const service = require('./services');
const products = require('./DAL');
class Controller {
  async searchForProducts(req, res, next) {
    const all_products = await products.query();
    res.status(200).json({
      status: 'success',
      results: all_products.length,
      all_products,
    });
  }

  async getProductById(req, res, next) {
    const product = await service.getProductById(req.params.id);

    res.status(200).json({
      status: 'success',
      product,
    });
  }
}
module.exports = new Controller();
