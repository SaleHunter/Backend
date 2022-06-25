module.exports = {
  createStore: {
    tags: ['Stores'],
    description: 'Create a store',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/CreateStore',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Store created successfully',
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
                  example: 'Store created successfully',
                },
                store: {
                  description: "Store's Object",
                  type: 'object',
                  $ref: '#/components/schemas/Store',
                },
              },
            },
          },
        },
      },
      403: {
        description: 'Forbidden, You Already Own a Store',
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
                  example: 'You Already Own a Store',
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
  getStoreById: {
    tags: ['Stores'],
    description: 'Get a store By ID',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'The store Id',
        required: true,
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
        name: 'page',
        in: 'query',
        description: 'Page Number',
        required: false,
        schema: {
          type: 'number',
        },
        default: 1,
      },
    ],
    responses: {
      200: {
        description: 'Store returned successfully',
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
                store: {
                  description: "Store's Object",
                  type: 'object',
                  $ref: '#/components/schemas/Store',
                },
                productsLength: {
                  description: 'Number of products returned from This store',
                  type: 'number',
                  example: 1,
                },
                products: {
                  description: 'The Array of products',
                  type: 'array',
                  example: [
                    {
                      id: 672,
                      title: 'Product Title',
                      title_ar: 'Product Arabic Title',
                      brand: 'Product Brand',
                      category: 'Product Category',
                      category_ar: 'Product Arabic Category',
                      price: 999,
                      image: 'Product Image Url',
                      sale: 750,
                      rating: 3.0,
                      rating_count: 20,
                    },
                  ],
                },
              },
            },
          },
        },
      },
      404: {
        description: 'There is no store with this id',
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
                  example: 'There is no store with this id',
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
  deleteStoreById: {
    tags: ['Stores'],
    description: 'Delete a store By ID',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'The store Id',
        required: true,
      },
    ],
    responses: {
      204: {
        description: 'Store deleted successfully',
      },

      404: {
        description: 'There is no store with this id',
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
                  example: 'There is no store with this id',
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
  updateStoreById: {
    tags: ['Stores'],
    description: 'Update a store by id',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UpdateStore',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Store Updated Successfully',
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
                  example: 'Store Updated Successfully',
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
        description: 'There is no store with this id',
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
                  example: 'There is no store with this id',
                },
              },
            },
          },
        },
      },
    },
  },
  addProductToStore: {
    tags: ['Stores'],
    description: 'Add a product to a store',
    parameters: [
      {
        name: 'storeId',
        in: 'path',
        description: 'The store Id',
        required: true,
      },
    ],

    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Product',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'The product created successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Product',
            },
          },
        },
      },
      403: {
        description: 'Forbidden, You are not Owning the Store',
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
                  example: 'You are not Owning the Store',
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

  deleteProductFromStore: {
    tags: ['Stores'],
    description: 'Delete a product from a store',
    parameters: [
      {
        name: 'storeId',
        in: 'path',
        description: 'The store Id',
        required: true,
      },
      {
        name: 'productId',
        in: 'path',
        description: 'The product Id',
        required: true,
      },
    ],
    responses: {
      204: {
        description: 'Product deleted successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'The response status message',
                  type: 'string',
                  example: 'sucess',
                },
                message: {
                  description: 'The response message',
                  type: 'string',
                  example: 'Product successfully deleted',
                },
              },
            },
          },
        },
      },
      403: {
        description: 'Forbidden, You are not Owning the Store',
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
                  example: 'You are not Owning the Store',
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
  updateProductInStore: {
    tags: ['Stores'],
    description: 'Update a product info in a store',
    parameters: [
      {
        name: 'storeId',
        in: 'path',
        description: 'The store Id',
        required: true,
      },
      {
        name: 'productId',
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
              title: {
                description: 'The title of specific a product',
                type: 'string',
              },
              title_ar: {
                description: 'The arabic title of a specific product',
                type: 'string',
              },
              sale: {
                description: 'The sale on a specific product',
                type: 'number',
              },
              description: {
                description: 'The description of a specific product',
                type: 'string',
              },
              description_ar: {
                description: 'The arabic description of a specific product',
                type: 'string',
              },
              price: {
                description: 'The price of a specific product',
                type: 'number',
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Product updated successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'The response status message',
                  type: 'string',
                  example: 'sucess',
                },
                message: {
                  description: 'The response message',
                  type: 'string',
                  example: 'Product successfully updated',
                },
              },
            },
          },
        },
      },
      403: {
        description: 'Forbidden, You are not Owning the Store',
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
                  example: 'You are not Owning the Store',
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
};
