const DAL = require('./DAL');
const { AttributeExtractor } = require('./helpers');

class Service {
  async searchForProducts(query, headers) {
    try {
      const searchText = query.searchText;

      const language = AttributeExtractor.extractLanguageValue(headers);

      const userLocation =
        AttributeExtractor.extractUserLocationObject(headers);

      const paginationObject =
        AttributeExtractor.extractPaginationObject(query);

      const filterObject = AttributeExtractor.extractFilterObject(query);

      const sortBy = AttributeExtractor.extractSortByValue(query);

      const storeType = AttributeExtractor.extractSortByValue(query);

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
