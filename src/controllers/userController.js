const User = require('../models/user');
const { BadRequest } = require('../utils/errors');
const {
  StatusCode,
  SuccessMessage,
  ErrorMessage,
} = require('../utils/response');

module.exports = {
  unActiveUserOne: async function (req, res, next) {
    try {
      await User.unActiveUserOne(req).then(() => {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.userActiveUpdate,
        });
      });
    } catch (err) {
      next(err);
    }
  },
  updateUserInfo: async function (req, res, next) {
    try {
      if (!req.body.nickname && !req.body.profile_img) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }

      const isValidate = await User.validateNickname(req);

      if (!isValidate) {
        if (req.body.nickname && !req.body.profile_img) {
          await User.updateNickname(req).then(() => {
            res.status(StatusCode.OK).json({
              success: true,
              message: SuccessMessage.userNickNameUpdate,
            });
          });
        } else if (req.body.nickname && req.body.profile_img) {
          await User.updateInfo(req).then(() => {
            res.status(StatusCode.OK).json({
              success: true,
              message: SuccessMessage.userInfoUpdate,
            });
          });
        }
      } else {
        if (req.body.profile_img) {
          await User.updateImage(req).then(() => {
            res.status(StatusCode.OK).json({
              success: true,
              message: SuccessMessage.userProfileImgUpdate,
            });
          });
        }
      }
    } catch (err) {
      next(err);
    }
  },
  updateUserFCMToken: async function (req, res, next) {
    await User.updateFCM(req)
      .then(() => {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.userFcmTokenUpdate,
        });
      })
      .catch((err) => {
        next(err);
      });
  },
  selectUserInfo: async function (req, res, next) {
    await User.selectInfo(req)
      .then((result) => {
        res.status(StatusCode.OK).json(result);
      })
      .catch((err) => {
        next(err);
      });
  },
  updateUserPassword: async function (req, res, next) {
    try {
      if (!req.body.email || !req.body.password) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      await User.updatePasswrod(req).then(() => {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.userPasswordUpdate,
        });
      });
    } catch (err) {
      next(err);
    }
  },
};
