const nodemailer = require('nodemailer');
const mailjetTransport = require('nodemailer-mailjet-transport');
const pug = require('pug');
const fs = require('fs').promises;
const mailjet = require('node-mailjet').connect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_API_SECRET
);

module.exports = class Email {
  // constructor() {
  //   this.emailOptions = {
  //     from: process.env.EMAIL_USER,
  //   };
  // }

  // createTransporter() {
  //   return nodemailer.createTransport({
  //     service: 'gmail',
  //     auth: {
  //       user: process.env.EMAIL_USER,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //   });
  // }

  // createTransporterMailjet() {
  //   mailjet.connect(
  //     process.env.MAILJET_API_KEY,
  //     process.env.MAILJET_API_SECRET
  //   );
  // }

  // async sendResetPasswordEmail(user, token, client) {
  //   // const transporter = this.createTransporter();

  //   // const replacements = {
  //   //   email: user[0].email,
  //   //   fullname: user[0].fullname,
  //   // };

  //   // this.emailOptions.subject = 'Forget Password';
  //   // this.emailOptions.to = user[0].email;
  //   // this.emailOptions.text = `Your reset code is ${token}`;
  //   // // pug.renderFile(
  //   // //   `${__dirname}/../../../templates/reset-password.pug`,
  //   // //   replacements
  //   // // );

  //   try {
  //     const emailResponse = await transporter.sendMail(this.emailOptions);
  //     console.log(emailResponse);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  sendResetPasswordEmail(user, token, client) {
    // this.createTransporterMailjet();
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_USER,
            Name: 'SaleHunter',
          },
          To: [
            {
              Email: user[0].email,
              Name: user[0].fullname,
            },
          ],
          Subject: 'Forget Password',
          TextPart: `Your reset code is ${token}`,
          HTMLPart: `<!DOCTYPE html>
            <html ln="en">
              <head>
                <title>Sale Hunter</title>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <!----icon--->
                <link rel="icon" href="./Sale Hunter Semi Horizontal.png" />
              </head>
            
              <style>
                :root {
                  --main-color: #8342fe;
                }
                html,
                body {
                  margin: 0;
                  height: 100vh;
                  overflow: hidden;
                }
                body {
                  background-color: #ffffff;
                  font-family: Segoe UI Regular;
                  font-size: 18px;
                }
                * {
                  padding: 0;
                  margin: 0;
                  -webkit-box-sizing: border-box;
                  -moz-box-sizing: border-box;
                  box-sizing: border-box;
                }
                a {
                  text-decoration: none;
                }
                ul {
                  list-style: none;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  width: 650px;
                  padding-left: 20px;
                  padding-right: 20px;
                  margin-left: auto;
                  margin-right: auto;
                }
                .logo {
                  display: block;
                  margin-right: auto;
                  margin-left: auto;
                  margin-top: 30px;
                }
                .header {
                  background-color: var(--main-color);
                  margin: 20px 0;
                  height: 88px;
                  text-align: center;
                  color: white;
                  font-family: Raleway semibold;
                }
                .main-title {
                  padding-top: 20px;
                }
                .content {
                  margin-top: 40px;
                  padding-left: 30px;
                  padding-right: 30px;
                }
                .content .main-paragraph {
                  color: #515151;
                  margin-bottom: 50px;
                }
                .main-button {
                  background-color: var(--main-color);
                  color: white;
                  padding: 10px 60px;
                  border-radius: 10px;
                  margin-left: auto;
                  margin-right: auto;
                  display: table;
                  margin-bottom: 50px;
                }
                .footer {
                  background-color: #f3f3f3;
                  text-align: center;
                  color: #515151;
                  height: 100px;
                }
                .footer .copy-right {
                  font-family: Segoe UI semibold;
                  font-size: 14px;
                  padding-top: 27px;
                }
              </style>
            
              <body>
                <div class="container">
                  <img
                    class="logo"
                    src="./Sale Hunter Semi Horizontal.png"
                    alt="sale Hunter logo "
                  />
                  <div class="header">
                    <h1 class="main-title">Reset Password</h1>
                  </div>
                  <div class="content">
                    <p class="main-paragraph">
                      Hi, ${user[0].email}<br />
                      Here is the reset password pin: ${token}
                    </p>
                    <a class="main-button" href="#">Verify</a>
                    <p class="main-paragraph">
                      Thank you,<br />
                      Sale Hunter Team.
                    </p>
                  </div>
                  <div class="footer">
                    <p class="copy-right">
                      Copyright © 2022 Sale Hunter, All rights reserved.
                    </p>
                    <p>This email was intended for Username (${user[0].email})</p>
                  </div>
                </div>
              </body>
            </html>
            `,
        },
      ],
    });
    request
      .then(result => {
        console.log(result.body);
      })
      .catch(err => {
        console.log(err.statusCode);
      });
  }
};
