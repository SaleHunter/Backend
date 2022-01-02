const express = require('express');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
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
