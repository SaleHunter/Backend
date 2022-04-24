const { getUserby } = require('../../user/api');
const JWTHelper = require('../helpers/JWTHelpers');
const { UnAuthorizedError } = require('../errors/AuthError');

const { extractJWT, restoreFromJWT } = new JWTHelper();

exports.isAuthenticated = async (req, res, next) => {
  //Extract the token fro Authorization header or cookie
  const jwt = extractJWT(req);

  if (jwt === '') throw new UnAuthorizedError();

  //Decode the jwt token if valid and extract user's id
  const { id } = await restoreFromJWT(jwt);
  console.log(id);

  //Get The user's info from the Database
  const user = await getUserby('id', id);

  //Exclude user's password from the request
  delete user.password;

  req.user = user;

  next();
};

exports.canRecommend = async function (req, res, next) {
  const jwt = extractJWT(req);
  if (jwt === '') {
    req.canRecommend = false;
    return next();
  }

  //Decode the jwt token if valid and extract user's id
  const { id } = await restoreFromJWT(jwt);
  console.log(id);

  //Get The user's info from the Database
  const user = await getUserby('id', id);

  //Exclude user's password from the request
  delete user.password;

  req.user = user;
  req.canRecommend = true;

  next();
};
