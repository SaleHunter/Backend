const DAL = require('./DALs');
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

      console.log(
        searchText,
        language,
        paginationObject,
        sortBy,
        filterObject,
        storeType,
        userLocation
      );

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
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Service();
