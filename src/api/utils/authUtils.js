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
  async verifyThirdPartyAuth(client, CLIENT_ID, token) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      return ticket.payload;
    } catch (err) {
      console.log('Error from Verify third party auth ');
    }
  }
}

module.exports = new Util();
