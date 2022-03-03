const { sequelize } = require('../../config/db');
const { NoUserFoundError } = require('./errors');

/**
 * @class
 * @classdesc Represents The Data Access Layer of Authentication Domain
 * Constains methods which talks with the Database and do some queries
 */
class DataAccessLayer {
  /**
   * @method Get user's info by his email from database
   * @access public
   * @async
   * @param {string} email - user's email
   * @throws {NoUserFoundError}
   * @returns {Promise<object>} user info object
   */
  async getUserbyEmail(email) {
    try {
      const queryString = `
        SELECT id, email, full_name as fullname,
        password, profile_img, last_seen FROM users where email = ?;
      `;

      const results = await sequelize.query(queryString, {
        type: sequelize.QueryTypes.SELECT,
        replacements: [email],
      });

      if (!results[0]) throw new NoUserFoundError(email);

      return results[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DataAccessLayer();
