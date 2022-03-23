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
}
module.exports = new Controller();
