const knex = require('../../config/knex');
const { CustomQueryBuilder } = require('./helpers');

class DataAccessLayer {
  async getProductById(id) {
    try {
      const product = await knex
        .from('products')
        .select(
          'products.id as product_id',
          'products.title as product_title',
          'products.title_ar as product_title_ar',
          'product_price.price as product_price',
          'product_price.created_at as product_price_created_at',
          'products.sale as product_sale',
          'products.created_at as created_at',
          'products.updated_at as updated_at',
          'products.brand as product_brand',
          'products.category as product_category',
          'products.url as product_url',
          'product_images.id AS image_id',
          'product_images.link AS image_url',
          'products.store_id as store_id',
          'stores.name as store_name',
          'stores.logo as store_logo',
          'stores.store_type as store_type'
        )
        // .avg(`reviews.rating as rating_average`)
        // .count('reviews.product_id as number_of_ratings')
        .join('product_price ', 'products.id', 'product_price.product_id')
        .join('product_images  ', 'products.id', 'product_images.product_id')
        .join('reviews', 'products.id', 'reviews.product_id')
        .join('stores', 'products.store_id', 'stores.id')
        .where('products.id', '=', id);

      return product;
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
          'reviews.rating as product_rating',
          'products.url as product_url',
          'product_images.link AS image_url',
          'products.store_id as store_id',
          'stores.name as store_name',
          'stores.logo as store_logo',
          'stores.store_type as store_type'
        )
        .from('products')
        .join('product_price ', 'products.id', 'product_price.product_id')
        .join('product_images  ', 'products.id', 'product_images.product_id')
        .join('reviews', 'products.id', 'reviews.product_id');
      CustomQueryBuilder.addStoreTypeToQuery(storeType, queryString);
      CustomQueryBuilder.addSortToQuery(sort, queryString);
      CustomQueryBuilder.addFiltersToQuery(filter, queryString);
      CustomQueryBuilder.addSearchTextToQuery(searchText, queryString);

      /*TODO:
       * addFilterToQuery
       * addPaginationToQuery
       */
      console.log(queryString.toString());
      const products = await queryString;
      return products;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DataAccessLayer();
