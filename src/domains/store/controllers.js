const service = require('./services');

class Controller {
  async getStoreById(req, res, next) {
    const storeId = req.params.id;

    const pagination = {
      page: req.query.page * 1 ?? 1,
      limit: req.query.limit * 1 ?? 20,
    };

    console.log('In CNT ', pagination);

    const { store, products } = await service.getStoreById(storeId, pagination);

    res.status(200).json({
      status: 'success',
      store,
      productsLength: products.length,
      products,
    });
  }

  async createStore(req, res, next) {
    const storeInfo = req.body,
      userId = req.user.id;

    const store = await service.createStore(userId, storeInfo);
    res.status(201).json({
      status: 'success',
      message: 'Store Created Successfully',
      store,
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
