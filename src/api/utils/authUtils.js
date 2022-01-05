const bcrypt = require('bcrypt');

class Util {
  async hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }
}

module.exports = new Util();
