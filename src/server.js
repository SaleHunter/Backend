const dotenv = require('dotenv');
const path = require('path');

//Setup Enviroment Variables
dotenv.config({ path: path.join(__dirname, '.env') });
const mysql = require('./config/db.js').authenticateSequelize();
const knex = require('./config/knex');

const port = process.env.PORT || 5000;
const app = require('./app.js');

//Start The server
const server = app.listen(port, console.log(`Server running at ${port}`));

//Gloable Handling Uncaught Exeptions
process.on('uncaughtException', err => {
  console.log('UUncaught Exeptions, Server Shutting Down');
  console.log(err);
  process.exit(1); //Safe Exit
});

//Gloable Handling unhandled Promise Rejections
process.on('unhandledRejection', err => {
  console.log('Unhandled Promise Rejection, Server Shutting Down');
  console.log(err);
  server.close(() => process.exit(1)); //Safe Exit
});
