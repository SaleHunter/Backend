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

    const store = await service.getStoreById(userId, storeId);

    res.status(200).json({
      status: 'success',
      store,
    });
  }

  async createStore(req, res, next) {
    const storeInfo = req.body,
      userId = req.user.id,
      storeId = req.params.id;

    await service.createStore(userId, storeId, storeInfo);
    res.status(201).json({
      status: 'success',
      message: 'Store Created Successfully',
    });
  }

  async deleteStoreById(req, res, next) {
    const userId = req.user.id,
      storeId = req.params.id;

    await service.deleteStoreById(userId, storeId);

    res.status(204).json();
  }
}

module.exports = new Controller();
