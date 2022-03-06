const Joi = require('joi');

/**
 * @class
 * @classdesc Represents a class for Request Validation
 */
class Validation {
  /**
   * @method Sign In Validation Schema
   * @access public
   * @async
   * @param {callback} middleware - Express middleware.
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
        .pattern(
          new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
        ) // Accepts only letters, numbers and special characters
        .required()
        .messages({
          'string.base': 'Password is must be string',
          'string.min': 'The minimum password length is 8',
          'string.pattern.base':
            'Please enter a valid password, must be Alphanumeric and contains special characters like (@#$%^&)',
          'any.required': 'Password is required',
        }),
    });

    await schema.validateAsync(req.body);

    next();
  }

  /**
   * @method  Forget Password Validation Schema
   * @async
   * @access public
   * @param {callback} middleware - Express middleware.
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

  /**
   * @method Verify Reset Token Validation Schema
   * @async
   * @access public
   * @param {callback} middleware - Express middleware.
   */
  async verifyResetToken(req, res, next) {
    const schema = Joi.object({
      resetToken: Joi.alternatives().conditional('client', {
        is: 'mobile',
        then: Joi.string().required().length(6).messages({
          'string.base': 'Reset Pin must be string',
          'any.required': 'Reset Pin is required',
          'string.length': 'The size of the Reset Pin is 6',
        }),
        otherwise: Joi.string().required().min(16).max(32).messages({
          'string.base': 'Reset Token must be string',
          'any.required': 'Reset Token  is required',
          'string.min': 'The minimum size of the Reset Token  is 16',
          'string.max': 'The maximum size of the Reset Token  is 32',
        }),
      }),
      client: Joi.string(),
    });

    const sourceObject = {
      resetToken: req.params.resetToken,
      client: req.header('client') || 'web',
    };

    await schema.validateAsync(sourceObject);

    next();
  }

  /**
   * @method Reset Password Validation Schema
   * @async
   * @access public
   * @param {callback} middleware - Express middleware.
   */
  async resetPassword(req, res, next) {
    const schema = Joi.object({
      resetToken: Joi.alternatives().conditional('client', {
        is: 'mobile',
        then: Joi.string().required().length(6).messages({
          'string.base': 'Reset Pin must be string',
          'any.required': 'Reset Pin is required',
          'string.length': 'The size of the Reset Pin is 6',
        }),
        otherwise: Joi.string().required().min(16).max(32).messages({
          'string.base': 'Reset Token must be string',
          'any.required': 'Reset Token  is required',
          'string.min': 'The minimum size of the Reset Token  is 16',
          'string.max': 'The maximum size of the Reset Token  is 32',
        }),
      }),
      client: Joi.string(),
      password: Joi.string()
        .min(8)
        .pattern(
          new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
        ) // Accepts only letters, numbers and special characters
        .required()
        .messages({
          'string.base': 'Password is must be string',
          'string.min': 'The minimum password length is 8',
          'string.pattern.base':
            'Please enter a valid password, must be Alphanumeric and contains special characters like (_@./#&)',
          'any.required': 'Password is required',
        }),

      passwordConfirm: Joi.ref('password'),
    });

    const sourceObject = {
      resetToken: req.params.resetToken,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      client: req.header('client') || 'web',
    };

    console.log(sourceObject);

    await schema.validateAsync(sourceObject);

    next();
  }
}

module.exports = new Validation();
