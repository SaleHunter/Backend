const { compareSync } = require('bcrypt');
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

      const user = await AuthService.signin(req.body);

      res.status(200).json({
        status: 'success',
        message: 'Signed In successfully',
        user: user[0],
        token: req.body.token,
      });
    } catch (error) {
      next(error);
    }
  }

  async thirdPartyAuth(req, res, next) {
    try {
      const user = await AuthService.socialAuth(req.body);
      console.log(user[0]);
      res.status(200).json({
        status: 'sucess',
        message: 'Signed in Successfully',
        user: user[0],
        token: req.body.token,
      });
    } catch (error) {
      res.status(400).json({
        status: 'Fail',
        message: 'Third-Party auth failed',
      });
    }
  }

  async forgetPassword(req, res, next) {
    try {
      await AuthService.forgetPassword(req.body);

      res.status(200).json({
        status: 'success',
        message:
          'Password reset token has successfully sent to your email address.',
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      await AuthService.resetPassword(req.params.resetToken, req.body);

      res.status(200).json({
        status: 'success',
        message:
          'Your password reset has successfully reseted. You can now login with your new password',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Controller();
