const jwt = require('jsonwebtoken');
const { ErrorMessage } = require('../utils/response');
const { Unauthorized, BadRequest } = require('../utils/errors');
const { OsType } = require('../utils/strings');
require('dotenv').config({ path: '../.env' });

const jwtSecret = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];

    const jwtVerify = jwt.verify(token, jwtSecret);
    req.decoded = jwtVerify.data;
    return next();
  } catch (err) {
    if (err.name == 'TokenExpiredError') {
      throw new Unauthorized(ErrorMessage.expireToken);
    }
    throw new Unauthorized(ErrorMessage.expireToken);
  }
};

const getOsType = (req, res, next) => {
  const userAgent = req.headers['user-agent'];
  if (!userAgent) {
    throw new BadRequest(ErrorMessage.userAgentNotFound);
  }
  const osType = userAgent.split('/')[0].split('-')[1];
  const osTypeToUpperCase = String(osType).toUpperCase();

  if (!Object.keys(OsType).includes(osTypeToUpperCase)) {
    throw new BadRequest(ErrorMessage.userAgentInOsInfoNotFound);
  }
  req.osType = String(osType).toUpperCase();
  return next();
};

module.exports = { verifyToken, getOsType };
