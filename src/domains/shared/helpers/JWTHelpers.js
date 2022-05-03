const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { UnAuthorizedError } = require('../errors/AuthError');

class Helper {
  extractJWT(req) {
    let authorizationHeader = req.headers.authorization;
    // console.log('authorizationHeader: ', authorizationHeader);
    let token;

    if (authorizationHeader && authorizationHeader.startsWith('Bearer')) {
      token = authorizationHeader.split(' ')[1];
      return token;
    } else if (req.cookies.Authorization) {
      token = req.cookies.Authorization;
      return token;
    }

    return '';
  }

  async restoreFromJWT(jwToken) {
    const jwtVerify = promisify(jwt.verify);

    return await jwtVerify(
      jwToken,
      'JUST-an-dummy-SECRET-jwt-for-SaleHunter-project'
    ).catch(err => {
      throw new UnAuthorizedError();
    });
  }
}

module.exports = Helper;
