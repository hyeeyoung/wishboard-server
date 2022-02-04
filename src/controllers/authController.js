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

const TAG = 'authController  ';

module.exports = {
  signUp: async function (req, res, next) {
    const isVaildate = await User.vaildateEmail(req);

    if (!isVaildate) {
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
          res.status(StatusCode.NOTFOUND).json({
            success: false,
            message: ErrorMessage.signUpFailed,
          });
        });
    } else {
      res.status(StatusCode.CONFLICT).json({
        success: false,
        message: ErrorMessage.vaildateEmail,
      });
    }
  },
  signIn: async function (req, res, next) {
    passport.authenticate('local', { session: false }, (err, user) => {
      if (err || !user) {
        logger.info(TAG + err || !user);
        return res.status(StatusCode.BADREQUEST).json({
          success: false,
          message: ErrorMessage.checkIDPasswordAgain,
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          logger.info(TAG + err);
          next(err);
        }
        const token = jwt.sign(user[0].user_id, process.env.JWT_SECRET_KEY);
        return res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.loginSuccess,
          data: token,
        });
      });
    })(req, res);
  },
};
