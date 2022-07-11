const Joi = require('joi');

class Validation {
  async searchForProducts(req, res, next) {
    const schema = Joi.object({
      searchText: Joi.string().trim().messages({
        'string.base': 'searchText is must be string',
      }),

      limit: Joi.number().min(10).max(100).messages({
        'number.base': 'limit must be a number',
        'number.min': 'limit must be at least 10 items',
        'number.max': 'limit must be at most 100 items',
      }),

      cursor: Joi.number().messages({
        'number.base': 'cursor must be a number',
      }),
      cursorDirection: Joi.string().valid('next', 'previous').messages({
        'string.base': 'cursorDirection mst be a string',
        'any.valid':
          'cursorDirection must be any of these values [next, previous]',
      }),
      storeType: Joi.string().valid('online', 'offline', 'all').messages({
        'string.base': 'storeType must be string',
        'any.valid':
          'storeType must be any of these values [online, offline, all]',
      }),
      price_min: Joi.number().min(0).max(1e6).default(0).messages({
        'number.base': 'price_min must be a number',
        'number.min': 'price_min must be atleast 0',
        'number.max': 'price_min must be atmost 1000000',
      }),
      price_max: Joi.number().min(0).max(1e6).default(1e6).messages({
        'number.base': 'price_max must be a number',
        'number.min': 'price_max must be atleast 0',
        'number.max': 'price_max must be atmost 1000000',
      }),
      category: Joi.string().messages({
        'string.base': 'category must be a string',
      }),

      brand: Joi.string().messages({
        'string.base': 'brand must be a string',
      }),
      store_name: Joi.string().messages({
        'string.base': 'store_name must be a string',
      }),
      sort: Joi.string()
        .valid(
          'priceAsc',
          'priceDsc',
          'popular',
          'rating',
          'nearest_store',
          'best_deal',
          'newest',
          'oldest'
        )
        .messages({
          'string.base': 'sortBy must be string',
          'any.valid':
            'sortBy must be any of these values [priceAsc, priceDsc, popular, rating, nearest_store, best_deal, newest, oldest]',
        }),
      language: Joi.string().valid('en', 'ar').default('en').messages({
        'string.base': 'language must be string',
        'any.valid': 'language must be any of these values [en,ar]',
      }),
      lan: Joi.number().precision(6).messages({
        'number.base': 'lan must be number',
      }),
      lat: Joi.number().precision(6).messages({
        'number.base': 'lat must be number',
      }),
    }).with('lat', 'lan');

    const sourceObject = {
      lan: req.headers.lon,
      lat: req.headers.lat,
      language: req.headers.language,
      ...req.query,
    };

    await schema.validateAsync(sourceObject);

    next();
  }

  async getProductById(req, res, next) {
    const schema = Joi.object({
      id: Joi.number().required().positive().messages({
        'number.base': 'id must be a number',
        'number.required': 'id is required',
        'number.positive': 'id must be a positive number',
      }),
    });

    const sourceObject = {
      id: req.params.id,
    };

    await schema.validateAsync(sourceObject);

    next();
  }

  async operationsOnFavourites(req, res, next) {
    const schema = Joi.object({
      productId: Joi.number().required().positive().messages({
        'number.base': 'productId must be a number',
        'number.required': 'productId is required',
        'number.positive': 'productId must be a positive number',
      }),
    });

    console.log(req.params);

    const sourceObject = {
      productId: req.params.productId,
    };

    await schema.validateAsync(sourceObject);

    next();
  }

  async changeProductRating(req, res, next) {
    const schema = Joi.object({
      productId: Joi.number().required().positive().messages({
        'number.base': 'productId must be a number',
        'number.required': 'productId is required',
        'number.positive': 'productId must be a positive number',
      }),
      rating: Joi.number()
        .integer()
        .positive()
        .required()
        .min(1)
        .max(5)
        .messages({
          'number.base': 'rating must be a number',
          'number.integer': 'rating must be an integer, can not be float',
          'number.positive': 'rating must be a positive number',
          'number.required': 'rating is required',
          'number.min': 'rating must be at least 1',
          'number.max': 'rating must be at most 5',
        }),
    });

    const sourceObject = {
      productId: req.params.productId,
      rating: req.body.rating,
    };

    console.log(sourceObject);

    await schema.validateAsync(sourceObject);

    next();
  }

  async createProduct(req, res, next) {
    const schema = Joi.object({
      title: Joi.string().required().messages({
        'string.base': 'name must be a string',
        'string.required': 'name is required',
      }),
      title_ar: Joi.string().required().messages({
        'string.base': 'name_ar must be a string',
        'string.required': 'name_ar is required',
      }),
      sale: Joi.number().required().messages({
        'number.base': 'sale must be a number',
        'number.required': 'sale is required',
      }),
      description: Joi.string().required().messages({
        'string.base': 'description must be a string',
        'string.required': 'description is required',
      }),
      description_ar: Joi.string().required().messages({
        'string.base': 'description must be a string',
        'string.required': 'description_ar is required',
      }),
      price: Joi.number().required().positive().messages({
        'number.base': 'price must be a number',
        'number.required': 'price is required',
        'number.positive': 'price must be a positive number',
      }),
      brand: Joi.string().required().messages({
        'string.base': 'brand must be a string',
        'string.required': 'brand is required',
      }),
      category: Joi.string().required().messages({
        'string.base': 'category must be a string',
        'string.required': 'category is required',
      }),
      category_ar: Joi.string().required().messages({
        'string.base': 'category must be a string',
        'string.required': 'category_ar is required',
      }),
      product_images: Joi.array().required().messages({
        'array.base': 'product_images must be an array',
        'array.required': 'product_images is required',
      }),
    });
    const sourceObject = {
      ...req.body,
    };

    await schema.validateAsync(sourceObject);
    next();
  }

  async updateProduct(req, res, next) {
    const schema = Joi.object({
      product_id: Joi.number().required().positive().messages({
        'number.base': 'productId must be a number',
        'number.required': 'productId is required',
        'number.positive': 'productId must be a positive number',
      }),
      title: Joi.string().required().messages({
        'string.base': 'name must be a string',
        'string.required': 'name is required',
      }),
      title_ar: Joi.string().required().messages({
        'string.base': 'name must be a string',
        'string.required': 'name_ar is required',
      }),
      sale: Joi.number().required().messages({
        'number.base': 'sale must be a number',
        'number.required': 'sale is required',
      }),
      description: Joi.string().required().messages({
        'string.base': 'description must be a string',
        'string.required': 'description is required',
      }),
      description_ar: Joi.string().required().messages({
        'string.base': 'description must be a string',
        'string.required': 'description_ar is required',
      }),
      price: Joi.number().required().positive().messages({
        'number.base': 'price must be a number',
        'number.required': 'price is required',
        'number.positive': 'price must be a positive number',
      }),
    });
    const sourceObject = {
      product_id: req.params.productId,
      ...req.body,
    };
    await schema.validateAsync(sourceObject);
    next();
  }

  async deleteProductById(req, res, next) {
    const schema = Joi.object({
      product_id: Joi.number().required().positive().messages({
        'number.base': 'productId must be a number',
        'number.required': 'productId is required',
        'number.positive': 'productId must be a positive number',
      }),
    });
    const sourceObject = {
      product_id: req.params.productId,
    };
    await schema.validateAsync(sourceObject);
    next();
  }

  async autoCompleteSearch(req, res, next) {
    const schema = Joi.object({
      query_text: Joi.string().required().messages({
        'string.base': 'queryText must be a string',
        'string.required': 'queryText is required',
      }),
    });
    const sourceObject = {
      query_text: req.body.queryText,
    };
    await schema.validateAsync(sourceObject);
    next();
  }
}

module.exports = new Validation();
