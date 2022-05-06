const knex = require('../../dataStores/knex');

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
}

module.exports = new DataAccessLayer();
