const knex = require('../../dataStores/knex');
const { CustomQueryBuilder } = require('./helpers');
const { NoProductFoundError, ProductAlreadyInFavourites } = require('./errors');

class DataAccessLayer {
  async getProductById(productId, userId) {
    try {
      const product = await knex.raw(
        'CALL sale_hunter.products_get_one_by_id(?)',
        [productId]
      );

      console.log(userId, productId);
      let is_favourite = 0,
        user_rating = 0;
      if (userId !== 0) {
        const forAuthenticatedUser = await knex.raw(
          `SELECT 
            CASE WHEN EXISTS 
            (SELECT 1 FROM favourite_product AS f WHERE f.user_id = ? and f.product_id = ?) 
            THEN 1 ELSE 0
            END AS is_favourite,
            CASE 
            WHEN r.rating IS NOT NULL 
            THEN r.rating
            ELSE 0
            END AS user_rating
            FROM 
            reviews AS r
            WHERE
            r.user_id = ? and r.product_id = ?`,
          [userId, productId, userId, productId]
        );
        console.log(forAuthenticatedUser, forAuthenticatedUser[0]);
        if (forAuthenticatedUser[0].length) {
          is_favourite = forAuthenticatedUser[0][0].is_favourite;
          user_rating = forAuthenticatedUser[0][0].user_rating;
        }
      }
      console.log(is_favourite, user_rating);

      const basic = product[0][0][0],
        prices = product[0][1],
        images = product[0][2],
        store = product[0][3][0],
        rating = product[0][4][0],
        views = product[0][5][0];

      if (!basic || basic.length === 0) throw new NoProductFoundError();
      return {
        basic,
        prices,
        images,
        store,
        rating,
        views,
        is_favourite,
        user_rating,
      };
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
    userLocation,
    userId
  ) {
    try {
      console.log(storeType);
      let searchQueryString = knex
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
             (SELECT COUNT(reviews.product_id) FROM reviews WHERE reviews.product_id = products.id) AS product_rating_count,
             CASE WHEN EXISTS 
              (SELECT 1 FROM favourite_product AS f WHERE f.user_id = ? and f.product_id = products.id) 
              THEN 1 ELSE 0
            END AS is_favourite`,
            [userId]
          )
        )
        .from('products')
        .join('product_price ', 'products.id', 'product_price.product_id')
        .join('product_images  ', 'products.id', 'product_images.product_id');
      CustomQueryBuilder.addStoreTypeToQuery(storeType, searchQueryString);
      if (store_name && store_name !== 'all')
        CustomQueryBuilder.addStoreNameToQuery(store_name, searchQueryString);
      CustomQueryBuilder.addSortToQuery(sort, searchQueryString);
      CustomQueryBuilder.addFiltersToQuery(filter, searchQueryString);

      CustomQueryBuilder.addPaginationToQuery(pagination, searchQueryString);
      if (searchText)
        CustomQueryBuilder.addSearchTextToQuery(searchText, searchQueryString);

      console.log(searchQueryString.toString());

      const totalProductsQueryString = knex.select(
        knex.raw(
          'COUNT(products.id) AS totalProductsNumber FROM products JOIN product_price ON products.id = product_price.product_id'
        )
      );
      CustomQueryBuilder.addStoreTypeToQuery(
        storeType,
        totalProductsQueryString
      );
      if (store_name && store_name !== 'all')
        CustomQueryBuilder.addStoreNameToQuery(
          store_name,
          totalProductsQueryString
        );
      CustomQueryBuilder.addFiltersToQuery(filter, totalProductsQueryString);

      if (searchText)
        CustomQueryBuilder.addSearchTextToQuery(
          searchText,
          totalProductsQueryString
        );

      console.log(totalProductsQueryString.toString());

      const categoriesQueryString = knex.select(
        knex.raw(
          ' DISTINCT products.category FROM products JOIN product_price ON products.id = product_price.product_id'
        )
      );
      CustomQueryBuilder.addStoreTypeToQuery(storeType, categoriesQueryString);
      if (store_name && store_name !== 'all')
        CustomQueryBuilder.addStoreNameToQuery(
          store_name,
          categoriesQueryString
        );
      CustomQueryBuilder.addFiltersToQuery(filter, categoriesQueryString);

      if (searchText)
        CustomQueryBuilder.addSearchTextToQuery(
          searchText,
          categoriesQueryString
        );

      const brandsQueryString = knex.select(
        knex.raw(
          ' DISTINCT products.brand FROM products JOIN product_price ON products.id = product_price.product_id'
        )
      );
      CustomQueryBuilder.addStoreTypeToQuery(storeType, brandsQueryString);
      if (store_name && store_name !== 'all')
        CustomQueryBuilder.addStoreNameToQuery(store_name, brandsQueryString);
      CustomQueryBuilder.addFiltersToQuery(filter, brandsQueryString);

      if (searchText)
        CustomQueryBuilder.addSearchTextToQuery(searchText, brandsQueryString);

      const [products, totalProductsNumber] = await Promise.all([
        searchQueryString,
        totalProductsQueryString,
        // categoriesQueryString,
        // brandsQueryString,
      ]);

      // console.log(products, totalProductsNumber, categories, brands);
      return {
        products,
        totalProductsNumber: totalProductsNumber[0].totalProductsNumber,
        // categories: categories.map(c => c.category),
        // brands: brands.map(b => b.brand),
      };
    } catch (error) {
      throw error;
    }
  }

  async getTopProducts() {
    try {
      const queryString = `
      SELECT 
    p.id AS product_id,
    p.title AS product_title,
    p.title_ar AS product_title_ar,
    p.brand AS product_brand,
    (SELECT 
            price
        FROM
            product_price AS pp
        WHERE
            pp.product_id = p.id
        ORDER BY pp.created_at
        LIMIT 1) AS product_price,
    (SELECT 
            link
        FROM
            product_images AS pimgs
        WHERE
            pimgs.product_id = p.id
        LIMIT 1) AS image_url,
    p.sale AS product_sale ,
    p.store_id,
    s.name AS store_name,
    s.logo AS store_logo,
    s.store_type,
    (SELECT 
            AVG(rating)
        FROM
            reviews AS r
        WHERE
            r.product_id = p.id) AS product_rating,
    (SELECT 
            COUNT(product_id)
        FROM
            reviews AS r
        WHERE
            r.product_id = p.id) AS product_rating_count,
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

  async getFavoriteProductsForUser(userId) {
    try {
      const queryString = `SELECT 
      p.id,
      p.title,
      (SELECT 
              pp.price
          FROM
              product_price AS pp
          WHERE
              p.id = pp.product_id
          ORDER BY pp.created_at DESC
          LIMIT 1) AS price,
      (SELECT 
              pimgs.link
          FROM
              product_images AS pimgs
          WHERE
              p.id = pimgs.product_id
          LIMIT 1) AS image,
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
      s.id AS store_id,
      s.name AS store_name,
      s.store_type,
      s.logo,
      f.created_at as favourite_date
  FROM
      favourite_product AS f
          JOIN
      products AS p ON p.id = f.product_id
          JOIN
      stores AS s ON s.id = p.store_id
  WHERE
      f.user_id = ?
  ORDER BY f.created_at DESC
  LIMIT 20;`;

      const products = await knex.raw(queryString, [userId]);

      return products[0];
    } catch (error) {
      throw error;
    }
  }

  async addProductToFavourites(userId, productId) {
    try {
      const queryString = `INSERT INTO favourite_product(user_id, product_id, created_at) VALUES(?, ?, ?);`;

      await knex.raw(queryString, [userId, productId, Date.now()]);

      return true;
    } catch (error) {
      console.log(error);
      if (error.errno === 1062) throw new ProductAlreadyInFavourites();
      else throw new NoProductFoundError();
    }
  }

  async removeProductFromFavourites(userId, productId) {
    try {
      const queryString = `DELETE FROM favourite_product WHERE user_id = ? AND product_id = ?;`;

      await knex.raw(queryString, [userId, productId]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getViewedProductsForUser(userId) {
    try {
      const queryString = `
      SELECT DISTINCT
      v.product_id AS id,
      p.title,
      (SELECT 
              pp.price
          FROM
              product_price AS pp
          WHERE
              p.id = pp.product_id
          ORDER BY pp.created_at DESC
          LIMIT 1) AS price,
      (SELECT 
              pimgs.link
          FROM
              product_images AS pimgs
          WHERE
              p.id = pimgs.product_id
          LIMIT 1) AS image,
      v.viewed_at
      FROM
          user_product_views AS v
              LEFT JOIN
          user_product_views AS vv ON v.product_id = vv.product_id
              AND v.viewed_at < vv.viewed_at
              JOIN
          products AS p ON p.id = v.product_id
      WHERE
          v.user_id = ? AND vv.viewed_at IS NULL
      ORDER BY v.viewed_at DESC
      LIMIT 20;
      `;

      const products = await knex.raw(queryString, [userId]);

      return products[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async changeProductRating(userId, productId, rating) {
    try {
      const queryString = `INSERT INTO reviews(product_id, user_id, rating, date)
      VALUES(?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE 
      rating = ?, date = NOW();
      `;

      await knex.raw(queryString, [productId, userId, rating, rating]);

      return;
    } catch (error) {
      console.log(error);
      if (error.errno === 1452) throw new NoProductFoundError();
      else throw error;
    }
  }
}

module.exports = new DataAccessLayer();
