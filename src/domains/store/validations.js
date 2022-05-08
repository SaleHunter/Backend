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
      phone: Joi.number().min(11).max(11).optional().positive().messages({
        'number.base': 'phone must be a number',
        'number.positive': 'phone must be a positive number',
        'number.min': 'The minimum phone length is 11',
        'number.max': 'The maximum phone length is 11',
      }),
      whatsapp: Joi.number().min(11).max(11).optional().positive().messages({
        'number.base': 'whatsapp must be a number',
        'number.positive': 'whatsapp must be a positive number',
        'number.min': 'The minimum whatsapp length is 11',
        'number.max': 'The maximum whatsapp length is 11',
      }),
      description: Joi.string().max(200).optional().messages({
        'string.base': 'description must be string',
        'string.max': 'The maximum description length is 200',
      }),
      address: Joi.string().required().max(300).messages({
        'string.base': 'address must be string',
        'string.max': 'The maximum address length is 300',
        'any.required': 'address is required',
      }),
      longitude: Joi.number().precision(8).messages({
        'number.base': 'lon must be number',
      }),
      latitude: Joi.number().precision(8).messages({
        'number.base': 'lat must be number',
      }),
      niche_market: Joi.string().max(45).required().messages({
        'string.base': 'niche_market must be string',
        'string.max': 'The maximum niche_market length is 45',
        'any.required': 'niche_market is required',
      }),
      facebook: Joi.string().max(300).optional().messages({
        'string.base': 'facebook must be string',
        'string.max': 'The maximum facebook length is 300',
      }),
      instagram: Joi.string().max(300).optional().messages({
        'string.base': 'instagram must be string',
        'string.max': 'The maximum instagram length is 300',
      }),
    });

    // const sourceObject = {
    //   name: req.body.name,
    //   logo: req.body.logo,
    //   phone: req.body.phone,
    //   branches: req.body.branches,
    // };

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
}

module.exports = new Validation();
