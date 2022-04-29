const { Queue, Worker, QueueScheduler } = require('bullmq');
const connection = require('../dataStores/redis');
const axios = require('axios');

const mlQueue = new Queue('ML', { connection });
const mlQueueScheduler = new QueueScheduler('ML', { connection });

mlQueue
  .add(
    'ping',
    {
      url: `https://recommenderengine20211014165927.azurewebsites.net/api/Ping`,
    },
    {
      repeat: { every: 960000 },
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

mlQueue
  .add(
    'train',
    {
      url: `https://recommenderengine20211014165927.azurewebsites.net/api/Train`,
    },
    {
      repeat: { every: 432000000 },
      removeOnComplete: true,
      maxRetriesPerRequest: null,
    }
  )
  .then(job => console.log('Train Job added successfully to ML Queue'))
  .catch(err => console.log('Error adding Train job to ML Queue', err));

async function handleTrain(job) {
  try {
    console.log(job.id);
    const url = job.data.url;
    console.log(`Job: ${url} is currently working`);

    const getDataSet = require('../domains/shared/services/ML');

    const dataSet = await getDataSet();

    const response = await axios({
      method: 'POST',
      url,
      data: dataSet,
    });

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
      // if (job.name === 'train') return await handleTrain(job);
    } catch (error) {
      console.log('Error', error);
    }
  },
  { connection }
);
