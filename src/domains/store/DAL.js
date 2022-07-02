const knex = require('../../dataStores/knex');
const { NoStoreFoundError, AlreadyHaveStoreError } = require('./errors');

class DataAccessLayer {
  async getStoreById(storeId, pagination, userId) {
    try {
      const queryString = `SELECT id, name, store_type as type, logo, phone, address, niche_market,
      description, latitude, longitude, whatsapp, facebook, instagram, website FROM stores WHERE id = ?`;

      const storeData = await knex.raw(queryString, [storeId]);

      if (!storeData[0].length) throw new NoStoreFoundError();

      const products = await this.getProductsByStoreId(
        storeId,
        pagination,
        userId
      );

      return { store: storeData[0][0], products };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getProductsByStoreId(storeId, pagination, userId) {
    pagination.limit = pagination.limit ?? 20;
    pagination.page = pagination.page ?? 1;
    storeId = storeId * 1;
    console.log('IN DAL ', pagination);
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
                r.product_id = p.id) AS rating_count,
        (SELECT CASE WHEN EXISTS 
          (SELECT 1 FROM favourite_product AS f WHERE f.user_id = ? and f.product_id = p.id) 
          THEN 1 ELSE 0
        END AS is_favourite) AS is_favourite 
    FROM
        products AS p
    WHERE p.store_id = ?
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?;`;

    const products = await knex.raw(queryString, [
      userId,
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
        website = storeInfo.website ?? null,
        logo = storeInfo.logo ?? null,
        store_type = 'offline';

      console.log(storeInfo, userId, logo);

      const queryString = `
      INSERT INTO stores(name, user_id, store_type, phone, address, niche_market,
         description, latitude, longitude, whatsapp, facebook, instagram, logo, website)
       VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
        website,
      ]);

      const getStoreQueryString = `SELECT id, name, store_type as type, logo, phone, address, niche_market,
      description, latitude, longitude, whatsapp, facebook, instagram, website FROM stores WHERE user_id = ?`;

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

  async updateStoreById(userId, storeId, newValues) {
    try {
      userId = userId * 1;
      storeId = storeId * 1;

      console.log(storeId, userId);

      const store = await knex.raw(
        `SELECT s.id FROM stores AS s WHERE s.id = ? AND s.user_id = ?`,
        [storeId, userId]
      );

      // console.log(store[0]);
      if (!store[0].length) {
        throw new NoStoreFoundError();
      }

      console.log(newValues);
      let updateQueryString = `UPDATE stores SET `;
      for (let [key, value] of Object.entries(newValues)) {
        // console.log([key, value]);
        updateQueryString += `${key} = "${value}", `;
      }

      updateQueryString = updateQueryString.slice(0, -2);
      updateQueryString += ` WHERE id = ? AND user_id = ?`;

      console.log(updateQueryString);

      const result = await knex.raw(updateQueryString, [storeId, userId]);
      console.log(result);
      return [];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getStoreIdByUser(userId) {
    try {
      const queryString = `SELECT id FROM stores WHERE user_id = ?`;

      const result = await knex.raw(queryString, [userId]);

      console.log(result[0][0].id);

      return result[0][0].id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = new DataAccessLayer();
