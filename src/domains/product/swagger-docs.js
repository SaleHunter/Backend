module.exports = {
  searchForProducts: {
    tags: ['Products'],
    description: 'Search for products',
    parameters: [
      {
        name: 'searchText',
        in: 'query',
        description: 'The Search Query for Products',
        required: true,
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
        name: 'page',
        in: 'query',
        description: 'The Page Number',
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
        name: 'lon',
        in: 'header',
        description: 'The longitude of The User',
        required: false,
        schema: {
          type: 'number',
        },
      },
      {
        name: 'lat',
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
                      product_title_ar:
                        'موبايل ايفون 13 Pro Max، 256 جيجابايت، ازرق سييرا',
                      product_brand: 'apple',
                      product_category: 'Electronics',
                      product_category_ar: 'إلكترونيات',
                      product_url:
                        'https://www.amazon.eg/dp/B09G9CD8PS?language=en_AE',
                      image_url:
                        'https://images-na.ssl-images-amazon.com/images/I/61i8Vjb17SL.__AC_SX300_SY300_QL70_ML2_.jpg',
                      store_id: 1,
                      store_name: 'Amazon',
                      store_logo: null,
                      store_type: 'online',
                    },
                    {
                      product_id: 7,
                      product_title:
                        'Apple MacBook Pro Late 2020 MYD82 Model With Touch Bar And Touch ID',
                      product_title_ar:
                        'ابل ماك بوك برو اصدار اواخر 2020 MYD82 مع شريط لمس وخاصية تاتش اي دي',
                      product_brand: 'apple',
                      product_category: 'Electronics',
                      product_category_ar: 'إلكترونيات',
                      product_url:
                        'https://www.amazon.eg/dp/B08N5WRTN2?language=en_AE',
                      image_url:
                        'https://images-na.ssl-images-amazon.com/images/I/71an9eiBxpL.__AC_SX300_SY300_QL70_ML2_.jpg',
                      store_id: 1,
                      store_name: 'Amazon',
                      store_logo: null,
                      store_type: 'online',
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
};
