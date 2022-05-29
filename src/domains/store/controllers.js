const service = require('./services');

class Controller {
  async getStoreById(req, res, next) {
    const storeId = req.params.id;

    req.query.page = req.query.page ?? '1';
    req.query.limit = req.query.limit ?? '20';
    const pagination = {
      page: +req.query.page,
      limit: +req.query.limit,
    };

    let userId = 0;
    if (req.user) userId = req.user.id;

    console.log('In CNT ', pagination);

    const { store, products } = await service.getStoreById(
      storeId,
      pagination,
      userId
    );

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

  async updateStoreById(req, res, next) {
    const userId = req.user.id,
      storeId = req.params.id,
      newValues = req.body;

    await service.updateStoreById(userId, storeId, newValues);

    res.status(200).json({
      status: 'success',
      message: 'Store Updated Successfully',
    });
  }
}

module.exports = new Controller();
