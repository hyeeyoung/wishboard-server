const jwt = require('jsonwebtoken');
const { ErrorMessage } = require('../utils/response');
const { Unauthorized } = require('../utils/errors');
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
    throw new Unauthorized(ErrorMessage.unValidateToken);
  }
};

module.exports = { verifyToken };
