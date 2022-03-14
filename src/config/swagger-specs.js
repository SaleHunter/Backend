const userPaths = require('../domains/user/swagger-docs');
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
      url: 'http://localhost:4000/api/v1',
      description: 'Development Server',
    },
  ],
  tags: [
    {
      name: 'Users',
      description: 'Users endpoints',
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
    '/users/auth/forgetPassword': {
      post: userPaths.forgetPassword,
    },
    '/users/auth/verifyResetToken/{resetToken}': {
      post: userPaths.verifyResetToken,
    },
    '/users/auth/resetPassword/{resetToken}': {
      patch: userPaths.resetPassword,
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
            description: 'The profile image url of the user',
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
            'https://res.cloudinary.com/demo/image/upload/w_abc/sample.jpg',
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
