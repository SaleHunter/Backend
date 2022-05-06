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
}

module.exports = new Service();
