const { Router } = require('express');
const AuthController = require('../controllers/AuthController.js');
const authSchemas = require('../validations/authSchemas.js');
const router = Router();

//Middlwares
const validate = require('../middlewares/validation.js');

//Normal Authentication Routes
/*
 * 1- Normal sign up route
 * Requires:
 * 1- fullname
 * 2- email
 * 3- password
 * 4- profile_img (optional)
 */
router.post(
  '/signup',
  validate(authSchemas.signup, 'body'),
  AuthController.signup
);
/*
 * 2- Normal sign in route
 * Requires:
 * 1- email
 * 2- password
 */
router.post('/signin', AuthController.signin);

router.post('/signinAuth', AuthController.thirdPartyAuth);

/*
 * Forget password route
 * Requires:
 *   1- email
 */
router.post('/forgetPassword', AuthController.forgetPassword);
router.patch('/resetPassword/:resetToken', AuthController.resetPassword);

module.exports = router;
