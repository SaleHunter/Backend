const AuthService = require('../services/AuthService');

class Controller {
  async signup(req, res, next) {
    try {
      console.log(req.body);

      const { createdUser, token } = await AuthService.signup(req.body);
      console.log({ createdUser, token });

      res.status(201).json({
        status: 'success',
        message: 'Signed Up successfully',
        user: createdUser[0],
        token,
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
    try {
      console.log(req.body);

      const { user, token } = await AuthService.signin(req.body);

      res.status(200).json({
        status: 'success',
        message: 'Signed In successfully',
        user: user[0],
        token: token,
      });
    } catch (error) {
      // console.log(error);
      res.status(400).json({
        status: 'Fail',
        message: 'Sign In Failed',
        error,
      });
    }
  }
}

module.exports = new Controller();
