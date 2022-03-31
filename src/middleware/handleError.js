const { GeneralError } = require('../utils/errors');
const logger = require('../config/winston');
const Slack = require('../lib/slack');

const handleErrors = (err, req, res, next) => {
  logger.error(err);
  if (err instanceof GeneralError) {
    Slack.sendMessage({
      color: Slack.Colors.info,
      title: `${String(err.getCode())} ${String(err.message)}`,
    });
    return res.status(err.getCode()).json({
      success: false,
      message: err.message,
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
};

module.exports = handleErrors;
