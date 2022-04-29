const IORedis = require('ioredis');

const redis = new IORedis({
  maxRetriesPerRequest: null,
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});

module.exports = redis;
