const { GeneralError } = require('../utils/errors');
const logger = require('../config/winston');

const handleErrors = (err, req, res, next) => {
  logger.error(err);
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      success: false,
      message: err.message,
    });
  }
  return res.status(500).json({
    success: false,
    message: 'wishboard 서버 에러',
  });
};

module.exports = handleErrors;
