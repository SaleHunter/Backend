const DAL = require('./DAL');

class Service {
  async getAllStores(userId) {
    try {
      const stores = await DAL.getAllStores(userId);

      return stores;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getStoreById(userId, storeId) {
    try {
      const store = await DAL.getStoreById(userId, storeId);

      return store;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createStore(userId, storeId, storeInfo) {
    try {
      await DAL.createStore(userId, storeId, storeInfo);

      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteStoreById(userId, storeId) {
    try {
      await DAL.deleteStoreById(userId, storeId);

      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = new Service();
