class Controller {
  async search(req, res, next) {
    console.log(req.query);
    res.status(200).json({
      status: 'success',
      products: [],
    });
  }
}
module.exports = new Controller();
