const { GeneralError } = require('../utils/errors');
const { ErrorMessage, StatusCode } = require('../utils/response');
require('dotenv').config({ path: '../.env' });
const logger = require('../config/winston');
const Slack = require('../lib/slack');
const { Strings } = require('../utils/strings');
const IpDeniedError = require('express-ipfilter').IpDeniedError;

const handleErrors = (err, req, res, next) => {
  logger.error(err);
  if (process.env.NODE_ENV === 'production') {
    if (err instanceof GeneralError) {
      //* 잘못된 경로로 요청 시
      if (err.message === ErrorMessage.ApiUrlIsInvalid) {
        //* 슬랙에 알림
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
        message: `${err.message} ${Strings.IPDENIED}`,
      });
    }
    //* 차단된 IP 목록에 포함된 IP로 요청 시
    if (err instanceof IpDeniedError) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: ErrorMessage.IpDeniedError,
      });
    }

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
    return res.status(500).json({
      success: false,
      message: 'wishboard 서버 에러',
    });
  }
};

module.exports = handleErrors;
