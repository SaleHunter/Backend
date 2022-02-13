const Joi = require('joi');

const schemas = {
  signup: Joi.object()
    .keys({
      fullname: Joi.string().min(3).max(30).required(),

      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

      passwordConfirmation: Joi.ref('password'),

      access_token: [Joi.string(), Joi.number()],

      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      }),
      profile_img: Joi.string(),
    })
    .xor('password', 'access_token')
    .with('password', 'passwordConfirmation'),
};
module.exports = schemas;
