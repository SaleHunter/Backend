const IORedis = require('ioredis');
const publisher = new IORedis({
  maxRetriesPerRequest: null,
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});

class Publisher {
  constructor() {
    this.publisher = publisher;
  }

  publishProductView(productId, userId) {
    const view = {
      product_id: productId,
      user_id: userId,
      viewed_at: new Date(),
    };
    this.publisher.publish('productViews', JSON.stringify(view));
  }
}

module.exports = new Publisher();
