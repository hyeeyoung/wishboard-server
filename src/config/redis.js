const Redis = require('ioredis');
const logger = require('./winston');
require('dotenv').config({ path: '../.env' });

let redisHost;
let redisPort;

const nodeEnv = process.env.NODE_ENV;
if (nodeEnv === 'production') {
  redisHost = process.env.REDIS_HOST;
  redisPort = process.env.REDIS_PORT;
} else {
  redisHost = process.env.REDIS_DEV_HOST;
  redisPort = process.env.REDIS_DEV_PORT;
}

let redis;

const redisConnect = () => {
  try {
    if (nodeEnv === 'production') {
      redis = new Redis({
        host: redisHost,
        port: redisPort,
        showFriendlyErrorStack: true,
      });
    } else {
      redis = new Redis({
        host: redisHost,
        port: redisPort,
        password: process.env.REDIS_DEV_PASSWORD,
        showFriendlyErrorStack: true,
      });
    }
    logger.info(`redis ${nodeEnv} connect success!`);
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
