const { ref } = require('joi');
const service = require('./services');

/**
 * @class
 * @classdesc Class for Authentication Requset Controllers
 */
class Controller {
  /**
   * @name post/login
   * @method Service for handling user's signin request
   * @access public
   * @async
   * @param {callback} middleware - Express middleware.
   */
  async signin(req, res, next) {
    //Constructing the sign in payload needed for completing sign in process
    const signinPayload = {
      email: req.body.email,
      password: req.body.password,
    };

    //Calling the sign in Service
    const { user, jwToken } = await service.signin(signinPayload);

    res.status(200).json({
      status: 'success',
      message: 'Signed In successfully',
      user,
      token: jwToken,
    });
  }

  /**
   * @name post/forgetPassword
   * @method Controller for handling user's forget password request
   * @access public
   * @async
   * @param {callback} middleware - Express middleware.
   */
  async forgetPassword(req, res, next) {
    //Constructing the Forget Password payload needed for completing Forget Password process
    const forgetPasswordPayload = {
      email: req.body.email,
    };

    //Check if the request is comming from web or mobile app
    const client = req.header('client') || 'web';

    //Calling the forget password Service
    await service.forgetPassword(forgetPasswordPayload, client);

    res.status(200).json({
      status: 'success',
      message: `Password reset ${
        client === 'mobile' ? 'pin' : 'token'
      } has successfully sent to your email address.`,
    });
  }

  /**
   * @name get/verifyResetToken
   * @method Controller for hanlding user's Verify Reset Token request
   * @access public
   * @async
   * @param {callback} middleware - Express middleware.
   */
  async verifyResetToken(req, res, next) {
    //Constructing the Verify Reset Token payload needed for completing Verify Reset Token process
    console.log(req.params.resetToken);
    const verifyResetTokenPayload = {
      token: req.params.resetToken,
    };

    //Calling the Verify Reset Token Service
    const isMatched = await service.verifyResetToken(verifyResetTokenPayload);

    if (isMatched)
      res.status(200).json({
        status: 'success',
        message: 'Reset Token is valid',
      });
  }

  /**
   * @name patch/resetPassword
   * @method Controller for hanlding user's Reset Password request
   * @access public
   * @async
   * @param {callback} middleware - Express middleware.
   */
  async resetPassword(req, res, next) {
    //Constructing the Reset Password payload needed for completing Reset Password process
    const forgetPasswordPayload = {
      token: req.params.resetToken,
      password: req.body.password,
    };

    //Calling the Reset Password Service
    await service.resetPassword(forgetPasswordPayload);

    res.status(200).json({
      status: 'success',
      message: 'Password Reseted Successfully',
    });
  }
  async signup(req, res, next) {
    const signupPayload = {
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      profile_img: req.body.profile_img,
    };

    const { user, jwToken } = await service.signup(signupPayload);
    res.status(201).json({
      status: 'success',
      message: 'Signed up successfully',
      user,
      token: jwToken,
    });
  }
  async googleAuth(req, accessToken, refreshToken, profile, done) {
    console.log('=======================================');
    console.log('google auth');
    console.log('accessToken: ', accessToken);
    console.log('-------------------------------');
    console.log('refreshToken: ', refreshToken);
    console.log('-------------------------------');
    console.log('profile: ', profile);
    console.log('=======================================');
    return done(null, profile);
  }
}

module.exports = new Controller();
