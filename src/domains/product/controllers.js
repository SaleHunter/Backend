const service = require('./services');

class Controller {
  async searchForProducts(req, res, next) {
    let userId = 0;
    if (req.user) userId = req.user.id;

    const { products, totalProductsNumber, categories, brands } =
      await service.searchForProducts(req.query, req.headers, userId);

    res.status(200).json({
      status: 'success',
      results: products.length,
      totalProductsNumber,
      products,
      categories,
      brands,
    });
  }

  async getProductById(req, res, next) {
    const productId = req.params.id;
    let userId = 0;
    if (req.user) userId = req.user.id;
    const product = await service.getProductById(productId, userId);
    res.status(200).json({
      status: 'success',
      product,
    });
  }

  async recommendProductsForUser(req, res, next) {
    const canRecommend = req.authenticated;
    let products = [];
    if (canRecommend)
      products = await service.getRecommendedProductsByUserId(req.user.id);
    else products = await service.getTopProducts();

    res.status(200).json({
      status: 'success',
      Authenticated: canRecommend,
      results: products.length,
      products,
    });
  }

  async getFavouriteProductsForUser(req, res, next) {
    const userId = req.user.id;

    let products = [];

    products = await service.getFavouriteProductsForUser(userId);

    res.status(200).json({
      status: 'success',
      results: products.length,
      products,
    });
  }

  async addProductToFavourites(req, res, next) {
    const userId = req.user.id,
      productId = req.params.productId;

    await service.addProductToFavourites(userId, productId);

    return res.status(201).json({
      status: 'success',
      message: 'Product successfully added to your Favourites',
    });
  }

  async removeProductFromFavourites(req, res, next) {
    const userId = req.user.id,
      productId = req.params.productId;

    console.log('HERERERERERER', userId, productId);

    await service.removeProductFromFavourites(userId, productId);

    return res.status(204).json();
  }

  async getViewedProductsForUser(req, res, next) {
    const userId = req.user.id;

    const products = await service.getViewedProductsForUser(userId);
    res.status(200).json({
      status: 'success',
      results: products.length,
      products,
    });
  }

  async changeProductRating(req, res, next) {
    const userId = req.user.id,
      productId = req.params.productId,
      rating = req.body.rating;

    await service.changeProductRating(userId, productId, rating);

    res.status(200).json({
      status: 'success',
      message: 'Rating successfully changed for this product',
    });
  }

  async getProductsOnSale(req, res, next) {
    let userId = 0;
    if (req.user) userId = req.user.id;
    const products = await service.getProductsOnSale(userId);

    res.status(200).json({
      status: 'success',
      results: products.length,
      products,
    });
  }

  async createProduct(req, res, next) {
    const product = await service.createProduct(
      req.query.storeId * 1,
      req.body
    );

    res.status(201).json({
      status: 'success',
      message: 'Product successfully created',
      product,
    });
  }

  async deleteProductById(req, res, next) {
    const product_id = req.params.productId * 1;
    const store_id = req.query.storeId * 1;
    await service.deleteProductById(store_id, product_id);

    res.status(204).json({
      status: 'success',
      message: 'Product successfully deleted',
    });
  }

  async updateProductById(req, res, next) {
    const product_id = req.params.productId * 1,
      store_id = req.query.storeId * 1,
      new_values = req.body;

    await service.updateProductById(store_id, product_id, new_values);

    res.status(200).json({
      status: 'success',
      message: 'Product successfully updated',
    });
  }
}
module.exports = new Controller();
