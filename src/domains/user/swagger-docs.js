module.exports = {
  getAuthenticatedUser: {
    tags: ['Users'],
    description: 'Returns the Info of the authenticated user',
    security: {
      bearerAuth: [],
      cookieAuth: [],
    },
    responses: {
      200: {
        description: "User's info found successfully",
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'success',
                  type: 'string',
                  example: 'success',
                },
                user: {
                  description: "User's Object",
                  type: 'object',
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
        },
      },
      401: {
        description: 'Un Authorized User Error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UnAuthorizedError',
            },
          },
        },
      },
    },
  },
  updateAuthenticatedUser: {
    tags: ['Users'],
    description: 'Updates Info of the authenticated user',
    security: {
      bearerAuth: [],
      cookieAuth: [],
    },
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              fullname: {
                description: 'The new Full name of the user',
                type: 'string',
              },
              email: {
                description: 'The new Email of the user',
                type: 'string',
                format: 'email',
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "User's info Updated Successfully",
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'success',
                  type: 'string',
                  example: 'success',
                },
                message: {
                  description: 'User updated successfully',
                  type: 'string',
                  example: 'User updated successfully',
                },
                user: {
                  description: "User's Object after update",
                  type: 'object',
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
        },
      },
      401: {
        description: 'Un Authorized User Error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UnAuthorizedError',
            },
          },
        },
      },
    },
  },
  updateAuthenticatedUserPassword: {
    tags: ['Users'],
    description: 'Updates the password of the authenticated user',
    security: {
      bearerAuth: [],
      cookieAuth: [],
    },
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              password: {
                description: 'The new password of the user',
                type: 'string',
                format: 'password',
                example: '*********',
              },
              passwordConfirm: {
                description: 'The new password confirm of the user',
                type: 'string',
                format: 'password',
                example: '*********',
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "User's Password Updated Successfully",
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  description: 'success',
                  type: 'string',
                  example: 'success',
                },
                message: {
                  description: 'Password updated successfully',
                  type: 'string',
                  example: 'Password updated successfully',
                },
                user: {
                  description: "User's Object after password update",
                  type: 'object',
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
        },
      },
      401: {
        description: 'Un Authorized User Error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UnAuthorizedError',
            },
          },
        },
      },
    },
  },
  signin: {
    tags: ['Users'],
    description: 'sign in user',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                description: 'Email of the user',
                type: 'string',
                format: 'email',
                required: true,
              },
              password: {
                description: 'Password of the user',
                type: 'string',
                format: 'password',
                required: true,
              },
            },
            example: {
              email: 'willsmith@gmail.com',
              password: '**********',
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'User signed in successfully',
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
                  example: 'Signed In successfully',
                },
                user: {
                  description: "User's Object",
                  type: 'object',
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
        },
      },
      404: {
        description: 'No user found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/NotFoundError',
            },
          },
        },
      },
      401: {
        description: 'Incorrect password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/IncorrectPasswordError',
            },
          },
        },
      },
      400: {
        description: 'Validation Error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ValidationError',
            },
          },
        },
      },
    },
  },
  signup: {
    tags: ['Users'],
    description: 'sign in user',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/SignUp',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User signed up successfully',
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
                  example: 'Signed Up successfully',
                },
                user: {
                  description: "User's Object",
                  type: 'object',
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
        },
      },
      400: {
        description: 'Validation Error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ValidationError',
            },
          },
        },
      },
    },
  },
  forgetPassword: {
    tags: ['Users'],
    description:
      'Forget Password, Request for getting reset token to given email',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                description: 'The email of the user',
                type: 'string',
                format: 'email',
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Reset Token sent to given email successfully',
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
                  example: 'Reset Token sent to given email successfully',
                },
              },
            },
          },
        },
      },
      404: {
        description: 'No user found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/NotFoundError',
            },
          },
        },
      },
    },
  },
  verifyResetToken: {
    tags: ['Users'],
    description: 'Verify Reset Token, check if reset token is valid or not',
    parameters: [
      {
        name: 'resetToken',
        in: 'path',
        description: 'The password reset token',
        required: true,
      },
    ],
    responses: {
      200: {
        description: 'Reset Token is valid',
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
                  example: 'Reset Token is valid',
                },
              },
            },
          },
        },
      },
      404: {
        description: 'Invalid Reset Token',
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
                  example:
                    'Invalid Reset Token, Please try again with the correct one',
                },
              },
            },
          },
        },
      },
      400: {
        description: 'Reset Token Expired',
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
                  example: 'Expired Reset Token, Please request another one',
                },
              },
            },
          },
        },
      },
    },
  },
  resetPassword: {
    tags: ['Users'],
    description: 'Reset password',
    parameters: [
      {
        name: 'resetToken',
        in: 'path',
        description: 'The password reset token',
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
              password: {
                description: 'The new password of the user',
                type: 'string',
                format: 'password',
                example: '*********',
              },
              passwordConfirm: {
                description: 'The new password confirm of the user',
                type: 'string',
                format: 'password',
                example: '*********',
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Password Reseted Successfully',
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
                  example: 'Password Reseted Successfully',
                },
              },
            },
          },
        },
      },
      404: {
        description: 'Invalid Reset Token',
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
                  example:
                    'Invalid Reset Token, Please try again with the correct one',
                },
              },
            },
          },
        },
      },
      400: {
        description: 'Reset Token Expired',
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
                  example: 'Expired Reset Token, Please request another one',
                },
              },
            },
          },
        },
      },
    },
  },
};
