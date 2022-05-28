module.exports = {
  searchForProducts: {
    tags: ['Products'],
    description: 'Search for products',
    parameters: [
      {
        name: 'searchText',
        in: 'query',
        description: 'The Search Query for Products',
        type: 'string',
      },
      {
        name: 'price_min',
        in: 'query',
        description:
          'Get elements that price greater than or equal to price_min',
        required: false,
        type: 'number',
        default: 0,
      },
      {
        name: 'price_max',
        in: 'query',
        description: 'Get elements that price less than or equal to price_max',
        required: false,
        type: 'number',
        default: 1e9,
      },
      {
        name: 'category',
        in: 'query',
        description: 'Get elements that category equal to category value',
        required: false,
        type: 'string',
        default: 'all',
      },
      {
        name: 'brand',
        in: 'query',
        description: 'Get elements that brand equal to brand value',
        required: false,
        type: 'string',
        default: 'all',
      },
      {
        name: 'store_type',
        in: 'query',
        description: 'Get elements that store_type equal to store_type value',
        required: false,
        type: 'string',
        default: 'all',
      },
      {
        name: 'sort',
        in: 'query',
        description: 'Sort elements by specific attribute',
        required: false,
        schema: {
          type: 'string',
          enum: [
            'priceAsc',
            'priceDsc',
            'popular',
            'rating',
            'nearest_store',
            'best_deal',
            'newest',
            'oldest',
          ],
          default: 'popular',
        },
      },
      {
        name: 'cursor',
        in: 'query',
        description: 'The id of last element in prev page',
        required: false,
        schema: {
          type: 'number',
        },
        default: 0,
      },
      {
        name: 'limit',
        in: 'query',
        description: 'The Number of products per page',
        required: false,
        schema: {
          type: 'number',
        },
        default: 20,
      },
      {
        name: 'cursorDirection',
        in: 'query',
        required: false,
        schema: {
          type: 'string',
          enum: ['previous', 'next'],
        },
        default: 'next',
      },
      {
        name: 'language',
        in: 'header',
        description: 'The Language of the products',
        required: false,
        schema: {
          type: 'string',
          enum: ['en', 'ar'],
        },
        default: 'en',
      },
      {
        name: 'longitude',
        in: 'header',
        description: 'The longitude of The User',
        required: false,
        schema: {
          type: 'number',
        },
      },
      {
        name: 'latitude',
        in: 'header',
        description: 'The latitude of The User',
        required: false,
        schema: {
          type: 'number',
        },
      },
    ],
    responses: {
      200: {
        description: 'Products Matched The Search',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'The response status message',
                  type: 'string',
                  example: 'success',
                },
                results: {
                  description: 'The number of products returned',
                  type: 'number',
                  example: 2,
                },
                products: {
                  description: 'The Array of the products returned',
                  type: 'array',
                  items: {
                    type: 'object',
                    $ref: '#/components/schemas/ProductBasicWithStoreInfo',
                  },
                  example: [
                    {
                      product_id: 1,
                      product_title: 'Apple iPhone 13 Pro Max 256GB Blue',
                      product_price: 27646,
                      product_title_ar:
                        'موبايل ايفون 13 Pro Max، 256 جيجابايت، ازرق سييرا',
                      product_brand: 'apple',
                      product_category: 'Electronics',
                      product_category_ar: 'إلكترونيات',
                      product_sale: 10,
                      product_rating: 5,
                      product_rating_count: 22,
                      is_favourite: 1,
                      product_url:
                        'https://www.amazon.eg/dp/B09G9CD8PS?language=en_AE',
                      image_url:
                        'https://images-na.ssl-images-amazon.com/images/I/61i8Vjb17SL.__AC_SX300_SY300_QL70_ML2_.jpg',
                      store_id: 1,
                      store_name: 'Amazon',
                      store_logo:
                        'https://res.cloudinary.com/salehunter101/image/upload/v1652469194/stores-logo/images/amazon_logo_svg_wueyvr.webp',
                      store_type: 'online',
                      store_longitude: null,
                      store_latitude: null,
                    },
                    {
                      product_id: 7,
                      product_title:
                        'Apple MacBook Pro Late 2020 MYD82 Model With Touch Bar And Touch ID',
                      product_price: 404500,
                      product_title_ar:
                        'ابل ماك بوك برو اصدار اواخر 2020 MYD82 مع شريط لمس وخاصية تاتش اي دي',
                      product_brand: 'apple',
                      product_category: 'Electronics',
                      product_category_ar: 'إلكترونيات',
                      product_sale: 20,
                      product_rating: 3.5,
                      product_rating_count: 2,
                      is_favourite: 0,
                      product_url:
                        'https://www.amazon.eg/dp/B08N5WRTN2?language=en_AE',
                      image_url:
                        'https://images-na.ssl-images-amazon.com/images/I/71an9eiBxpL.__AC_SX300_SY300_QL70_ML2_.jpg',
                      store_id: 1,
                      store_name: 'Amazon',
                      store_logo:
                        'https://res.cloudinary.com/salehunter101/image/upload/v1652469194/stores-logo/images/amazon_logo_svg_wueyvr.webp',
                      store_type: 'online',
                      store_longitude: null,
                      store_latitude: null,
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
  getProductById: {
    tags: ['Products'],
    description: 'Get product By Id',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'The product Id',
        required: true,
      },
    ],
    responses: {
      200: {
        description: "Product's Info Returned Successfuly",
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'The response status message',
                  type: 'string',
                  example: 'success',
                },
                product: {
                  description: 'The Detailed Information of the Product',
                  type: 'object',
                  $ref: '#/components/schemas/ProductDetailedInfo',
                },
              },
            },
          },
        },
      },
      404: {
        description: 'No Product Found With This Id',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'The response status message',
                  type: 'string',
                  example: 'Fail',
                },
                message: {
                  description: 'The response message',
                  type: 'string',
                  example: 'Invalid Product Id',
                },
              },
            },
          },
        },
      },
    },
  },
  getRecommendedProducts: {
    tags: ['Products'],
    description:
      'Get Recommended Products if User Authenticated / Top Products If not',
    responses: {
      200: {
        description: 'Recommended / Top Products Returned Successfuly',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'The response status message',
                  type: 'string',
                  example: 'success',
                },
                Authenticated: {
                  description:
                    'If The user Authenticated or not, if authenticated recommended products returned, else top products',
                  type: 'boolean',
                  example: 'true',
                },
                results: {
                  description: 'The number of products returned',
                  type: 'number',
                  example: 10,
                },
                products: {
                  description: 'The Array of Products',
                  type: 'array',
                  $ref: '#/components/schemas/RecommendedProducts',
                },
              },
            },
          },
        },
      },
    },
  },
  getFavouriteProducts: {
    tags: ['Products'],
    description: 'Get All Favourite Products For Authenticated User',
    responses: {
      200: {
        description: 'Favourite Products For Authenticated User',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'The response status message',
                  type: 'string',
                  example: 'success',
                },
                results: {
                  description: 'The number of products returned',
                  type: 'number',
                  example: 5,
                },
                products: {
                  description: 'The Array of Products',
                  type: 'array',
                  $ref: '#/components/schemas/FavouriteProducts',
                },
              },
            },
          },
        },
      },
    },
  },
  addProductToFavourites: {
    tags: ['Products'],
    description: 'Add Product To Favourites',
    responses: {
      201: {
        description: 'Product successfully added to your Favourites',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'The response status message',
                  type: 'string',
                  example: 'success',
                },
                message: {
                  description: 'The response message',
                  type: 'string',
                  example: 'Product successfully added to your Favourites',
                },
              },
            },
          },
        },
      },
      409: {
        description: 'Product is already in your favorites',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'The response status message',
                  type: 'string',
                  example: 'fail',
                },
                message: {
                  description: 'The response message',
                  type: 'string',
                  example: 'Product is already in your favorites',
                },
              },
            },
          },
        },
      },
      401: {
        description: 'User not signed in, Please sign in and try again later',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'The response status message',
                  type: 'string',
                  example: 'fail',
                },
                message: {
                  description: 'The response message',
                  type: 'string',
                  example:
                    'User not signed in, Please sign in and try again later',
                },
              },
            },
          },
        },
      },
      404: {
        description: 'There is no product found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'The response status message',
                  type: 'string',
                  example: 'fail',
                },
                message: {
                  description: 'The response message',
                  type: 'string',
                  example: 'There is no product found',
                },
              },
            },
          },
        },
      },
    },
  },
  deleteProductFromFavourites: {
    tags: ['Products'],
    description: 'Delete Product From Favourites',
    responses: {
      204: {
        description: 'Product Deleted successfully from Favourites',
      },
      401: {
        description: 'User not signed in, Please sign in and try again later',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'The response status message',
                  type: 'string',
                  example: 'fail',
                },
                message: {
                  description: 'The response message',
                  type: 'string',
                  example:
                    'User not signed in, Please sign in and try again later',
                },
              },
            },
          },
        },
      },
    },
  },
  getViewedProducts: {
    tags: ['Products'],
    description: 'Get All Viewed Products For Authenticated User',
    responses: {
      200: {
        description: 'Viewed Products For Authenticated User',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'The response status message',
                  type: 'string',
                  example: 'success',
                },
                results: {
                  description: 'The number of products returned',
                  type: 'number',
                  example: 6,
                },
                products: {
                  description: 'The Array of Products',
                  type: 'array',
                  $ref: '#/components/schemas/ViewedProducts',
                },
              },
            },
          },
        },
      },
    },
  },
  changeProductRating: {
    tags: ['Products'],
    description: "Change User's Rating For Product By Id",
    parameters: [
      {
        name: 'product Id',
        in: 'path',
        description: 'The product Id',
        required: true,
      },
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              rating: {
                description: 'The New product rating',
                type: 'integer',
                minimum: 1,
                maximum: 5,
              },
            },
            example: {
              rating: 4,
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Rating successfully changed for this product',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'The response status message',
                  type: 'string',
                  example: 'success',
                },
                message: {
                  description: 'The response message',
                  type: 'string',
                  example: 'Rating successfully changed for this product',
                },
              },
            },
          },
        },
      },
      404: {
        description: 'There is no product Found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'The response status message',
                  type: 'string',
                  example: 'fail',
                },
                message: {
                  description: 'The response message',
                  type: 'string',
                  example: 'There is no product Found',
                },
              },
            },
          },
        },
      },
      401: {
        description: 'User not signed in, Please sign in and try again later',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'The response status message',
                  type: 'string',
                  example: 'fail',
                },
                message: {
                  description: 'The response message',
                  type: 'string',
                  example:
                    'User not signed in, Please sign in and try again later',
                },
              },
            },
          },
        },
      },
    },
  },
  getProductsOnSale: {
    tags: ['Products'],
    description: 'Get Best Products On Sale',
    responses: {
      200: {
        description: 'Best Products On Sale',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'The response status message',
                  type: 'string',
                  example: 'success',
                },
                results: {
                  description: 'The number of products returned',
                  type: 'number',
                  example: 5,
                },
                products: {
                  description: 'The Array of Products',
                  type: 'array',
                  $ref: '#/components/schemas/Sales',
                },
              },
            },
          },
        },
      },
    },
  },
};
