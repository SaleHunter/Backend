const Joi = require('joi');

/**
 * @class
 * @classdesc Represents a class for Request Validation
 */
class Validation {
  /**
   * @method Sign In Validation Schema
   * @access public
   */
  async signin(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        'string.base': 'Email is must be string',
        'any.required': 'Email is required',
        'string.email': 'Please provide a valid email address',
      }),

      password: Joi.string()
        .min(8)
        .pattern(new RegExp(/^[ A-Za-z0-9_@./#&+-]*$/)) // Accepts only letters, numbers and '-@./#&'
        .required()
        .messages({
          'string.base': 'Password is must be string',
          'string.min': 'The minimum password length is 8',
          'string.pattern.base': 'Please enter a valid password',
          'any.required': 'Password is required',
        }),
    });

    await schema.validateAsync(req.body);

    next();
  }

  /**
   * @method  Forget Password Validation Schema
   * @access public
   */
  async forgetPassword(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        'string.base': 'Email is must be string',
        'any.required': 'Email is required',
        'string.email': 'Please provide a valid email address',
      }),
    });

    await schema.validateAsync(req.body);

    next();
  }
}

module.exports = new Validation();
