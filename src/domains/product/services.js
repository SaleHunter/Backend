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

      const sort = AttributeExtractor.extractSortByValue(query);

      const storeType = AttributeExtractor.extractStoreTypeValue(query);

      const products = await DAL.searchForProducts(
        searchText,
        language,
        paginationObject,
        filterObject,
        sort,
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

  async getTopProducts() {
    try {
      /* TODO: First: Try to find Top Products in cache
       * if Hit: return back list of products
       * if Miss: retrive it from database then cache it and finally return it back
       */
    } catch (err) {
      throw err;
    }
  }

  async getRecommendedProductsByUserId(userId) {
    try {
      /* TODO: First: Try to find Recommended Products for that user in cache
       * if Hit: return back list of products
       * if Miss: retrive it from ML Recommendation System then cache it and finally return it back
       */
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new Service();
