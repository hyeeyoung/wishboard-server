const express = require('express');
const app = express();
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const logger = require('./config/winston');
const bodyParser = require('body-parser');
require('dotenv').config({ path: '../.env' });
const port = process.env.PORT;
const nodeEnv = process.env.NODE_ENV;

const passport = require('passport');
const passportConfig = require('./config/passport');

const handleErrors = require('./middleware/handleError');
const { NotFound } = require('./utils/errors');
const { ErrorMessage } = require('./utils/response');

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

app.listen(port, () =>
  logger.info(`Server start listening on port ${port} | ${nodeEnv}`),
);
app.get('/', (req, res) => res.send('Welcome to WishBoard!!'));
app.set('port', port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/** passport 설정 */
app.use(passport.initialize());
passportConfig();

/** router 설정 */
app.use('/auth', require('./routes/authRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/item', require('./routes/itemRoutes'));
app.use('/cart', require('./routes/cartRoutes'));
app.use('/folder', require('./routes/folderRoutes'));
app.use('/noti', require('./routes/notiRoutes'));

/** 에러페이지 설정 */
app.use((req, res, next) => {
  throw new NotFound(ErrorMessage.ApiUrlIsInvalid);
});
app.use(handleErrors);

module.exports = app;
