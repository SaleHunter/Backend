const service = require('./services');

class Controller {
  async getAllStores(req, res, next) {
    const userId = req.user.id;

    const stores = await service.getAllStores(userId);

    res.status(200).json({
      status: 'success',
      results: stores.length,
      stores,
    });
  }

  async getStoreById(req, res, next) {
    const userId = req.user.id,
      storeId = req.params.id;

    const stores = [];

    res.status(200).json({
      status: 'success',
      results: stores.length,
      stores,
    });
  }
}

module.exports = new Controller();
