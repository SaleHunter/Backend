const helper = require('./helpers');
const Products = require('./DAL');

class Service {
  async getAllProducts() {
    try {
      const products = await Products.query();
      return products;
    } catch (err) {
      throw err;
    }
  }
  async getProductById(id) {
    try {
      const product = await Products.query().findById(id);
      return product;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new Service();
