const nodeMailer = require('nodemailer');
const mailConfig = require('../config/mail.config');

const transport = nodeMailer.createTransport({
  host: mailConfig.HOST,
  port: mailConfig.PORT,
  secure: false,
  auth: {
    user: mailConfig.USERNAME,
    pass: mailConfig.PASSWORD,
  }
});

async function sendMail({ to, subject, html }) {
  const options = {
    from: mailConfig.FROM_ADDRESS,
    to,
    subject,
    html,
  };

  return transport.sendMail(options);
}

module.exports = sendMail;
