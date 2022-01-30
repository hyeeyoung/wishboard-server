const User = require('../models/user');
const logger = require('../config/winston');
const { BadRequest } = require('../utils/errors');
const {
  StatusCode,
  SuccessMessage,
  ErrorMessage,
} = require('../utils/response');

const TAG = 'userController ';

module.exports = {
  deleteUserOne: async function (req, res, next) {
    try {
      await User.deleteUser(req).then(() => {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.userDelete,
        });
      });
    } catch (err) {
      next(err);
    }
  },
  updateUserInfo: async function (req, res, next) {
    try {
      if (!req.body.nickname || !req.body.profile_img) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      await User.updateInfo(req).then(() => {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.userInfoUpdate,
        });
      });
    } catch (err) {
      next(err);
    }
  },
  updateUserImage: async function (req, res, next) {
    try {
      if (!req.body.profile_img) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      await User.updateImage(req).then(() => {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.userProfileImgUpdate,
        });
      });
    } catch (err) {
      next(err);
    }
  },
  updateUserNickname: async function (req, res, next) {
    try {
      if (!req.body.nickname) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      await User.updateNickname(req).then(() => {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.userNickNameUpdate,
        });
      });
    } catch (err) {
      next(err);
    }
  },
  updateUserFCMToken: async function (req, res, next) {
    try {
      if (!req.body.fcm_token) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      await User.updateFCM(req).then(() => {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.userFcmTokenUpdate,
        });
      });
    } catch (err) {
      next(err);
    }
  },
  selectUserInfo: async function (req, res, next) {
    await User.selectInfo(req)
      .then((result) => {
        logger.info(TAG + result);
        res.status(StatusCode.OK).json(result);
      })
      .catch((err) => {
        next(err);
      });
  },
};
