const knex = require('../../dataStores/knex');
const { NoStoreFoundError } = require('./errors');

class DataAccessLayer {
  async getAllStores(userId) {
    try {
      const queryString = `SELECT s.id, s.name, s.store_type as type, s.logo FROM stores AS s WHERE s.user_id = ?`;

      const stores = await knex.raw(queryString, [userId]);

      return stores[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteStoreById(userId, storeId) {
    try {
      const store = await knex.raw(
        `SELECT s.id FROM stores AS s WHERE s.id ? AND s.user_id = ?`,
        [storeId, userId]
      );

      if (!store.length) {
        throw new NoStoreFoundError();
      }

      await knex.raw(
        'DELETE FROM stores WHERE stores.id = ? AND stores.user_id = ?',
        [storeId, userId]
      );

      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = new DataAccessLayer();
