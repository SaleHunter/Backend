const userPaths = require('../domains/user/swagger-docs');
const productPaths = require('../domains/product/swagger-docs');
module.exports = {
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
      url: 'https://sale-hunter.herokuapp.com/api/v1',
      description: 'Staging Server',
    },
    {
      url: 'http://localhost:6200/api/v1',
      description: 'Development Server',
    },
  ],
  tags: [
    {
      name: 'Users',
      description: 'Users endpoints',
    },
    {
      name: 'Products',
      description: 'Products endpoints',
    },
  ],
  paths: {
    '/users/auth/google/': {
      get: userPaths.google_signin,
    },
    '/users/auth/facebook/': {
      get: userPaths.google_signin,
    },
    '/users': {
      get: userPaths.getAuthenticatedUser,
      patch: userPaths.updateAuthenticatedUser,
    },

    '/users/updatePassword': {
      patch: userPaths.updateAuthenticatedUserPassword,
    },
    '/users/auth/signin': {
      post: userPaths.signin,
    },
    '/users/auth/signup': {
      post: userPaths.signup,
    },
    '/users/verifyEmail': {
      post: userPaths.verifyEmail,
    },
    '/users/verifyEmailToken/{resetToken}': {
      post: userPaths.verifyEmailToken,
    },
    '/users/auth/resetPassword/{resetToken}': {
      patch: userPaths.resetPassword,
    },
    '/products': {
      get: productPaths.searchForProducts,
    },
    '/products/{id}': {
      get: productPaths.getProductById,
    },
  },
  components: {
    schemas: {
      User: {
        name: 'User',
        in: 'body',
        description: 'User Schema',
        type: 'object',
        properties: {
          id: {
            description: 'The Id of the user',
            type: 'number',
          },
          fullname: {
            description: 'The Full name of the user',
            type: 'string',
          },
          email: {
            description: 'The Email of the user',
            type: 'string',
            format: 'email',
          },
          profile_img: {
            description: 'The profile image url of the user on cloudinary',
            type: 'string',
          },
          last_seen: {
            description: 'The last time the user was online',
            type: 'string',
            format: 'date-time',
          },
        },
        example: {
          id: 10,
          fullname: 'Will Smith',
          email: 'willsmith@gmail.com',
          profile_img:
            'http://res.cloudinary.com/salehunter101/image/upload/v1647288905/profile/image/ritqurfuxecvny5vzal6.png',
          last_seen: new Date(),
        },
      },
      SignUp: {
        name: 'Sign Up',
        in: 'body',
        description: 'Sign Up Schema',
        type: 'object',
        properties: {
          fullname: {
            description: 'The Full name of the user',
            type: 'string',
            required: true,
          },
          email: {
            description: 'The Email of the user',
            type: 'string',
            format: 'email',
            required: true,
          },
          password: {
            description: 'The Password of the user',
            type: 'string',
            format: 'password',
            required: true,
          },
          passwordConfirm: {
            description: 'The Password confirm of the user',
            type: 'string',
            format: 'password',
            required: true,
          },
        },
        example: {
          fullname: 'Will Smith',
          email: 'willsmith@gmail.com',
          password: '**********',
          passwordConfirm: '**********',
        },
      },
      NotFoundError: {
        name: 'Not Found Error',
        in: 'body',
        description: 'Not Found Error Schema',
        type: 'object',
        properties: {
          status: {
            description: 'The response status message',
            type: 'string',
            example: 'Fail',
          },
          message: {
            description: 'Error message',
            type: 'string',
            example: 'There is no user Found',
          },
        },
      },
      IncorrectPasswordError: {
        name: 'Incorrect Password Error',
        in: 'body',
        description: 'Incorrect Password Error Schema',
        type: 'object',
        properties: {
          status: {
            description: 'The response status message',
            type: 'string',
            example: 'Fail',
          },
          message: {
            description: 'Error message',
            type: 'string',
            example: 'Incorrect password',
          },
        },
      },
      ValidationError: {
        name: 'Validation Error',
        in: 'body',
        description: 'Validation Error Schema',
        type: 'object',
        properties: {
          status: {
            description: 'The response status message',
            type: 'string',
            example: 'Fail',
          },
          message: {
            description: 'Error message',
            type: 'string',
            example: 'ValidationError',
          },
          details: {
            description:
              'The Error details message, explains why validation failed',
            type: 'string',
          },
        },
      },
      UnAuthorizedError: {
        name: 'Un Authorized Error',
        in: 'body',
        description: 'Un Authorized Error Schema',
        type: 'object',
        properties: {
          status: {
            description: 'The response status message',
            type: 'string',
            example: 'Fail',
          },
          message: {
            description: 'Error message',
            type: 'string',
            example: 'Un Authorized User, Please sign in to continue',
          },
        },
      },
      ProductBasicWithStoreInfo: {
        name: 'Product Basic With Store Information',
        in: 'body',
        description:
          'The Basic Information of the requested product with Store Information',
        type: 'object',
        properties: {
          product_id: {
            description: 'The Product Id',
            type: 'number',
          },
          product_title: {
            description: 'The Product Title',
            type: 'string',
          },
          product_title_ar: {
            description: 'The Arabic Product Title',
            type: 'string',
          },
          product_brand: {
            description: 'The Product Brand',
            type: 'string',
          },
          product_category: {
            description: 'The Product Category',
            type: 'string',
          },
          product_category_ar: {
            description: 'The Arabic Product Category',
            type: 'string',
          },
          product_url: {
            description: 'The Product Url',
            type: 'string',
          },
          store_id: {
            description: 'The Store ID',
            type: 'number',
          },
          store_name: {
            description: 'The Store name',
            type: 'string',
          },
          store_logo: {
            description: 'The Store Logo',
            type: 'string',
          },
          store_type: {
            description: 'The Store Type',
            type: 'string',
          },
        },
      },
      ProductDetailedInfo: {
        name: 'Product Detailed Information',
        in: 'body',
        description: 'The Detailed Information of the requested product',
        type: 'object',
        properties: {
          basic: {
            description: 'The Basic Information of the requested product',
            type: 'object',
            example: {
              product_id: 1,
              product_title: 'Apple iPhone 13 Pro Max 256GB Blue',
              product_title_ar:
                'موبايل ايفون 13 Pro Max، 256 جيجابايت، ازرق سييرا',
              product_brand: 'apple',
              product_category: 'Electronics',
              product_category_ar: 'إلكترونيات',
              product_url: 'https://www.amazon.eg/dp/B09G9CD8PS?language=en_AE',
              product_sale: 25000,
            },
          },
          prices: {
            description: 'All The Price of the Product',
            type: 'array',
            example: [
              {
                price: 27976,
                created_at: '2022-03-23',
              },
              {
                price: 28000,
                created_at: '2022-03-25',
              },
            ],
          },
          images: {
            description: 'All The Images of the Product',
            type: 'array',
            example: [
              {
                img_id: 1,
                img_url:
                  'https://images-na.ssl-images-amazon.com/images/I/61i8Vjb17SL.__AC_SX300_SY300_QL70_ML2_.jpg',
              },
              {
                img_id: 2,
                img_url:
                  'https://images-na.ssl-images-amazon.com/images/I/61i8Vjb17SL.__AC_SX300_SY300_QL70_ML2_.jpg',
              },
            ],
          },
          store: {
            description: 'The Store of the Product',
            type: 'object',
            example: {
              store_id: 1,
              store_name: 'Amazon',
              store_logo: null,
              store_type: 'online',
            },
          },
          rating: {
            description: 'The Rating of the Product',
            type: 'object',
            example: {
              rating_average: '4.0',
              number_of_ratings: 1,
            },
          },
          rating: {
            description: 'The Total Number of Views of the Product',
            type: 'object',
            example: {
              number_of_views: 387,
            },
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'JWT',
      },
    },
  },
};
