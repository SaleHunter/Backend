const knex = require('../../config/knex');

class AttributeExtractor {
  extractLanguageValue(headers) {
    return headers.language || 'en';
  }
  extractSortByValue(query) {
    return query.sort || 'popular';
  }
  extractStoreTypeValue(query) {
    return query.storeType || 'all';
  }
  extractFilterObject(query) {
    const obj = {
      price_min: parseFloat(query.price_min) || 0.0,
      price_max: parseFloat(query.price_max) || 1e9,
      category: query.category
        ? query.category === 'all'
          ? ''
          : query.category
        : '',
      brand: query.brand ? (query.brand === 'all' ? '' : query.brand) : '',
      store_type: query.store_type
        ? query.store_type === 'all'
          ? ''
          : query.store_type
        : '',
    };
    return obj;
  }

  extractPaginationObject(query) {
    return {
      page: query.page || 1,
      limit: query.limit || 20,
    };
  }

  extractUserLocationObject(headers) {
    const lon = headers.lon;
    const lat = headers.lat;
    if (lon && lat) {
      return { lon, lat };
    }

    return null;
  }
}
class CustomQueryBuilder {
  addSortToQuery(sortBy, queryString) {
    let columnName,
      ascOrDesc = 'asc';
    switch (sortBy) {
      case 'priceAsc':
        columnName = 'product_price.price';
        break;
      case 'priceDsc':
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
      case 'newest':
        columnName = 'products.created_at';
        ascOrDesc = 'desc';
        break;
      case 'oldest':
        columnName = 'products.created_at';
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
        console.log(storeType);
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
  addFiltersToQuery(filters, queryString) {
    // Category, Brand Filteration
    if (filters.category)
      queryString.where('products.category', filters.category);
    if (filters.brand) queryString.where('products.brand', filters.brand);

    // Price Filteration
    queryString.whereBetween('product_price.price', [
      filters.price_min,
      filters.price_max,
    ]);
  }
}
module.exports.AttributeExtractor = new AttributeExtractor();
module.exports.CustomQueryBuilder = new CustomQueryBuilder();
