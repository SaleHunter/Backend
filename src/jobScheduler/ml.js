const { Queue, Worker, QueueScheduler } = require('bullmq');
const connection = require('../dataStores/redis');

// TODO: Create MLQueue and connect to redis

// TODO: Add ML Recommendation Ping Job to MLQueue

const mlQueue = new Queue('ML', { connection });
const mlQueueScheduler = new QueueScheduler('ML', { connection });

mlQueue
  .add(
    'ping',
    {
      url: `https://recommenderengine20211014165927.azurewebsites.net/api/Ping`,
    },
    {
      repeat: { every: 960000, limit: 5 },
      removeOnComplete: true,
      maxRetriesPerRequest: null,
    }
  )
  .then(job => console.log('Ping Job added successfully to ML Queue'))
  .catch(err => console.log('Error adding Ping job to ML Queue', err));

async function handlePing(job) {
  try {
    console.log(job.id);
    const url = job.data.url;
    console.log(`Job: ${url} is currently working`);

    const response = await axios.get(url);

    console.log(`Response Data: ${response.data}`);

    return response.data;
  } catch (error) {
    console.log('Error', error);
  }
}

const mlWorker = new Worker(
  'ML',
  async job => {
    try {
      if (job.name === 'ping') return await handlePing(job);
      return await handlePredict(job);
    } catch (error) {
      console.log('Error', error);
    }
  },
  { connection }
);
