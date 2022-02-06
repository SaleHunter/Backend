const { Router } = require('express');
const AuthController = require('../controllers/AuthController.js');
const authSchemas = require('../validations/authSchemas.js');
const router = Router();

//Middlwares
const validate = require('../middlewares/validation.js');

//Swagger Tags
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Auth endpoints
 */

//Swagger Schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       required:
 *         - fullname
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated UUID id of the user
 *           format: uuid
 *         fullname:
 *           type: string
 *           description: The full name of the user
 *         password:
 *           type: string
 *           description: The full name of the user
 *           format: password
 *         email:
 *           type: string
 *           description: The email address of the user
 *           format: email
 *         profile_img:
 *           type: string
 *           description: The email address of the user
 *           format: cloudinary_public_id
 *         token:
 *           type: string
 *           description: The password reset token for the user
 *         token_expire:
 *           type: string
 *           description: The password reset token expiration time for the user
 *           format: date-time
 *       example:
 *         id: 9081a368-fa3d-4463-ae8d-69c16130d166
 *         fullname: John Smith
 *         email: john_smith@gmail.com
 *         password: pass123456
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       '201':
 *         description: Signed Up successfully
 *       '400':
 *         description: Failed to sign up
 */
router.post(
  '/signup',
  validate(authSchemas.signup, 'body'),
  AuthController.signup
);

/**
 * @swagger
 * /api/v1/auth/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       '200':
 *         description: Signed in successfully
 *       '404':
 *         description: Failed to sign in, there is no user with that email
 *       '400':
 *         description: Incorrect password
 */
router.post('/signin', AuthController.signin);

router.post('/signinAuth', AuthController.thirdPartyAuth);

router.post('/forgetPassword', AuthController.forgetPassword);
router.patch('/resetPassword/:resetToken', AuthController.resetPassword);

module.exports = router;
