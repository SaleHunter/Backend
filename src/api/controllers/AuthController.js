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
      next(error);
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
      next(error);
    }
  }
}

module.exports = new Controller();
