const winston = require('winston');
const WinstonDaily = require('winston-daily-rotate-file');
const { combine, timestamp, printf, colorize } = winston.format;
const appRoot = require('app-root-path');

const logDir = `${appRoot}/logs`;
const logFormat = printf((info) => {
  return `${info.timestamp} [${info.level}] : ${info.message}`;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    // 0, 1, 2 level과 0 level 로그 파일 별도 보관
    new WinstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: `%DATE%.log`,
      maxFiles: 10000,
      zippedArchive: true,
    }),
    new WinstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error',
      filename: `%DATE%_error.log`,
      maxFiles: 10000,
      zippedArchive: true,
    }),
  ],
});

logger.stream = {
  write: (message) => {
    logger.info(message);
  },
};

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(colorize({ all: true }), logFormat),
    }),
  );
}

module.exports = logger;
