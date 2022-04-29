exports.prepareQueryObj = (req, res, next) => {
  req.query = Object.fromEntries(new URLSearchParams(req.query));
  req.query.lan = req.headers.lon;
  req.query.lat = req.headers.lat;
  req.query.language = req.headers.language;
  next();
};

