const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' });

// TODO SSL 인증서 설정 후 주석 삭제 지우고 보안 포트 설정하기

const mailConfig = {
  service: 'naver',
  host: 'smtp.naver.com',
  port: 587,
  // port: 465, // 보안 포트
  // secure: true, // ture for port 465, false for other ports
  auth: {
    user: process.env.WISHBOARD_NAVER_ID,
    pass: process.env.WISHBOARD_NAVER_PW,
  },
};

const transport = nodemailer.createTransport(mailConfig);

module.exports = transport;
