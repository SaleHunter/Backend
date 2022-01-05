const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../../config/db');
const AuthUtil = require('../utils/authUtils');

class Service {
  async signup(userInfo) {
    try {
      //destruct user information sent into request
      const { fullname, password, email } = userInfo;

      //generate a unique uuid for the user
      const id = uuidv4();

      //Hash user's password
      const hashedPassword = await AuthUtil.hashPassword(password);

      const insertUserQuery = `INSERT INTO users (id, full_name, email, password) VALUES(?, ?, ?, ?);`;
      const affectedRows = await sequelize.query(insertUserQuery, {
        replacements: [id, fullname, email, hashedPassword],
        type: sequelize.QueryTypes.INSERT,
      });

      const selectUserQuery = `SELECT id, full_name as fullname, email, password FROM users where id = ?;`;
      const createdUser = await sequelize.query(selectUserQuery, {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      });

      delete createdUser[0].password;
      return createdUser;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new Service();
