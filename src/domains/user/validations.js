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
   * @method  Verify Email Validation Schema
   * @async
   * @access public
   * @param {callback} middleware - Express middleware.
   */
  async verifyEmail(req, res, next) {
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
   * @method Verify Email Token Validation Schema
   * @async
   * @access public
   * @param {callback} middleware - Express middleware.
   */
  async verifyEmailToken(req, res, next) {
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
          .pattern(
            new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
          ) // Accepts only letters, numbers and '-@./#&'
          .required()
          .messages({
            'string.base': 'Password must be string',
            'string.min': 'The minimum password length is 8',
            'string.pattern.base':
              'Please enter a valid Password, must be Alphanumeric and contains special characters like (@#$%^&)',
            'any.required': 'Password is required',
          }),
        passwordConfirm: Joi.ref('password'),
        fullname: Joi.string().min(3).max(30).required().messages({
          'string.base': 'fullname must be string',
          'string.min': 'The minimum fullname length is 3',
          'string.max': 'The maximum fullname length is 30',
          'any.required': 'fullname is required',
        }),
        profile_img: Joi.string().messages({
          'string.base': 'Invalid Image.',
        }),
        access_token: [Joi.string(), Joi.number()],
      })
      .xor('password', 'access_token')
      .with('password', 'passwordConfirm');

    await schema.validateAsync(req.body);

    next();
  }

  /**
   * @method Get User By Id Validation Schema
   * @access public
   * @async
   * @param {callback} middleware - Express middleware.
   */
  async getUser(req, res, next) {
    const schema = Joi.object({
      id: Joi.number().required().messages({
        'number.base': 'Id must be a number',
        'any.required': 'Id is required',
      }),
    });

    await schema.validateAsync({ id: req.user.id });

    next();
  }

  /**
   * @method Update User Validation Schema
   * @access public
   * @async
   * @param {callback} middleware - Express middleware.
   */
  async updateUser(req, res, next) {
    const schema = Joi.object()
      .keys({
        id: Joi.number().required().messages({
          'number.base': 'Id must be a number',
          'any.required': 'Id is required',
        }),
        email: Joi.string().email().optional().messages({
          'string.base': 'Email must be string',
          'string.email': 'Please provide a valid email address',
        }),
        fullname: Joi.string().optional().messages({
          'string.base': 'Fullname must be string',
        }),
        profile_img: Joi.string().optional().messages({
          'string.base': 'profile_img must be string',
        }),
      })
      .or('email', 'fullname', 'profile_img')
      .required()
      .messages({
        'object.missing':
          'At least one key (email, fullname, profile_img) must be specified',
      });

    const sourceObject = {
      id: req.user.id,
      email: req.body.email,
      fullname: req.body.fullname,
      profile_img: req.body.profile_img,
    };

    console.log('Source', sourceObject);
    await schema.validateAsync(sourceObject);

    next();
  }

  /**
   * @method Update User's Password Validation Schema
   * @access public
   * @async
   * @param {callback} middleware - Express middleware.
   */
  async updatePassword(req, res, next) {
    const schema = Joi.object({
      id: Joi.number().required().messages({
        'number.base': 'Id must be  a number',
        'any.required': 'Id is required',
      }),
      oldPassword: Joi.string()
        .min(8)
        .pattern(
          new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
        ) // Accepts only letters, numbers and special characters
        .required()
        .messages({
          'string.base': 'oldPassword is must be string',
          'string.min': 'The minimum oldPassword length is 8',
          'string.pattern.base':
            'Please enter a valid oldPassword, must be Alphanumeric and contains special characters like (@#$%^&)',
          'any.required': 'oldPassword is required',
        }),

      newPassword: Joi.string()
        .min(8)
        .pattern(
          new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
        ) // Accepts only letters, numbers and special characters
        .required()
        .messages({
          'string.base': 'newPassword is must be string',
          'string.min': 'The minimum newPassword length is 8',
          'string.pattern.base':
            'Please enter a valid newPassword, must be Alphanumeric and contains special characters like (@#$%^&)',
          'any.required': 'newPassword is required',
        }),

      newPasswordConfirm: Joi.ref('newPassword'),
    });

    const sourceObject = {
      id: req.user.id,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
      newPasswordConfirm: req.body.newPasswordConfirm,
    };

    await schema.validateAsync(sourceObject);

    next();
  }

  async googleAuth(req, res, next) {
    const schema = Joi.object().keys({
      email: Joi.string().email().messages({
        'string.base': 'Email is must be a string',
        'string.email': 'Please provide a valid email address',
      }),
      fullname: Joi.string().min(3).max(30).required().messages({
        'string.base': 'fullname must be string',
        'string.min': 'The minimum fullname length is 3',
        'string.max': 'The maximum fullname length is 30',
        'any.required': 'fullname is required',
      }),
      profile_img: Joi.string().messages({
        'string.base': 'Invalid Image.',
      }),
      thirdParty_id: Joi.string().required().messages({
        'string.base': 'thirdParty_id must be a string',
        'any.required': 'Please provide a valid thirdParty_id address',
      }),
    });
    await schema.validateAsync(req.body);

    next();
  }

  async facebookAuth(req, res, next) {
    const schema = Joi.object().keys({
      fullname: Joi.string().min(3).max(30).required().messages({
        'string.base': 'fullname must be string',
        'string.min': 'The minimum fullname length is 3',
        'string.max': 'The maximum fullname length is 30',
        'any.required': 'fullname is required',
      }),
      profile_img: Joi.string().messages({
        'string.base': 'Invalid Image.',
      }),
      thirdParty_id: Joi.string().required().messages({
        'string.base': 'thirdParty_id must be a string',
        'any.required': 'Please provide a valid thirdParty_id address',
      }),
    });
    await schema.validateAsync(req.body);

    next();
  }
}

module.exports = new Validation();
