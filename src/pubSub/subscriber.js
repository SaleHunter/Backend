const IORedis = require('ioredis');
const subscriber = new IORedis({
  maxRetriesPerRequest: null,
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});
const knex = require('../dataStores/knex');

subscriber.subscribe('productViews', (err, count) => {
  if (err) {
    console.error('Failed to subscribe: %s', err.message);
  } else {
    console.log(
      `Subscribed successfully! This client is currently subscribed to ${count} channels.`
    );
  }
});

subscriber.on('message', async (channel, message) => {
  try {
    const { user_id, product_id, viewed_at } = JSON.parse(message);
    console.log(`Received ${message} from ${channel}`);

    const res = await knex('user_product_views').insert({
      viewed_at,
      user_id,
      product_id,
    });
  } catch (error) {}
});
