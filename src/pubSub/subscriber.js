const IORedis = require('ioredis');
const subscriber = new IORedis({ maxRetriesPerRequest: null });

subscriber.subscribe('productViews', (err, count) => {
  if (err) {
    console.error('Failed to subscribe: %s', err.message);
  } else {
    console.log(
      `Subscribed successfully! This client is currently subscribed to ${count} channels.`
    );
  }
});

subscriber.on('message', (channel, message) => {
  console.log(`Received ${message} from ${channel}`);
});
