const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' });

const mailConfig = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465, // 보안 포트
  secure: true, // ture for port 465, false for other ports
  auth: {
    user: process.env.WISHBOARD_GMAIL_ID,
    pass: process.env.WISHBOARD_GMAIL_PW,
  },
};

const transport = nodemailer.createTransport(mailConfig);

module.exports = transport;
