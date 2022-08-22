const express = require('express');
const app = express();
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const logger = require('./config/winston');
require('dotenv').config({ path: '../.env' });
const port = process.env.PORT;
const nodeEnv = process.env.NODE_ENV;

const passport = require('passport');
const passportConfig = require('./config/passport');
const schedule = require('node-schedule');
const schduleService = require('./middleware/userScheduler');

const handleErrors = require('./middleware/handleError');
const { NotFound } = require('./utils/errors');
const { SuccessMessage, ErrorMessage } = require('./utils/response');

const rateLimit = require('./middleware/rateLimiter');

/** 기본 설정 */
// 서버 환경에 따라 다르게 설정 (배포/개발)
app.use(helmet());
app.use(hpp());
if (nodeEnv === 'production') {
  morganFormat = 'combined'; // Apache 표준
} else {
  morganFormat = 'dev';
}
app.use(morgan(morganFormat, { stream: logger.stream }));

let isDisableKeepAlive = false;
app.use(function (req, res, next) {
  if (isDisableKeepAlive) {
    res.set('Connection', 'close');
  }
  next();
});

const server = app.listen(port, () => {
  /** 앱 시작 알림 */
  process.send('ready');
  logger.info(`[API Server] on port ${port} | ${nodeEnv}`);

  /** 앱 시작과 동시에 사용자 탈퇴 스케줄러 실행 */
  logger.info(SuccessMessage.userDeleteSchedulerStart);
  schedule.scheduleJob('0 0 0 ? * MON *', function () {
    schduleService.usersDelete();
  });
});

process.on('SIGINT', function () {
  isDisableKeepAlive = true;
  server.close(function () {
    /** 앱 및 스케줄러 종료*/
    logger.info('pm2 process closed');
    schedule.gracefulShutdown().then(() => process.exit(0));
    logger.info(SuccessMessage.userDeleteSchedulerExit);
  });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** DDos 공격 방지 */
app.use(rateLimit);

/** passport 설정 */
app.use(passport.initialize());
passportConfig();

/** router 설정 */
app.use(require('./routes/index'));

/** 에러페이지 및 에러 핸들링 */
app.use((req, res, next) => {
  throw new NotFound(ErrorMessage.RequestWithIntentionalInvalidUrl);
});
app.use(handleErrors);

module.exports = app;
