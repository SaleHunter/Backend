const express = require('express');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'sale_hunter',
  'salehunter_admin@salehunter-db',
  '01154866274Ay',
  {
    host: 'salehunter-db.mysql.database.azure.com',
    dialect: 'mysql',
  }
);
async function con() {
  try {
    await sequelize.authenticate();
    console.log('connection has been established successfully');
  } catch (error) {
    console.error('enable to connect to the db ', error);
  }
}
con();
const app = express();
module.exports = app;
