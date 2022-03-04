/**
 * TODO: build
 */
// class validation{
//   async signup(){
//     // obj extraction
//     // this.validate(obj);
//   }
//   async signin(){

//   }
//   async validate(obj)
// }

const Joi = require('joi');

/**
 * @class
 * @classdesc Represents a class for Request Validation
 */
class Validation {
  /**
   * @method Create sign in validation schema
   * @access public
   * @returns {ObjectSchema} sign in validation schema
   */
  signin() {
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

    return schema;
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
    schema.validateAsync(req.body);
    next();
  }
}

module.exports = new Validation();
