const knex = require('../../dataStores/knex');
const { NoStoreFoundError, AlreadyHaveStoreError } = require('./errors');

class DataAccessLayer {
  async getStoreById(storeId, pagination) {
    try {
      const queryString = `SELECT id, name, store_type as type, logo, phone, address, niche_market,
      description, latitude, longitude, whatsapp, facebook, instagram FROM stores WHERE id = ?`;

      const storeData = await knex.raw(queryString, [storeId]);

      if (!storeData[0].length) throw new NoStoreFoundError();

      const products = await this.getProductsByStoreId(storeId, pagination);

      return { store: storeData[0][0], products };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getProductsByStoreId(storeId, pagination) {
    console.log('IN DAL ', pagination);
    storeId = storeId * 1;
    const queryString = `
    SELECT 
        p.id,
        p.title,
        p.title_ar,
        p.brand,
        p.category,
        p.category_ar,
        (SELECT 
                price
            FROM
                product_price AS pp
            WHERE
                pp.product_id = p.id
            ORDER BY pp.created_at
            LIMIT 1) AS price,
        (SELECT 
                link
            FROM
                product_images AS pimgs
            WHERE
                pimgs.product_id = p.id
            LIMIT 1) AS image,
        p.sale,
        (SELECT 
                AVG(rating)
            FROM
                reviews AS r
            WHERE
                r.product_id = p.id) AS rating,
        (SELECT 
                COUNT(product_id)
            FROM
                reviews AS r
            WHERE
                r.product_id = p.id) AS rating_count
    FROM
        products AS p
    WHERE p.store_id = ?
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?;`;

    const products = await knex.raw(queryString, [
      storeId,
      pagination.limit,
      (pagination.page - 1) * 10,
    ]);

    return products[0];
  }
  catch(error) {
    console.log(error);
    throw error;
  }

  async createStore(userId, storeInfo) {
    try {
      const { name, address, longitude, latitude, niche_market } = storeInfo;
      const phone = storeInfo.phone ?? null,
        whatsapp = storeInfo.whatsapp ?? null,
        description = storeInfo.description ?? null,
        facebook = storeInfo.facebook ?? null,
        instagram = storeInfo.instagram ?? null,
        logo = storeInfo.logo ?? null,
        store_type = 'offline';

      console.log(storeInfo, userId, logo);

      const queryString = `
      INSERT INTO stores(name, user_id, store_type, phone, address, niche_market,
         description, latitude, longitude, whatsapp, facebook, instagram, logo)
       VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      await knex.raw(queryString, [
        name,
        userId,
        store_type,
        phone,
        address,
        niche_market,
        description,
        latitude,
        longitude,
        whatsapp,
        facebook,
        instagram,
        logo,
      ]);

      const getStoreQueryString = `SELECT id, name, store_type as type, logo, phone, address, niche_market,
      description, latitude, longitude, whatsapp, facebook, instagram FROM stores WHERE user_id = ?`;

      const store = await knex.raw(getStoreQueryString, [userId]);
      return store[0][0];
    } catch (error) {
      console.log(error);
      if (error.errno === 1062) throw new AlreadyHaveStoreError();
      else throw error;
    }
  }

  async deleteStoreById(userId, storeId) {
    try {
      userId = userId * 1;
      storeId = storeId * 1;
      const store = await knex.raw(
        `SELECT s.id FROM stores AS s WHERE s.id = ? AND s.user_id = ?`,
        [storeId, userId]
      );

      console.log(store[0]);
      if (!store[0].length) {
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
