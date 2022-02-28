const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../config/winston');
require('dotenv').config({ path: '../.env' });
const {
  StatusCode,
  SuccessMessage,
  ErrorMessage,
} = require('../utils/response');
const { NotFound, BadRequest, Conflict } = require('../utils/errors');
const transport = require('../middleware/mailTransport');
const crypto = require('crypto'); // npm built-in module
const { generateMessage } = require('../utils/sendMailMessage');

const TAG = 'authController  ';

function sendMailForCertified(email) {
  const randomNumber = crypto.randomBytes(3).toString('hex');
  const mailMessage = generateMessage(email, randomNumber);

  try {
    transport.sendMail(mailMessage);
    return randomNumber;
  } catch (err) {
    logger.error(err);
    throw new NotFound(ErrorMessage.sendMailFailed);
  }
}

module.exports = {
  signUp: async function (req, res, next) {
    try {
      // TODO DTO 만들어서 req.body로 넘기지 않도록 수정하기 (전체적으로)
      if (!req.body.email || !req.body.password) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }

      const isVaildate = await User.validateEmail(req);

      if (!isVaildate) {
        // 회원가입 후 바로 로그인 수행하여 토큰 발급
        await User.signUp(req)
          .then(() => {
            passport.authenticate('local', { session: false }, (err, user) => {
              if (err || !user) {
                logger.info(TAG + err || !user);
                return res.status(StatusCode.CREATED).json({
                  success: false,
                  message: SuccessMessage.loginfailedAfterSuccessSignUp,
                });
              }
              req.login(user, { session: false }, (err) => {
                if (err) {
                  next(err);
                }
                const token = jwt.sign(
                  user[0].user_id,
                  process.env.JWT_SECRET_KEY,
                );
                return res.status(StatusCode.CREATED).json({
                  success: true,
                  message: SuccessMessage.loginSuccessAfterSuccessSignUp,
                  data: { token },
                });
              });
            })(req, res);
          })
          .catch((err) => {
            logger.error(TAG + err);
            throw new NotFound(ErrorMessage.signUpFailed);
          });
      } else {
        throw new Conflict(ErrorMessage.validateEmail);
      }
    } catch (err) {
      next(err);
    }
  },
  signIn: async function (req, res, next) {
    try {
      if (!req.body.email || !req.body.password) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      passport.authenticate('local', { session: false }, (err, user) => {
        if (err || !user) {
          logger.info(TAG + err || !user);
          return res.status(StatusCode.BADREQUEST).json({
            success: false,
            message: ErrorMessage.checkIDPasswordAgain,
          });
        }
        const token = jwt.sign(user[0].user_id, process.env.JWT_SECRET_KEY);
        const pushState = user[0].push_state;
        return res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.loginSuccess,
          data: {
            token,
            pushState,
          },
        });
      })(req, res, next);
    } catch (err) {
      next(err);
    }
  },
  sendMail: async function (req, res, next) {
    try {
      if (!req.body.email) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }

      const isVaildate = await User.validateEmail(req);
      if (isVaildate) {
        const randomNumber = sendMailForCertified(req.body.email);
        logger.info(SuccessMessage.sendMailForCertifiedNumber);
        return res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.sendMailForCertifiedNumber,
          data: { randomNumber },
        });
      } else {
        throw new NotFound(ErrorMessage.unvalidateUser);
      }
    } catch (err) {
      next(err);
    }
  },
  restartSignIn: async function (req, res, next) {
    try {
      if (!req.body.verify && !req.body.email) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      const verify = req.body.verify;
      if (verify) {
        await User.signIn(req).then((result) => {
          const token = jwt.sign(result[0].user_id, process.env.JWT_SECRET_KEY);
          const pushState = result[0].push_state;
          return res.status(StatusCode.OK).json({
            success: true,
            message: SuccessMessage.loginSuccess,
            data: {
              token,
              pushState,
            },
          });
        });
      } else {
        // 메일 재전송
        const randomNumber = sendMailForCertified(req.body.email);
        logger.info(SuccessMessage.sendMailForCertifiedNumber);
        return res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: SuccessMessage.unvalidateNumberAndSendMail,
          data: { randomNumber },
        });
      }
    } catch (err) {
      next(err);
    }
  },
};
