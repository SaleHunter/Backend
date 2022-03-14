const service = require('./services');
const helper = require('./helpers');

/**
 * @class
 * @classdesc Class for Users Requset Controllers
 */
class Controller {
  /**
   * @name POST/signin
   * @method Controller for handling user's signin request
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

    //Set the jwt header
    res.header('JWT', jwToken);
    res.header('Access-Control-Expose-Headers', 'JWT');

    // //Set the jwt cookie
    // helper.setJWTCookie(jwToken, res);
    res.cookie('JWT', jwToken, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // expires in 90 days
    });

    res.status(200).json({
      status: 'success',
      message: 'Signed In successfully',
      user,
    });
  }

  /**
   * @name POST/forgetPassword
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
   * @name GET/verifyResetToken
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
   * @name PATCH/resetPassword
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
      phone_number: req.body.phone_number,
      thirdPartyID: req.body.thirdPartyID,
    };

    const { user, jwToken } = await service.signup(signupPayload);

    //Set the jwt header
    helper.setJWTHeader(jwToken, res);

    // //Set the jwt cookie
    helper.setJWTCookie(jwToken, res);

    res.status(201).json({
      status: 'success',
      message: 'Signed up successfully',
      user,
    });
  }

  /**
   * @name GET /
   * @method Controller handling get user by id request
   * @access public
   * @async
   * @param {callback} middleware - Express middleware.
   */
  async getUser(req, res, next) {
    const id = req.user.id;

    const user = await service.getUser(id);
    res.status(200).json({
      status: 'success',
      user,
    });
  }

  /**
   * @name PATCH /
   * @method Controller handling update user by id request
   * @access public
   * @async
   * @param {callback} middleware - Express middleware.
   */
  async updateUser(req, res, next) {
    const updateUserPayload = {
      id: req.user.id,
      fullname: req.body.fullname,
      email: req.body.email,
    };

    const user = await service.updateUser(updateUserPayload);
    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      user,
    });
  }

  /**
   * @name PATCH /updatePassword
   * @method Controller handling update user's password by id request
   * @access public
   * @async
   * @param {callback} middleware - Express middleware.
   */
  async updatePassword(req, res, next) {
    const updatePasswordPayload = {
      id: req.user.id,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
    };

    const user = await service.updatePassword(updatePasswordPayload);

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
      user,
    });
  }
  async googleAuth(req, accessToken, refreshToken, profile, done) {
    let googlePayload = {
      fullname: profile._json.name,
      email: profile._json.email,
      profile_img: profile._json.picture,
      thirdParty_id: 'g-' + profile._json.sub,
      phone_number: profile._json.phone_number,
    };
    let { jwToken } = await service.thirdPartyAuth(googlePayload);

    return done(null, jwToken);
  }
  async facebookAuth(req, accessToken, refreshToken, profile, done) {
    console.log(profile);
    let googlePayload = {
      fullname: profile._json.name,
      email: profile._json.email,
      profile_img: profile._json.picture,
      thirdParty_id: 'fb-' + profile._json.id,
      phone_number: profile._json.phone_number || '',
    };
    let { jwToken } = await service.thirdPartyAuth(googlePayload);

    return done(null, jwToken);
  }
}

module.exports = new Controller();
