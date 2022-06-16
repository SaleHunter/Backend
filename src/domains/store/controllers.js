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

  // Store Products Management
  async addProductToStore(req, res, next) {
    res.redirect(307, '/api/v1/products?storeId=' + req.params.storeId);
  }

  async deleteProductFromStore(req, res, next) {
    console.log('from store : delete product');
    res.redirect(
      307,
      `/api/v1/products/${req.params.productId}?storeId=${req.params.storeId}`
    );
  }

  async updateProductInStore(req, res, next) {
    res.redirect(
      307,
      `/api/v1/products/${req.params.productId}?storeId=${req.params.storeId}`
    );
  }
}

module.exports = new Controller();
