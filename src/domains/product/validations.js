const Joi = require('joi');
const { INTEGER } = require('sequelize');

class Validation {
  async search(req, res, next) {
    const schema = Joi.object()
      .keys({
        searchText: Joi.string().required().messages({
          'string.base': 'searchText is must be string',
          'any.required': 'searchText is required',
        }),

        limit: Joi.number().min(10).max(100).default(20).messages({
          'number.base': 'limit must be a number',
          'number.min': 'limit must be greater than 9 items',
          'number.max': 'limit must be less than 101 items',
        }),

        page: Joi.number().min(0).default(1).messages({
          'number.base': 'page must be a number',
          'number.min': 'page must be greater than or equal to 0',
        }),

        storeType: Joi.string().valid('online', 'offline', 'all').messages({
          'string.base': 'storeType must be string',
          'any.valid':
            'storeType must be any of these values [online, offline, all]',
        }),

        filterBy: Joi.string()
          .valid('price_min', 'price_max', 'category', 'brand', 'store_name')
          .messages({
            'string.base': 'filterBy must be string',
            'any.valid':
              'filterBy must be any of these values [price_min, price_max, category, brand, store_name]',
          }),
        filterValue: Joi.alternatives().conditional('filterBy', [
          {
            is: 'price_min',
            then: Joi.number().min(0).max(1e6).default(0).messages({
              'number.base': 'price_min must be a number',
              'number.min': 'price_min must be atleast 0',
              'number.max': 'price_min must be atmost 1000000',
            }),
          },
          {
            is: 'price_max',
            then: Joi.number().min(0).max(1e6).default(1e6).messages({
              'number.base': 'price_max must be a number',
              'number.min': 'price_max must be atleast 0',
              'number.max': 'price_max must be atmost 1000000',
            }),
          },
          {
            is: 'category',
            then: Joi.string().messages({
              'string.base': 'category must be a string',
            }),
          },
          {
            is: 'brand',
            then: Joi.string().messages({
              'string.base': 'brand must be a string',
            }),
          },
          {
            is: 'store_name',
            then: Joi.string().messages({
              'string.base': 'store_name must be a string',
            }),
          },
        ]),
        sortBy: Joi.string()
          .valid(
            'price_min',
            'price_max',
            'popular',
            'rating',
            'nearest_store',
            'best_deal',
            'updated_at',
            'created_at'
          )
          .default('popular')
          .messages({
            'string.base': 'sortBy must be string',
            'any.valid':
              'sortBy must be any of these values [price_min, price_max, popular, rating, nearest_store, best_deal, updated_at, created_at]',
          }),
        language: Joi.string()
          .valid('en', 'ar')
          .default('en')
          .required()
          .messages({
            'string.base': 'language must be string',
            'any.valid': 'language must be any of these values [en,ar]',
          }),
        lan: Joi.number().precision(6).messages({
          'number.base': 'lan must be number',
        }),
        lat: Joi.number().precision(6).messages({
          'number.base': 'lat must be number',
        }),
      })
      .with('lat', 'lan')
      .with('page', 'limit')
      .with('filterBy', 'filterValue');

    const sourceObject = {
      lan: req.headers.lan,
      lat: req.headers.lat,
      language: req.headers.language,
      ...req.query,
    };

    await schema.validateAsync(sourceObject);

    next();
  }
}

module.exports = new Validation();
