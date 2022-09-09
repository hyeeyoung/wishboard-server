const { GeneralError } = require('../utils/errors');
require('dotenv').config({ path: '../.env' });
const logger = require('../config/winston');
const Slack = require('../lib/slack');
const multer = require('multer');
const { ErrorMessage } = require('../utils/response');

const handleErrors = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    logger.error(err);
  } else {
    logger.error(err.stack);
  }

  //* multer 에러 확인용 log
  if (err instanceof multer.MulterError) {
    if (process.env.NODE_ENV === 'production') {
      Slack.sendMessage({
        color: Slack.Colors.danger,
        title: 'wishboard s3 업로드 multer 에러',
        text: err.message,
        fields: [
          {
            title: 'Error Stack:',
            value: `\`\`\`${err.stack}\`\`\``,
          },
        ],
      });
    }
    return res.status(500).json({
      success: false,
      message: 'wishboard 서버 에러 with multer',
    });
  }

  //* Custom Error
  if (err instanceof GeneralError) {
    //* 슬랙에 알림은 production 모드인 경우에만
    if (
      process.env.NODE_ENV === 'production' &&
      err.message !== ErrorMessage.RequestWithIntentionalInvalidUrl
    ) {
      Slack.sendMessage({
        color: Slack.Colors.info,
        title: `${err.getCode()} ${err.message}`,
        text: `[${req.method}] ${req.url} \`\`\`user-agent: ${req.header(
          'user-agent',
        )} \nip-adress: ${req.ip}\`\`\``,
      });
    }

    return res.status(err.getCode()).json({
      success: false,
      message: err.message,
    });
  }

  //* 슬랙에 알림은 production 모드인 경우에만
  if (process.env.NODE_ENV === 'production') {
    Slack.sendMessage({
      color: Slack.Colors.danger,
      title: 'wishboard 서버 에러',
      text: err,
      fields: [
        {
          title: 'Error Stack:',
          value: `\`\`\`${err.stack}\`\`\``,
        },
      ],
    });
  }
  return res.status(500).json({
    success: false,
    message: 'wishboard 서버 에러',
  });
};

module.exports = handleErrors;
