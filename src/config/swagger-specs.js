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
    '/products/favourites': {
      get: productPaths.getFavouriteProducts,
    },
    '/products/favourites/{productid}': {
      post: productPaths.addProductToFavourites,
    },
    '/products/favourites/{productId}': {
      delete: productPaths.deleteProductFromFavourites,
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
            product_id: 8,
            product_title:
              'Anti Shock Back Cover  For Apple IPhone 11 - Transparent',
            product_title_ar:
              'Anti Shock Back Cover  For Apple IPhone 11 - Transparent',
            product_brand: 'Generic',
            product_price: 31,
            image_url:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/72/520622/1.jpg?4062',
            product_sale: null,
            store_id: 2,
            store_name: 'Jumia',
            store_logo: null,
            store_type: 'online',
            product_rating: '2.0000',
            product_rating_count: 1,
            views_today: 0,
          },
          {
            product_id: 503,
            product_title: 'Men • Swimming  REEBOK FULGERE DV4208',
            product_title_ar: 'Men • Swimming  REEBOK FULGERE DV4208',
            product_brand: 'Reebok',
            product_price: 569,
            image_url:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/97/029312/1.jpg?8044',
            product_sale: null,
            store_id: 2,
            store_name: 'Jumia',
            store_logo: null,
            store_type: 'online',
            product_rating: '5.0000',
            product_rating_count: 1,
            views_today: 0,
          },
          {
            product_id: 45,
            product_title:
              'Apple iPhone 13 with FaceTime - 128GB, 4GB RAM, 4G LTE, Pink, Single SIM & E-SIM - International Warranty',
            product_title_ar:
              'ابل ايفون 13 مع فيس تايم - 128 جيجا ، 4 جيجا رام ، الجيل الرابع ال تي اي ، زهري ، شريحة واحدة وشريحة الكترونية - ضمان دولي',
            product_brand: 'apple',
            product_price: 350,
            image_url:
              'https://images-na.ssl-images-amazon.com/images/I/61l9ppRIiqL.__AC_SX300_SY300_QL70_ML2_.jpg',
            product_sale: null,
            store_id: 1,
            store_name: 'Amazon',
            store_logo: null,
            store_type: 'online',
            product_rating: '5.0000',
            product_rating_count: 1,
            views_today: 0,
          },
          {
            product_id: 60,
            product_title: 'Get Ready - EDT - For Men - 100ml',
            product_title_ar: 'Get Ready - EDT - For Men - 100ml',
            product_brand: 'Adidas',
            product_price: 118.98999786376952,
            image_url:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/91/1927/1.jpg?0156',
            product_sale: null,
            store_id: 2,
            store_name: 'Jumia',
            store_logo: null,
            store_type: 'online',
            product_rating: '5.0000',
            product_rating_count: 1,
            views_today: 0,
          },
          {
            product_id: 108,
            product_title: 'Beauty - EDP - For Women - 100 ML',
            product_title_ar: 'Beauty - EDP - For Women - 100 ML',
            product_brand: 'Calvin Klein',
            product_price: 635,
            image_url:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/06/494332/1.jpg?6916',
            product_sale: null,
            store_id: 2,
            store_name: 'Jumia',
            store_logo: null,
            store_type: 'online',
            product_rating: '3.0000',
            product_rating_count: 1,
            views_today: 0,
          },
          {
            product_id: 329,
            product_title: 'L.12.12 Blanc Pure - For Men - EDT - 100ml',
            product_title_ar: 'L.12.12 Blanc Pure - For Men - EDT - 100ml',
            product_brand: 'Lacoste',
            product_price: 955,
            image_url:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/23/306942/1.jpg?5669',
            product_sale: null,
            store_id: 2,
            store_name: 'Jumia',
            store_logo: null,
            store_type: 'online',
            product_rating: '4.0000',
            product_rating_count: 1,
            views_today: 0,
          },
          {
            product_id: 12,
            product_title:
              'Heat Shrink Tube For Protect And Repair Cables - 5 - 6 - 8 - 10 - 12 Mm Inner Diameter - 20 Pieces',
            product_title_ar:
              'Heat Shrink Tube For Protect And Repair Cables - 5 - 6 - 8 - 10 - 12 Mm Inner Diameter - 20 Pieces',
            product_brand: 'Generic',
            product_price: 50.150001525878906,
            image_url:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/21/98738/1.jpg?2965',
            product_sale: null,
            store_id: 2,
            store_name: 'Jumia',
            store_logo: null,
            store_type: 'online',
            product_rating: '5.0000',
            product_rating_count: 1,
            views_today: 0,
          },
          {
            product_id: 50,
            product_title: 'iPhone XR 128GB Black',
            product_title_ar: 'ايفون اكس ار 128 جيجابايت اسود',
            product_brand: 'apple',
            product_price: 14000,
            image_url:
              'https://images-na.ssl-images-amazon.com/images/I/51VK75IxvAL.__AC_SX300_SY300_QL70_ML2_.jpg',
            product_sale: null,
            store_id: 1,
            store_name: 'Amazon',
            store_logo: null,
            store_type: 'online',
            product_rating: '2.0000',
            product_rating_count: 1,
            views_today: 0,
          },
          {
            product_id: 90,
            product_title:
              'Puffer Jacket For Men To Complement Your Charm - Black',
            product_title_ar:
              'Puffer Jacket For Men To Complement Your Charm - Black',
            product_brand: 'Generic',
            product_price: 216.80999755859372,
            image_url:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/84/226932/1.jpg?0427',
            product_sale: null,
            store_id: 2,
            store_name: 'Jumia',
            store_logo: null,
            store_type: 'online',
            product_rating: '5.0000',
            product_rating_count: 1,
            views_today: 0,
          },
          {
            product_id: 122,
            product_title: 'Ck Be - EDT - Unisex - 100ml',
            product_title_ar: 'Ck Be - EDT - Unisex - 100ml',
            product_brand: 'Calvin Klein',
            product_price: 490,
            image_url:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/11/086991/1.jpg?0507',
            product_sale: null,
            store_id: 2,
            store_name: 'Jumia',
            store_logo: null,
            store_type: 'online',
            product_rating: '4.0000',
            product_rating_count: 1,
            views_today: 0,
          },
        ],
      },
      FavouriteProducts: {
        name: 'Recommended  Top Products',
        in: 'body',
        description: 'The Array of Recommended  Top Products',
        type: 'array',
        example: [
          {
            id: 117,
            title: 'Euphoria Intense - For Men - EDT -  100 Ml',
            price: 825,
            image:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/40/3865/1.jpg?4012',
            rating: '2.0000',
            rating_count: 1,
            store_id: 2,
            store_name: 'Jumia',
            store_type: 'online',
            logo: null,
            favourite_date: '2022-04-30T11:10:06.000Z',
          },
          {
            id: 1,
            title: 'IPhone 13 Single SIM With FaceTime - 128GB - Starlight',
            price: 17400,
            image:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/04/690352/1.jpg?0605',
            rating: '2.0000',
            rating_count: 1,
            store_id: 2,
            store_name: 'Jumia',
            store_type: 'online',
            logo: null,
            favourite_date: '2022-04-30T10:45:25.000Z',
          },
          {
            id: 111,
            title: 'Beauty - EDP - For Women - 100 Ml',
            price: 634.989990234375,
            image:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/91/230401/1.jpg?9218',
            rating: '1.0000',
            rating_count: 1,
            store_id: 2,
            store_name: 'Jumia',
            store_type: 'online',
            logo: null,
            favourite_date: null,
          },
          {
            id: 103,
            title: 'Bomber Men Jacket -black',
            price: 120,
            image:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/38/502052/1.jpg?9067',
            rating: '4.0000',
            rating_count: 1,
            store_id: 2,
            store_name: 'Jumia',
            store_type: 'online',
            logo: null,
            favourite_date: null,
          },
          {
            id: 102,
            title: 'Jacquard Bomber Jacket - Turquoise',
            price: 425,
            image:
              'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/79/572742/1.jpg?4012',
            rating: '5.0000',
            rating_count: 1,
            store_id: 2,
            store_name: 'Jumia',
            store_type: 'online',
            logo: null,
            favourite_date: null,
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
