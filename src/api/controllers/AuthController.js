const AuthService = require('../services/AuthService');

class Controller {
  async signup(req, res, next) {
    try {
      console.log(req.body);

      const createdUser = await AuthService.signup(req.body);

      console.log('createdUser: ', createdUser);

      res.status(201).json({
        status: 'success',
        message: 'Signed Up successfully',
        user: createdUser,
      });
    } catch (error) {
      console.log(error);

      res.status(400).json({
        status: 'Fail',
        message: 'Sign Up Failed',
      });
    }
  }

  async signin(req, res, next) {
    console.log(req.body);

    res.status(200).json({
      status: 'success',
      message: 'Signed In successfully',
    });
  }
}

module.exports = new Controller();
