const nodemailer = require('nodemailer');
const pug = require('pug');
const fs = require('fs').promises;

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

    let html = await fs.readFile(
      `${__dirname}/../../../templates/reset-password.pug`,
      'utf-8'
    );

    const replacements = {
      email: user[0].email,
      fullname: user[0].fullname,
    };

    this.emailOptions.subject = 'Forget Password';
    this.emailOptions.to = user[0].email;
    this.emailOptions.text = `Your reset code is ${token}`;
    // pug.renderFile(
    //   `${__dirname}/../../../templates/reset-password.pug`,
    //   replacements
    // );

    try {
      const emailResponse = await transporter.sendMail(this.emailOptions);
    } catch (error) {
      console.log(error);
    }
  }
};
