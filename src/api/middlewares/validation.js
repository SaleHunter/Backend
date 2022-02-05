const Joi = require('joi');

const validate = (schema, property) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property]);
    const valid = error == null;
    console.log('error:', error);
    if (valid) {
      return next();
    } else {
      const { details } = error;
      const message = details.map(i => i.message).join(',');
      console.log('Validation Error:', message);
      return res.json({ error: message });
    }
  };
};
module.exports = validate;
