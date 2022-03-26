const { sequelize } = require('../../config/db');

class DataAccessLayer {
  async searchForProducts(
    searchText,
    language,
    pagination,
    filter,
    sort,
    storeType,
    userLocation
  ) {
    try {
      let queryString = `
      SELECT 
        products.id AS product_id,
        products.title as product_title,
        products.title_ar as product_title_ar,
        product_price.price as product_price,
        products.brand as product_brand,
        products.category as product_category,
        reviews.rating as product_rating,
        products.url as product_url,
        product_images.link AS image_url,
        products.store_id as store_id,
        stores.name as store_name,
        stores.logo as store_logo,
        stores.store_type as store_type
      FROM
        products
            JOIN
        product_price ON products.id = product_price.product_id
            JOIN
        product_images ON products.id = product_images.product_id
            JOIN
        reviews ON products.id = reviews.product_id
            JOIN
        stores ON products.store_id = stores.id    
      WHERE products.title LIKE ?;`;
      const results = await sequelize.query(queryString, {
        replacements: [`%${searchText}%`],
      });

      // console.log(results[0]);

      return results[0];
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      //TODO: Write Here SQL Query
      const queryString = `call products_get_one_by_id(?)`;
      const results = await sequelize.query(queryString, {
        raw: true,
        type: sequelize.QueryTypes.SELECT,
        replacements: [id],
      });

      // console.log(results);

      const basic = results[0][0];
      const prices = Object.values(results[1]);
      const images = Object.values(results[2]);
      const store = results[3][0];
      const rating = results[4][0];
      const views = results[5][0];
      // const product = results.map((resultSet, i) => {})

      return { basic, prices, images, store, rating, views };
      // return [];
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new DataAccessLayer();
