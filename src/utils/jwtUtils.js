const jwt = require('jsonwebtoken');
const { ErrorMessage } = require('../utils/response');
const { NotFound, Unauthorized } = require('../utils/errors');
const { getRedisClient } = require('../config/redis');
const User = require('../models/user');
require('dotenv').config({ path: '../.env' });

const jwtSecret = process.env.JWT_SECRET_KEY;

const ALGORITHM = 'HS256';
const ACCESS_TOKEN_EXPIRES_TIME = '30m'; // 30 minute
const REFRESH_TOKEN_EXPIRES_TIME = '200d'; // 200 days
const REDIS_SAVE_REFRESH_TOKEN_TTL = 17280000; // 200 * 60 * 60 * 24 // 200일 초
const EXPIRE_TIME = 1; // 1초 === 삭제

const createJwt = async (userId) => {
  try {
    if (!userId) {
      throw new NotFound(ErrorMessage.userIdNotFound);
    }
    const accessToken = jwt.sign({ data: userId }, jwtSecret, {
      algorithm: ALGORITHM,
      expiresIn: ACCESS_TOKEN_EXPIRES_TIME,
    });
    const refreshToken = jwt.sign({ data: userId }, jwtSecret, {
      algorithm: ALGORITHM,
      expiresIn: REFRESH_TOKEN_EXPIRES_TIME,
    });

    await getRedisClient().set(userId, refreshToken);
    await getRedisClient().expire(userId, REDIS_SAVE_REFRESH_TOKEN_TTL);

    return { accessToken: accessToken, refreshToken: refreshToken };
  } catch (err) {
    throw new Unauthorized(ErrorMessage.failedCreateToken);
  }
};

const verifyRefresh = async (req, res, next) => {
  try {
    const reqRefreshToken = req.body.refreshToken;
    const jwtVerify = jwt.verify(reqRefreshToken, jwtSecret);

    const redisRefreshToken = await getRedisClient().get(jwtVerify.data);

    if (!redisRefreshToken) {
      throw new Unauthorized(ErrorMessage.expireToken);
    }

    if (reqRefreshToken !== redisRefreshToken) {
      // redis에 있는 값은 삭제
      await getRedisClient().expire(jwtVerify.data, EXPIRE_TIME);
      throw new Unauthorized(ErrorMessage.expireToken);
    }

    const token = await createJwt(jwtVerify.data);

    return token;
  } catch (err) {
    throw new Unauthorized(ErrorMessage.unValidateToken);
  }
};

const expiredRefreshToken = async (req, res, next) => {
  try {
    const userId = Number(req.decoded);
    await User.selectUser(userId);
    const redisRefreshToken = await getRedisClient().get(userId);
    if (redisRefreshToken) {
      // redis에 있는 값은 삭제
      await getRedisClient().expire(userId, EXPIRE_TIME);
    }
    return;
  } catch (err) {
    throw new Unauthorized(ErrorMessage.unValidateToken);
  }
};

module.exports = { createJwt, verifyRefresh, expiredRefreshToken };
