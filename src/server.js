const dotenv = require('dotenv');

//Setup Enviroment Variables
dotenv.config({ path: '.env' });

const port = process.env.PORT || 8000;
const app = require('./app.js');

//Start The server
app.listen(port, console.log(`Server running at ${port}`));
