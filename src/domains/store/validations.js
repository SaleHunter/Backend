const Joi = require('joi');

class Validation {
  async getStoreById(req, res, next) {
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

  async createStore(req, res, next) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(45).required().messages({
        'string.base': 'name must be string',
        'string.min': 'The minimum name length is 3',
        'string.max': 'The maximum name length is 45',
        'any.required': 'name is required',
      }),
      logo: Joi.string().messages({
        'string.base': 'Invalid Image.',
      }),
      phone: Joi.number().min(11).max(13).optional().positive().messages({
        'number.base': 'phone must be a number',
        'number.positive': 'phone must be a positive number',
        'number.min': 'The minimum phone length is 11',
        'number.max': 'The maximum phone length is 13',
      }),
      branches: Joi.array().items(
        Joi.object({
          address: Joi.string().required().max(250).messages({
            'string.base': 'name must be string',
            'string.max': 'The maximum name length is 250',
            'any.required': 'name is required',
          }),
          lon: Joi.number().precision(6).messages({
            'number.base': 'lon must be number',
          }),
          lat: Joi.number().precision(6).messages({
            'number.base': 'lat must be number',
          }),
        })
      ),
    });

    const sourceObject = {
      name: req.body.name,
      logo: req.body.logo,
      phone: req.body.phone,
      branches: req.body.branches,
    };

    await schema.validateAsync(sourceObject);
    next();
  }

  async deleteStore(req, res, next) {
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
