const Joi = require('joi');

const schemas = {
  signup: Joi.object()
    .keys({
      fullname: Joi.string().alphanum().min(3).max(30).required(),

      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

      passwordConfirm: Joi.ref('password'),

      access_token: [Joi.string(), Joi.number()],

      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      }),
    })
    .xor('password', 'access_token')
    .with('password', 'passwordConfirm'),
};
module.exports = schemas;
