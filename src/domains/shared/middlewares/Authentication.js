const { getUserby } = require('../../user/api');
const { getStoreIdByUser } = require('../../store/api');
const JWTHelper = require('../helpers/JWTHelpers');
const { UnAuthorizedError, ForbiddenError } = require('../errors/AuthError');

const { extractJWT, restoreFromJWT } = new JWTHelper();

exports.isAuthenticated = async (req, res, next) => {
  //Extract the token fro Authorization header or cookie
  const jwt = extractJWT(req);

  if (jwt === '') throw new UnAuthorizedError();

  console.log('I am Here');

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

exports.isAuthenticatedWithOutException = async function (req, res, next) {
  const jwt = extractJWT(req);
  console.log(jwt);
  if (jwt === '') {
    console.log('JWT not found');
    req.authenticated = false;
    return next();
  }

  //Decode the jwt token if valid and extract user's id
  const { id } = await restoreFromJWT(jwt).catch(err => next());
  console.log(id);

  //Get The user's info from the Database
  const user = await getUserby('id', id);

  //Exclude user's password from the request
  delete user.password;

  req.user = user;
  req.authenticated = true;

  next();
};

// get store_id from the request
exports.isOwningTheStore = async (req, res, next) => {
  // extract jwt
  const jwt = extractJWT(req);
  // extract store_id from user
  const { id } = await restoreFromJWT(jwt);

  const userStoreId = await getStoreIdByUser(id);

  console.log(userStoreId);
  if (userStoreId != req.params.storeId) throw new ForbiddenError();
  next();
};
