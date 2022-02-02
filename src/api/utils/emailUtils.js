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

  async sendResetPasswordEmail(user, token) {
    const transporter = this.createTransporter();

    const resetLink = `http://localhost:4000/api/v1/auth/resetPassword/${token}`;
    this.emailOptions.subject = 'Forget Password';
    this.emailOptions.to = user[0].email;
    this.emailOptions.text = `Hello ${user[0].fullname},

    We heared you need a password reset. Click the link below and
    you'll be redirected to a secure site from which you can set
    a new password.
        reset link: ${resetLink}
    `;

    try {
      const emailResponse = await transporter.sendMail(this.emailOptions);
    } catch (error) {
      console.log(error);
    }
  }
};
