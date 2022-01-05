const dotenv = require('dotenv');

//Setup Enviroment Variables
dotenv.config({ path: '.env' });
const mysql = require('./config/db.js').authenticateSequelize();

const port = process.env.PORT || 5000;
const app = require('./app.js');

console.log(port);

//Start The server
app.listen(port, console.log(`Server running at ${port}`));
