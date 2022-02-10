const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor() {
    this.emailOptions = {
      from: process.env.EMAIL_USER,
    };
  }

  createTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendResetPasswordEmail(user, token, client) {
    const transporter = this.createTransporter();

    this.emailOptions.subject = 'Forget Password';
    this.emailOptions.to = user[0].email;
    this.emailOptions.text = `Hello ${user[0].fullname},
    your reset ${client === 'mobile' ? 'pin' : 'token'} is: ${token}
    `;

    try {
      const emailResponse = await transporter.sendMail(this.emailOptions);
    } catch (error) {
      console.log(error);
    }
  }
};
