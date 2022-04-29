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
    '/products/recommended': {
      get: productPaths.getRecommendedProducts,
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
      RecommendedProducts: {
        name: 'Recommended  Top Products',
        in: 'body',
        description: 'The Array of Recommended  Top Products',
        type: 'array',
        example: [
          {
            id: 1,
            title: 'IPhone 13 Single SIM With FaceTime - 128GB - Starlight',
            title_ar: 'IPhone 13 Single SIM With FaceTime - 128GB - Starlight',
            brand: 'Apple',
            price: 17400,
            image:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/04/690352/1.jpg?0605',
            sale: null,
            store_id: 2,
            name: 'Jumia',
            logo: null,
            store_type: 'online',
            rating: '2.0000',
            rating_count: 1,
            views_today: 10,
          },
          {
            id: 62,
            title: 'Kids Unisex • Running TENSAUR SHOES S24033',
            title_ar: 'Kids Unisex • Running TENSAUR SHOES S24033',
            brand: 'Adidas',
            price: 869,
            image:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/94/233032/1.jpg?8409',
            sale: null,
            store_id: 2,
            name: 'Jumia',
            logo: null,
            store_type: 'online',
            rating: '3.0000',
            rating_count: 1,
            views_today: 8,
          },
          {
            id: 100,
            title: 'Bomber Jacket With Zipper Waterproof-Dark Gray',
            title_ar: 'Bomber Jacket With Zipper Waterproof-Dark Gray',
            brand: 'Generic',
            price: 249,
            image:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/62/410142/1.jpg?6948',
            sale: null,
            store_id: 2,
            name: 'Jumia',
            logo: null,
            store_type: 'online',
            rating: '1.0000',
            rating_count: 1,
            views_today: 7,
          },
          {
            id: 12,
            title:
              'Heat Shrink Tube For Protect And Repair Cables - 5 - 6 - 8 - 10 - 12 Mm Inner Diameter - 20 Pieces',
            title_ar:
              'Heat Shrink Tube For Protect And Repair Cables - 5 - 6 - 8 - 10 - 12 Mm Inner Diameter - 20 Pieces',
            brand: 'Generic',
            price: 50.150001525878906,
            image:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/21/98738/1.jpg?2965',
            sale: null,
            store_id: 2,
            name: 'Jumia',
            logo: null,
            store_type: 'online',
            rating: '5.0000',
            rating_count: 1,
            views_today: 7,
          },
          {
            id: 47,
            title: 'Apple iPhone 12 Pro 128GB 6 GB RAM, Pacific Blue',
            title_ar:
              'ابل ايفون 12 برو، 128 جيجابايت، ذاكرة رام 6 جيجابايت، لون ازرق فاتح',
            brand: 'apple',
            price: 22899,
            image:
              'https://images-na.ssl-images-amazon.com/images/I/71DVgBTdyLL.__AC_SX300_SY300_QL70_ML2_.jpg',
            sale: null,
            store_id: 1,
            name: 'Amazon',
            logo: null,
            store_type: 'online',
            rating: '3.0000',
            rating_count: 1,
            views_today: 6,
          },
          {
            id: 131,
            title: 'One Shock - For Men - EDT- 100ml',
            title_ar: 'One Shock - For Men - EDT- 100ml',
            brand: 'Calvin Klein',
            price: 650,
            image:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/59/383991/1.jpg?9657',
            sale: null,
            store_id: 2,
            name: 'Jumia',
            logo: null,
            store_type: 'online',
            rating: '4.0000',
            rating_count: 1,
            views_today: 6,
          },
          {
            id: 117,
            title: 'Euphoria Intense - For Men - EDT -  100 Ml',
            title_ar: 'Euphoria Intense - For Men - EDT -  100 Ml',
            brand: 'Calvin Klein',
            price: 825,
            image:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/40/3865/1.jpg?4012',
            sale: null,
            store_id: 2,
            name: 'Jumia',
            logo: null,
            store_type: 'online',
            rating: '2.0000',
            rating_count: 1,
            views_today: 5,
          },
          {
            id: 122,
            title: 'Ck Be - EDT - Unisex - 100ml',
            title_ar: 'Ck Be - EDT - Unisex - 100ml',
            brand: 'Calvin Klein',
            price: 490,
            image:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/11/086991/1.jpg?0507',
            sale: null,
            store_id: 2,
            name: 'Jumia',
            logo: null,
            store_type: 'online',
            rating: '4.0000',
            rating_count: 1,
            views_today: 5,
          },
          {
            id: 11,
            title:
              'IPhone 11 Pro Max Case With Hand Chain And Covers The Camera',
            title_ar:
              'IPhone 11 Pro Max Case With Hand Chain And Covers The Camera',
            brand: 'Generic',
            price: 149,
            image:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/52/437952/1.jpg?2389',
            sale: null,
            store_id: 2,
            name: 'Jumia',
            logo: null,
            store_type: 'online',
            rating: '2.0000',
            rating_count: 1,
            views_today: 5,
          },
          {
            id: 48,
            title:
              'Caka Protector for iPhone 11 Screen Protector 3D Tempered Glass Ultra Slim Thin Full Coverage Film Protection Bubble Free Clear Smooth for iPhone 11 (6.1 inch)(2 Pack)',
            title_ar:
              'شاشة حماية لموبايل ايفون 11 بتقنية ثلاثية بوصة زجاج مقوى نحيف للغاية ورقيق بتغطية كاملة للحماية من الفقاعات وشفاف ناعم لموبايل ايفون 11 (6.1 بوصة) (عدد 2 شاشة)',
            brand: 'other',
            price: 29,
            image:
              'https://images-na.ssl-images-amazon.com/images/I/41ABtaRYyfL.__AC_SY300_SX300_QL70_ML2_.jpg',
            sale: null,
            store_id: 1,
            name: 'Amazon',
            logo: null,
            store_type: 'online',
            rating: '5.0000',
            rating_count: 1,
            views_today: 5,
          },
        ],
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
