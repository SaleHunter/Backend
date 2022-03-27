const knex = require('../../config/knex');

class Helper {
  buildFilterObject(query) {
    const key = query.filterBy;
    const value = query.filterValue;
    if (key && value) {
      return { key, value };
    }

    return null;
  }

  buildPaginationObject(query) {
    return {
      page: query.page || 1,
      limit: query.limit || 20,
    };
  }

  buildUserLocationObject(headers) {
    const lon = headers.lon;
    const lat = headers.lat;
    if (lon && lat) {
      return { lon, lat };
    }

    return null;
  }

  addSortToQuery(sortBy, queryString) {
    let columnName,
      ascOrDesc = 'asc';
    switch (sortBy) {
      case 'price_min':
        columnName = 'product_price.price';
        break;
      case 'price_max':
        columnName = 'product_price.price';
        ascOrDesc = 'desc';
        break;
      case 'rating':
        columnName = 'reviews.rating';
        ascOrDesc = 'desc';
        break;
      case 'best_deal':
        columnName = 'products.sale';
        ascOrDesc = 'desc';
        break;
      case 'created_at':
        columnName = 'products.created_at';
        ascOrDesc = 'desc';
        break;
      case 'updated_at':
        columnName = 'products.updated_at';
        ascOrDesc = 'desc';
        break;
      default:
        return queryString.orderByRaw(
          '(SELECT COUNT(*) FROM user_product_views WHERE user_product_views.product_id = products.id)'
        );
    }
    queryString.orderBy(columnName, ascOrDesc);
  }

  addStoreTypeToQuery(storeType, queryString) {
    console.log(storeType);
    switch (storeType) {
      case 'online':
        queryString.join('stores', function () {
          this.on('products.store_id', '=', 'stores.id').andOn(
            'stores.store_type',
            '=',
            knex.raw('?', ['online'])
          );
        });
        break;
      case 'offline':
        queryString.join('stores', function () {
          this.on('products.store_id', '=', 'stores.id').andOn(
            'stores.store_type',
            '=',
            knex.raw('?', ['offline'])
          );
        });
        break;
      default:
        queryString.join('stores', 'products.store_id', 'stores.id');
        break;
    }
  }

  addSearchTextToQuery(searchText, queryString) {
    queryString
      .whereILike('products.title', `%${searchText}%`)
      .orWhereILike('products.title_ar', `%${searchText}%`);
  }
}

module.exports = new Helper();
