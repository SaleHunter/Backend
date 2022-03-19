const Joi = require('joi');
const { INTEGER } = require('sequelize');

class Validation {
  async search(req, res, next) {
    const schema = Joi.object.keys({
      searchText: Joi.string().required().messages({
        'string.base': 'searchText is must be string',
        'any.required': 'searchText is required',
      }),

      limit: Joi.number().min(10).max(100).messages({
        'number.base': 'limit must be a number',
        'number.min': 'limit must be greater than 9 items',
        'number.max': 'limit must be less than 101 items',
      }),

      page: Joi.number().min(0).messages({
        'number.base': 'page must be a number',
        'number.min': 'page must be greater than or equal to 0',
      }),

      storeType: Joi.string().valid('online', 'offline', 'all').messages({
        'string.base': 'storeType must be string',
        'any.valid':
          'storeType must be any of these values [online, offline, all]',
      }),

      filterKey: Joi.string()
        .valid('price_min', 'price_max', 'category', 'brand', 'store_name')
        .messages({
          'string.base': 'filterKey must be string',
          'any.valid':
            'filterKey must be any of these values [price_min, price_max, category, brand, store_name]',
        }),
    });

    next();
  }
}
