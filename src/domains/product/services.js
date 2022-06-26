const DAL = require('./DAL');
const cache = require('./cache');
const { AttributeExtractor } = require('./helpers');
const axios = require('axios');
const { cloudinary } = require('../../config/cloudinary');

class Service {
  async searchForProducts(query, headers, userId) {
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

      const { products, totalProductsNumber, categories, brands } =
        await DAL.searchForProducts(
          searchText,
          language,
          paginationObject,
          filterObject,
          sort,
          storeType,
          store_name,
          userLocation,
          userId
        );

      return { products, totalProductsNumber, categories, brands };
    } catch (err) {
      throw err;
    }
  }
  async getProductById(productId, userId) {
    try {
      const product = await DAL.getProductById(productId, userId);
      return product;
    } catch (err) {
      throw err;
    }
  }

  async getTopProducts() {
    try {
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
    console.log('Predicting');
    // const top = products.map(product => product.id);
    // console.log(top);

    const response = await axios({
      method: 'GET',
      url: 'https://recommenderengine20211014165927.azurewebsites.net/api/Predict',
      data: {
        userId,
        items: products.map(product => product.product_id),
      },
    });

    console.log('data', response.data);
    if (!Array.isArray(response.data)) return products;

    const recommendedProducts = response.data;

    const detailedRecommendedProducts = recommendedProducts.map(product => {
      const found = products.find(top => top.product_id === product.Item);
      return { ...found, score: product.Score };
    });

    return detailedRecommendedProducts;
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

  async getViewedProductsForUser(userId) {
    try {
      const products = await DAL.getViewedProductsForUser(userId);

      return products;
    } catch (error) {
      throw error;
    }
  }

  async changeProductRating(userId, productId, rating) {
    try {
      await DAL.changeProductRating(userId, productId, rating);

      return;
    } catch (error) {
      throw error;
    }
  }
  async getProductsOnSale(userId) {
    try {
      const products = await DAL.getProductsOnSale(userId);

      return products;
    } catch (err) {
      throw err;
    }
  }

  // create product for certain store
  async createProduct(storeId, productInfo) {
    try {
      // upload product images to cloudinary
      const cloudinary_images = await this.uploadImagesToCloudinary(
        productInfo.product_images
      );
      productInfo.product_images = cloudinary_images;

      // persist product to mysql
      const product = await DAL.createProduct(storeId, productInfo);
      return product;
    } catch (error) {
      throw error;
    }
  }

  // delete product for certain storeId
  async deleteProductById(store_id, product_id) {
    try {
      await DAL.deleteProductById(store_id, product_id);
      return;
    } catch (error) {
      throw error;
    }
  }

  // update product for certain storeId and productId
  async updateProductById(store_id, product_id, new_values) {
    try {
      await DAL.updateProductById(store_id, product_id, new_values);
      return;
    } catch (error) {
      throw error;
    }
  }

  //upload images to cloudinary
  async uploadImagesToCloudinary(images) {
    try {
      const cloudinary_images = [];
      for (const image of images) {
        const result = await cloudinary.uploader.upload(image, {
          upload_preset: 'products',
        });
        cloudinary_images.push(result.url);
      }
      return cloudinary_images;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Service();
