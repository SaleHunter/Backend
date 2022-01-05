const { Router } = require('express');
const AuthController = require('../controllers/AuthController.js');

const router = Router();

//Normal Authentication Routes

/*
 * 1- Normal sign up route
 * Requires:
 * 1- fullname
 * 2- email
 * 3- password
 * 4- profile_img (optional)
 */
router.post('/signup', AuthController.signup);

/*
 * 2- Normal sign in route
 * Requires:
 * 1- user_name || email
 * 2- password
 */
router.post('/signin', AuthController.signin);

module.exports = router;
