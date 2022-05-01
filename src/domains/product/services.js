const DAL = require('./DAL');
const cache = require('./cache');
const { AttributeExtractor } = require('./helpers');
const axios = require('axios');

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
      const store_name = AttributeExtractor.extractStoreNameValue(query);

      const products = await DAL.searchForProducts(
        searchText,
        language,
        paginationObject,
        filterObject,
        sort,
        storeType,
        store_name,
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

      let products = [];
      products = await cache.getTopProducts();
      // console.log(products.length);
      if (!products) {
        products = await DAL.getTopProducts();
      }

      await cache.setTopProducts(products);

      return products;
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
      let products = [];

      products = await cache.getRecommendedProductsByUserId(userId);
      // console.log(products.length !== 0);
      if (!products) {
        const topProducts = await this.getTopProducts();
        products = await this.predictProductsForUser(userId, topProducts);
        console.log('HEREREDFEGEGE');
        cache.setRecommendedProductsByUserId(userId, products);
      }

      return products;
    } catch (err) {
      throw err;
    }
  }

  async predictProductsForUser(userId, products) {
    try {
      console.log('Predicting');
      // const top = products.map(product => product.id);
      // console.log(top);

      const response = await axios({
        method: 'GET',
        url: 'https://recommenderengine20211014165927.azurewebsites.net/api/Predict',
        data: {
          userId,
          items: products.map(product => product.id),
        },
      });

      console.log('data', response.data);

      const recommendedProducts = response.data;

      const detailedRecommendedProducts = recommendedProducts.map(product => {
        const found = products.find(top => top.id === product.Item);
        return { ...found, score: product.Score };
      });

      return detailedRecommendedProducts;
    } catch (error) {
      throw error;
    }
  }

  async getFavouriteProductsForUser(userId) {
    try {
      const products = await DAL.getFavoriteProductsForUser(userId);

      return products;
    } catch (error) {
      throw error;
    }
  }

  async addProductToFavourites(userId, productId) {
    try {
      await DAL.addProductToFavourites(userId, productId);
    } catch (error) {
      throw error;
    }
  }

  async removeProductFromFavourites(userId, productId) {
    try {
      await DAL.removeProductFromFavourites(userId, productId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Service();
