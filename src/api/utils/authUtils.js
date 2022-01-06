const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class Util {
  async hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  async comparePassword(password, hashedPassword) {
    const isPasswordMatched = await bcrypt.compare(password, hashedPassword);

    return isPasswordMatched;
  } 

  async signJWT(id) {
    const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return token;
  }
}

module.exports = new Util();
