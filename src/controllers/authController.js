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
const { getRandomNickname } = require('../utils/TemporaryNicknames');
const { createJwt, verifyRefresh } = require('../utils/jwtUtils');

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

      await User.signUp(req).then(async (userId) => {
        const token = await createJwt(userId);
        const tempNickname = getRandomNickname();
        return res.status(StatusCode.CREATED).json({
          success: true,
          message: SuccessMessage.loginSuccessAfterSuccessSignUp,
          data: { token, tempNickname },
        });
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
      await User.signIn(req).then(async (data) => {
        if (!data.result) {
          return res.status(StatusCode.BADREQUEST).json({
            success: false,
            message: ErrorMessage.checkIDPasswordAgain,
          });
        }
        const token = await createJwt(data.userId);
        let nickname = null;
        if (!data.nickname) {
          nickname = getRandomNickname();
        }
        return res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.loginSuccess,
          data: { token, nickname },
        });
      });
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
        await User.restartSignIn(req).then(async (data) => {
          const token = await createJwt(data[0].user_id);
          let nickname = null;
          if (!data[0].nickname) {
            nickname = getRandomNickname();
          }
          return res.status(StatusCode.OK).json({
            success: true,
            message: SuccessMessage.loginSuccess,
            data: {
              token,
              pushState: data[0].push_state,
              nickname,
            },
          });
        });
      } else {
        throw new NotFound(ErrorMessage.unValidateVerificationCode);
      }
    } catch (err) {
      next(err);
    }
  },
  refreshToken: async function (req, res, next) {
    try {
      if (!req.body.accessToken && !req.body.refreshToken) {
        throw new BadRequest(ErrorMessage.tokenBadRequest);
      }

      await verifyRefresh(req).then((token) => {
        return res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.refreshTokenSuccess,
          data: {
            token,
          },
        });
      });
    } catch (err) {
      next(err);
    }
  },
};
