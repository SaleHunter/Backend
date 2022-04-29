const { tryCatch } = require('bullmq');
const knex = require('../../dataStores/knex');
const { CustomQueryBuilder } = require('./helpers');
const { NoProductFoundError } = require('./errors');

class DataAccessLayer {
  async getProductById(id) {
    try {
      // const product = await knex
      //   .from('products')
      //   .select(
      //     'products.id as product_id',
      //     'products.title as product_title',
      //     'products.title_ar as product_title_ar',
      //     'product_price.price as product_price',
      //     'product_price.created_at as product_price_created_at',
      //     'products.sale as product_sale',
      //     'products.created_at as created_at',
      //     'products.updated_at as updated_at',
      //     'products.brand as product_brand',
      //     'products.category as product_category',
      //     'products.url as product_url',
      //     'product_images.id AS image_id',
      //     'product_images.link AS image_url',
      //     'products.store_id as store_id',
      //     'stores.name as store_name',
      //     'stores.logo as store_logo',
      //     'stores.store_type as store_type'
      //   )
      //   // .avg(`reviews.rating as rating_average`)
      //   // .count('reviews.product_id as number_of_ratings')
      //   .join('product_price ', 'products.id', 'product_price.product_id')
      //   .join('product_images  ', 'products.id', 'product_images.product_id')
      //   .join('reviews', 'products.id', 'reviews.product_id')
      //   .join('stores', 'products.store_id', 'stores.id')
      //   .where('products.id', '=', id);

      const product = await knex.raw(
        'CALL sale_hunter.products_get_one_by_id(?)',
        [id]
      );

      const basic = product[0][0][0],
        prices = product[0][1],
        images = product[0][2],
        store = product[0][3][0],
        rating = product[0][4][0],
        views = product[0][5][0];

      if (!basic || prices.length === 0) throw new NoProductFoundError();
      return { basic, prices, images, store, rating, views };
    } catch (error) {
      throw error;
    }
  }

  async searchForProducts(
    searchText,
    language,
    pagination,
    filter,
    sort,
    storeType,
    store_name,
    userLocation
  ) {
    try {
      console.log(storeType);
      let queryString = knex
        .select(
          'products.id as product_id',
          'products.title as product_title',
          'products.title_ar as product_title_ar',
          'product_price.price as product_price',
          'products.sale as product_sale',
          'products.created_at as created_at',
          'products.updated_at as updated_at',
          'products.brand as product_brand',
          'products.category as product_category',
          'products.sale as product_sale',
          'products.url as product_url',
          'product_images.link AS image_url',
          'products.store_id as store_id',
          'stores.name as store_name',
          'stores.logo as store_logo',
          'stores.store_type as store_type'
        )
        .select(
          knex.raw(
            `(SELECT AVG(rating) FROM reviews WHERE reviews.product_id = products.id) AS product_rating,
             (SELECT COUNT(reviews.product_id) FROM reviews WHERE reviews.product_id = products.id) AS product_rating_count`
          )
        )
        .from('products')
        .join('product_price ', 'products.id', 'product_price.product_id')
        .join('product_images  ', 'products.id', 'product_images.product_id');
      CustomQueryBuilder.addStoreTypeToQuery(storeType, queryString);
      CustomQueryBuilder.addStoreNameToQuery(store_name, queryString);
      CustomQueryBuilder.addSortToQuery(sort, queryString);
      CustomQueryBuilder.addFiltersToQuery(filter, queryString);

      CustomQueryBuilder.addPaginationToQuery(pagination, queryString);
      if (searchText)
        CustomQueryBuilder.addSearchTextToQuery(searchText, queryString);

      console.log(queryString.toString());
      const products = await queryString;
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getTopProducts() {
    try {
      const queryString = `
      SELECT 
    p.id,
    p.title,
    p.title_ar,
    p.brand,
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
    p.store_id,
    s.name,
    s.logo,
    s.store_type,
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
    (SELECT 
            COUNT(vv.product_id)
        FROM
            user_product_views AS vv
        WHERE
            vv.product_id = p.id
                AND DATE(vv.viewed_at) = CURDATE()) AS views_today
FROM
    user_product_views AS v
        JOIN
    products AS p ON p.id = v.product_id
        JOIN
    stores AS s ON s.id = p.store_id
GROUP BY v.product_id
ORDER BY views_today DESC
LIMIT 10;`;

      const product = await knex.raw(queryString);

      return product[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DataAccessLayer();
