const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' });

const mailConfig = {
  service: 'Naver',
  host: 'smtp.naver.com',
  port: 587,
  auth: {
    user: process.env.WISHBOARD_NAVER_ID,
    pass: process.env.WISHBOARD_NAVER_PW,
  },
};

const transport = nodemailer.createTransport(mailConfig);

module.exports = transport;
