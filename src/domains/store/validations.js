const Joi = require('joi');

class Validation {
  async getStoreById(req, res, next) {
    const schema = Joi.object({
      id: Joi.number().required().positive().messages({
        'number.base': 'id must be a number',
        'number.required': 'id is required',
        'number.positive': 'id must be a positive number',
      }),
      limit: Joi.number().max(60).optional().messages({
        'number.base': 'limit must be number',
        'number.max': 'The maximum limit is 60',
      }),
      page: Joi.number().min(1).optional().messages({
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
      name: Joi.string().min(5).max(45).required().messages({
        'string.base': 'name must be string',
        'string.min': 'The minimum name length is 5',
        'string.max': 'The maximum name length is 45',
        'any.required': 'name is required',
      }),
      logo: Joi.string().messages({
        'string.base': 'Invalid Image.',
      }),
      phone: Joi.string().messages({
        'string.base': 'phone must be a string',
      }),
      whatsapp: Joi.string().messages({
        'string.base': 'whatsapp must be a string',
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
      name: Joi.string().min(5).max(45).messages({
        'string.base': 'name must be string',
        'string.min': 'The minimum name length is 5',
        'string.max': 'The maximum name length is 45',
      }),
      logo: Joi.string().messages({
        'string.base': 'Invalid Image.',
      }),
      phone: Joi.string().messages({
        'string.base': 'phone must be a string',
      }),
      whatsapp: Joi.string().messages({
        'string.base': 'whatsapp must be a string',
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
