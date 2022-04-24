const { Queue, Worker, QueueScheduler } = require('bullmq');
const connection = require('../../dataStores/redis');

// const mlQueue = new Queue('ML', { connection });

// TODO: Create MLQueue and connect to redis

// TODO: Add ML Recommendation Ping Job to MLQueue

// TODO: Add ML Recommendation Predict Job to MLQueue

module.exports = Worker;
