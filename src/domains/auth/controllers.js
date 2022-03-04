/**
 * TODO: implement class (Controller methods) for all corresponding routes
 */

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
    //Constructing the sign in payload needed for completing sing in process
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
}

module.exports = new Controller();
