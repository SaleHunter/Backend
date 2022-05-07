const dotenv = require('dotenv');
const path = require('path');

//Setup Enviroment Variables
dotenv.config({ path: path.join(__dirname, '.env') });

//Connection to Database and Redis Server
const mysql = require('./dataStores/sequelize').authenticateSequelize();
const knex = require('./dataStores/knex');
const redis = require('./dataStores/redis');

//Starting Redis Publisher/Consumer
const pubSub = require('./pubSub/index');

//Starting Job Scheduler
const jobScheduler = require('./jobScheduler/index');

const port = process.env.PORT || 5000;
const app = require('./app.js');

//Start The server
const server = app.listen(port, console.log(`Server running at ${port}`));

//Gloable Handling Uncaught Exeptions
process.on('uncaughtException', err => {
  console.log('Uncaught Exeptions, Server Shutting Down');
  console.log(err);
  //process.exit(1); //Safe Exit
  server.close(() => {});
});

//Gloable Handling unhandled Promise Rejections
process.on('unhandledRejection', err => {
  console.log('Unhandled Promise Rejection, Server Shutting Down');
  console.log(err);
  server.close(() => {}); //Safe Exit
});
