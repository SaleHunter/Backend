const Joi = require('joi');
const isBase64 = require('is-base64');

function isValidBase64Image(base64Image, helpers) {
  const isValid = isBase64(base64Image, { allowMime: true });

  if (!isValid) {
    console.log('Not Valid');
    throw new Error('Not a valid base64 image');
  }

  return base64Image;
}

class Validation {
  async getStoreById(req, res, next) {
    const schema = Joi.object({
      id: Joi.number().required().positive().messages({
        'number.base': 'id must be a number',
        'number.required': 'id is required',
        'number.positive': 'id must be a positive number',
      }),
      limit: Joi.number().max(60).optional().default(20).messages({
        'number.base': 'limit must be number',
        'number.max': 'The maximum limit is 60',
      }),
      page: Joi.number().min(1).optional().default(1).messages({
        'number.base': 'page must be number',
        'number.min': 'The minimum page is 1',
      }),
    });

    // console.log(req.query);

    const sourceObject = {
      id: req.params.id,
      limit: req.query.limit,
      page: req.query.page,
    };

    await schema.validateAsync(sourceObject);
    next();
  }

  async createStore(req, res, next) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(45).required().messages({
        'string.base': 'name must be string',
        'string.min': 'The minimum name length is 3',
        'string.max': 'The maximum name length is 45',
        'any.required': 'name is required',
      }),
      logo: Joi.string().custom(isValidBase64Image).messages({
        'string.base': 'logo must be a valid base64 image',
        'any.custom': 'logo must be a valid base64 image',
      }),
      phone: Joi.string().min(11).max(11).messages({
        'string.base': 'phone must be a string',
        'string.min': 'phone must be at least 11 numbers',
        'string.max': 'phone must be at most 11 numbers',
      }),
      whatsapp: Joi.string().min(11).max(11).messages({
        'string.base': 'whatsapp must be a string',
        'string.min': 'whatsapp must be at least 11 numbers',
        'string.max': 'whatsapp must be at most 11 numbers',
      }),
      description: Joi.string().max(200).messages({
        'string.base': 'description must be string',
        'string.max': 'The maximum description length is 200',
      }),
      address: Joi.string().required().max(300).messages({
        'string.base': 'address must be string',
        'string.max': 'The maximum address length is 300',
        'any.required': 'address is required',
      }),
      longitude: Joi.number().precision(8).messages({
        'number.base': 'longitude must be number',
      }),
      latitude: Joi.number().precision(8).messages({
        'number.base': 'latitude must be number',
      }),
      niche_market: Joi.string().max(45).required().messages({
        'string.base': 'niche_market must be string',
        'string.max': 'The maximum niche_market length is 45',
        'any.required': 'niche_market is required',
      }),
      facebook: Joi.string().max(300).messages({
        'string.base': 'facebook must be string',
        'string.max': 'The maximum facebook length is 300',
      }),
      instagram: Joi.string().max(300).messages({
        'string.base': 'instagram must be string',
        'string.max': 'The maximum instagram length is 300',
      }),
      website: Joi.string().uri().min(10).max(100).messages({
        'string.base': 'website must be string',
        'string.uri': 'website must be a valid url',
        'string.max': 'The maximum website length is 100',
        'string.min': 'The minimum website length is 10',
      }),
    });

    await schema.validateAsync(req.body);
    next();
  }

  async deleteStoreById(req, res, next) {
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

  async updateStoreById(req, res, next) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(45).messages({
        'string.base': 'name must be string',
        'string.min': 'The minimum name length is 3',
        'string.max': 'The maximum name length is 45',
      }),
      logo: Joi.string().custom(isValidBase64Image).messages({
        'string.base': 'logo must be a valid base64 image',
        'any.custom': 'logo must be a valid base64 image',
      }),
      phone: Joi.string().min(11).max(11).messages({
        'string.base': 'phone must be a string',
        'string.min': 'phone must be at least 11 numbers',
        'string.max': 'phone must be at most 11 numbers',
      }),
      whatsapp: Joi.string().min(11).max(11).messages({
        'string.base': 'whatsapp must be a string',
        'string.min': 'whatsapp must be at least 11 numbers',
        'string.max': 'whatsapp must be at most 11 numbers',
      }),
      description: Joi.string().max(200).messages({
        'string.base': 'description must be string',
        'string.max': 'The maximum description length is 200',
      }),
      address: Joi.string().max(300).messages({
        'string.base': 'address must be string',
        'string.max': 'The maximum address length is 300',
      }),
      longitude: Joi.number().precision(8).messages({
        'number.base': 'longitude must be number',
      }),
      latitude: Joi.number().precision(8).messages({
        'number.base': 'latitude must be number',
      }),
      niche_market: Joi.string().max(45).messages({
        'string.base': 'niche_market must be string',
        'string.max': 'The maximum niche_market length is 45',
      }),
      facebook: Joi.string().max(300).messages({
        'string.base': 'facebook must be string',
        'string.max': 'The maximum facebook length is 300',
      }),
      instagram: Joi.string().max(300).messages({
        'string.base': 'instagram must be string',
        'string.max': 'The maximum instagram length is 300',
      }),
      website: Joi.string().uri().min(10).max(100).messages({
        'string.base': 'website must be string',
        'string.uri': 'website must be a valid url',
        'string.max': 'The maximum website length is 100',
        'string.min': 'The minimum website length is 10',
      }),
    })
      .min(1)
      .messages({
        'object.min': 'At Least one key must be specified',
      });

    await schema.validateAsync(req.body);
    next();
  }
}

module.exports = new Validation();
