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

async function authenticateSequelize() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!\n');
    return sequelize;
  } catch (err) {
    console.log('Database connection Failed ', err);
    return;
  }
}

module.exports = { sequelize, authenticateSequelize };
