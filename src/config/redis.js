const Redis = require('ioredis');
const logger = require('./winston');
require('dotenv').config({ path: '../.env' });

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const nodeEnv = process.env.NODE_ENV;

let redisPassword = process.env.REDIS_DEV_PASSWORD;
if (nodeEnv === 'production') {
  redisPassword = process.env.REDIS_PASSWORD;
}

let redis;

const redisConnect = () => {
  try {
    redis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: redisPassword,
      showFriendlyErrorStack: true,
    });
    logger.info(`redis(${REDIS_HOST}:${REDIS_PORT}) connect success!`);
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }
};

const getRedisClient = () => {
  return redis;
};

module.exports = {
  redisConnect,
  getRedisClient,
};
