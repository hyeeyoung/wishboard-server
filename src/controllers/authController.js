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

const sendMailForCertified = (email) => {
  const verificationCode = crypto.randomBytes(3).toString('hex');
  const mailMessage = generateMessage(email, verificationCode);

  try {
    transport.sendMail(mailMessage);
    return verificationCode;
  } catch (err) {
    logger.error(err);
    throw new NotFound(ErrorMessage.sendMailFailed);
  }
};

module.exports = {
  checkEmail: async function (req, res, next) {
    try {
      if (!req.body.email) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      await User.validateEmail(req).then((isValidate) => {
        if (!isValidate) {
          return res.status(StatusCode.OK).json({
            success: true,
            message: SuccessMessage.unValidateEmail,
          });
        } else {
          if (!isValidate.isActive) {
            return res.status(StatusCode.NOCONTENT).send();
          }
          throw new Conflict(ErrorMessage.validateEmail);
        }
      });
    } catch (err) {
      next(err);
    }
  },
  signUp: async function (req, res, next) {
    try {
      // TODO DTO 만들어서 req.body로 넘기지 않도록 수정하기 (전체적으로)
      if (!req.body.email || !req.body.password) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }

      await User.signUp(req).then(() => {
        passport.authenticate('local', { session: false }, (err, user) => {
          if (err || !user) {
            logger.info(TAG + err || !user);
            return res.status(StatusCode.CREATED).json({
              success: false,
              message: SuccessMessage.loginFailedAfterSuccessSignUp,
            });
          }
          req.login(user, { session: false }, (err) => {
            if (err) {
              next(err);
            }
            const token = jwt.sign(user[0].user_id, process.env.JWT_SECRET_KEY);
            return res.status(StatusCode.CREATED).json({
              success: true,
              message: SuccessMessage.loginSuccessAfterSuccessSignUp,
              data: { token },
            });
          });
        })(req, res);
      });
    } catch (err) {
      next(err);
    }
  },
  signIn: async function (req, res, next) {
    try {
      if (!req.body.email || !req.body.password) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      passport.authenticate(
        'local',
        { session: false },
        (err, user, unActiveUser) => {
          if (err || !user) {
            logger.info(TAG + err || !user);
            if (unActiveUser) {
              return res.status(StatusCode.NOCONTENT).send();
            }
            return res.status(StatusCode.BADREQUEST).json({
              success: false,
              message: ErrorMessage.checkIDPasswordAgain,
            });
          }
          const token = jwt.sign(user[0].user_id, process.env.JWT_SECRET_KEY);
          return res.status(StatusCode.OK).json({
            success: true,
            message: SuccessMessage.loginSuccess,
            data: { token },
          });
        },
      )(req, res, next);
    } catch (err) {
      next(err);
    }
  },
  sendMail: async function (req, res, next) {
    try {
      if (!req.body.email) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }

      const isValidate = await User.validateEmail(req);
      if (isValidate.success && isValidate.isActive) {
        const verificationCode = sendMailForCertified(req.body.email);
        logger.info(SuccessMessage.sendMailForCertifiedNumber);
        return res.status(StatusCode.CREATED).json({
          success: true,
          message: SuccessMessage.sendMailForCertifiedNumber,
          data: { verificationCode },
        });
      } else {
        if (!isValidate.success) {
          throw new NotFound(ErrorMessage.unValidateUser);
        }
        return res.status(StatusCode.NOCONTENT).send();
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
      const isVerify = req.body.verify;
      if (isVerify) {
        await User.signIn(req).then((result) => {
          const token = jwt.sign(result[0].user_id, process.env.JWT_SECRET_KEY);
          return res.status(StatusCode.OK).json({
            success: true,
            message: SuccessMessage.loginSuccess,
            data: { token },
          });
        });
      } else {
        throw new NotFound(ErrorMessage.unValidateVerificationCode);
      }
    } catch (err) {
      next(err);
    }
  },
};
