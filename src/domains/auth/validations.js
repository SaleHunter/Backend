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
  async signup(req, res, next) {
    const schema = Joi.object()
      .keys({
        email: Joi.string().email().required().messages({
          'string.base': 'Email is must be a string',
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
        passwordConfirmation: Joi.ref('password'),
        fullname: Joi.string().min(3).max(30).required().messages({
          'string.base': 'Username must be string',
          'string.min': 'The minimum Username length is 3',
          'string.max': 'The maximum Username length is 30',
          'any.required': 'Username is required',
        }),
        profile_img: Joi.string().messages({
          'string.base': 'Invalid Image.',
        }),
        access_token: [Joi.string(), Joi.number()],
      })
      .xor('password', 'access_token')
      .with('password', 'passwordConfirmation');
    try {
      await schema.validateAsync(req.body);
    } catch (err) {
      res.json({
        status: 'failed',
        message: 'validation failed',
        error: err.details,
      });
    }

    next();
  }
}

module.exports = new Validation();
