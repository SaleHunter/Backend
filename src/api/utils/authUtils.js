const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
        audience: [process.env.GOOGLE_FRONT_USER_ID, GOOGLE_FLUTTER_USER_ID],
      });
      return ticket.payload;
    } catch (err) {
      console.log(err);

      console.log('Error from Verify third party auth ');
    }
  }

  async generateResetToken(client) {
    try {
      let token;
      if (client === 'mobile')
        token = Math.floor(100000 + Math.random() * 900000);
      //random 6-digit number
      else token = await crypto.randomBytes(16).toString('hex');

      return token;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Util();
