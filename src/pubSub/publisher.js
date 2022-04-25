const IORedis = require('ioredis');
const publisher = new IORedis({ maxRetriesPerRequest: null });

class Publisher {
  constructor() {
    this.publisher = publisher;
  }

  publishProductView(productId, userId) {
    const view = {
      product_id: productId,
      user_id: userId,
      viewed_at: Date.now(),
    };
    this.publisher.publish('productViews', JSON.stringify(view));
  }
}

module.exports = new Publisher();
