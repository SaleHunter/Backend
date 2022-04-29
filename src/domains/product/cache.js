const redis = require('../../dataStores/redis');

class Cache {
  async setTopProducts(products) {
    try {
      await redis.set('topProducts', JSON.stringify(products), 'EX', 21600);
    } catch (error) {
      throw error;
    }
  }

  async getTopProducts() {
    try {
      const products = JSON.parse(await redis.get('topProducts'));
      return products;
    } catch (error) {
      throw error;
    }
  }

  async setRecommendedProductsByUserId(userId, products) {
    try {
      await redis.set(
        `recommendedProducts-user-${userId}`,
        JSON.stringify(products),
        'EX',
        43200
      );
    } catch (error) {
      throw error;
    }
  }

  async getRecommendedProductsByUserId(userId) {
    try {
      const products = JSON.parse(
        await redis.get(`recommendedProducts-user-${userId}`)
      );
      return products;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Cache();
