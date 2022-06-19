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
const { Strings } = require('./utils/strings');

const fs = require('fs').promises;
const ipFilter = require('express-ipfilter').IpFilter;

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

let deniedIpAddressArray = [];
const server = app.listen(port, () => {
  /** 앱 시작 알림 */
  process.send('ready');
  logger.info(`[API Server] on port ${port} | ${nodeEnv}`);

  /** 사용자 탈퇴 스케줄러 실행 */
  logger.info(SuccessMessage.userDeleteScheudlerStart);
  schedule.scheduleJob('0 0 * * *', function () {
    schduleService.usersDelete();
  });

  /** Denied ipAddress 목록 불러와 배열에 저장*/
  fs.readFile(Strings.IPDENIED_FILENAME)
    .then((ipAddressList) => {
      if (ipAddressList.toString().length !== 0) {
        deniedIpAddressArray = ipAddressList.toString().split(' ');
      }
      logger.info(
        `[${SuccessMessage.readIpAddress}] ${deniedIpAddressArray.length}개`,
      );
    })
    .catch((err) => {
      throw err;
    });
});

process.on('SIGINT', function () {
  /** Denied Ip Address 파일로 쓰고 종료*/
  const deniedIpAddressList = deniedIpAddressArray
    .toString()
    .replace('/,/g', ' ');

  fs.writeFile(Strings.IPDENIED_FILENAME, deniedIpAddressList, 'utf8')
    .then((data) => {
      logger.info(SuccessMessage.addIpAddressDenied);
    })
    .catch((err) => logger.error(err));
  isDisableKeepAlive = true;
  server.close(function () {
    /** 앱 및 스케줄러 종료*/
    logger.info('pm2 process closed');
    schedule.gracefulShutdown().then(() => process.exit(0));
    logger.info(SuccessMessage.userDeleteScheudlerExit);
  });
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/** passport 설정 */
app.use(passport.initialize());
passportConfig();

/** router 설정 */
app.use(require('./routes/index'));

/** 에러페이지 및 ip 차단 추가 */
app.use((req, res, next) => {
  const ipAddress = req.ip.toString().split('::')[1];
  if (deniedIpAddressArray.indexOf(ipAddress) === -1) {
    deniedIpAddressArray.push(ipAddress);
  }
  throw new NotFound(ErrorMessage.ApiUrlIsInvalid);
});
app.use(handleErrors);

/** ip 차단 설정 */
app.use(ipFilter(deniedIpAddressArray));

module.exports = app;
