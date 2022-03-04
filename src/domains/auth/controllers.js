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
   * @method Service for handling user's forget password request
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
}

module.exports = new Controller();
