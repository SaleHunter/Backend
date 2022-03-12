const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SaleHunter RESTful API',
      version: '1.0.0',
      description: 'A Dedicated RESTful API for SaleHunter',
      contact: {
        name: 'SaleHunter Support',
        email: 'salehunter101@gmail.com',
      },
    },
    servers: [
      {
        url: 'https://sale-hunter.herokuapp.com/',
        description: 'Staging Server',
      },
      {
        url: 'http://localhost:4000',
        description: 'Development Server',
      },
    ],
  },
  apis: [`${__dirname}/../api/routes/*.js`],
};

const swaggerSpecs = swaggerJsDoc(options);
console.log(swaggerSpecs);

module.exports = swaggerSpecs;
