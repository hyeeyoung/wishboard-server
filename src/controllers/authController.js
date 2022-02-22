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
const { NotFound, BadRequest } = require('../utils/errors');

const TAG = 'authController  ';

module.exports = {
  signUp: async function (req, res, next) {
    try {
      // TODO DTO 만들어서 req.body로 넘기지 않도록 수정하기 (전체적으로)
      if (!req.body.email || !req.body.password) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }

      const isVaildate = await User.vaildateEmail(req);

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
                  data: token,
                });
              });
            })(req, res);
          })
          .catch((err) => {
            logger.error(TAG + err);
            throw new NotFound(ErrorMessage.signUpFailed);
          });
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
        return res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.loginSuccess,
          data: {
            token: token,
            push_state: user[0].push_state,
          },
        });
      })(req, res, next);
    } catch (err) {
      next(err);
    }
  },
  sendMail: async function (req, res, next) {},
};
