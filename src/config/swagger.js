const swaggerJsDoc = require('swagger-jsdoc');
const t = require('../api/routes/authRoutes');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SaleHunter RESTful API',
      version: '1.0.0',
      description: 'A dedicated RESTful API for SaleHunter',
    },
    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],
  },
  apis: [`${__dirname}/../api/routes/*.js`],
};

const swaggerSpecs = swaggerJsDoc(options);
console.log(swaggerSpecs);

module.exports = swaggerSpecs;
