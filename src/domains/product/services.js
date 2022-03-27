const DAL = require('./DAL');
const helper = require('./helpers');

class Service {
  async searchForProducts(query, headers) {
    try {
      const searchText = query.searchText;

      const language = query.language;

      const userLocation = helper.buildUserLocationObject(headers);

      const paginationObject = helper.buildPaginationObject(query);

      const filterObject = helper.buildFilterObject(query);

      const sortBy = query.sortBy || 'popular';

      const storeType = query.storeType || 'all';

      const products = await DAL.searchForProducts(
        searchText,
        language,
        paginationObject,
        filterObject,
        sortBy,
        storeType,
        userLocation
      );

      return products;
    } catch (err) {
      throw err;
    }
  }
  async getProductById(id) {
    try {
      const product = await DAL.getProductById(id);
      return product;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new Service();
