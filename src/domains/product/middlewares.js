exports.prepareQueryObj = (req, res, next) => {
  req.query = Object.fromEntries(new URLSearchParams(req.query));
  req.query.lan = req.headers.lon;
  req.query.lat = req.headers.lat;
  req.query.language = req.headers.language;
  next();
};

exports.isAuthenticatedWithOutException = async function (req, res, next) {
  const jwt = extractJWT(req);
  if (jwt === '') {
    req.authenticated = false;
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
  req.authenticated = true;

  next();
};
