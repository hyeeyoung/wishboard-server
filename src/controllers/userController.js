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
      if (!req.body.nickname && !req.file) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }

      const isValidate = await User.validateNickname(req);

      if (!isValidate) {
        if (req.body.nickname && !req.file) {
          await User.updateNickname(req).then(() => {
            res.status(StatusCode.OK).json({
              success: true,
              message: SuccessMessage.userNickNameUpdate,
            });
          });
        } else if (req.body.nickname && req.file) {
          await User.updateInfo(req).then(() => {
            res.status(StatusCode.OK).json({
              success: true,
              message: SuccessMessage.userInfoUpdate,
            });
          });
        }
      } else {
        if (req.file) {
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
  // updateUserFCMToken: async function (req, res, next) {
  //   await User.updateFCM(req)
  //     .then(() => {
  //       res.status(StatusCode.OK).json({
  //         success: true,
  //         message: SuccessMessage.userFcmTokenUpdate,
  //       });
  //     })
  //     .catch((err) => {
  //       next(err);
  //     });
  // },
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
      await User.updatePassword(req).then(() => {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.userPasswordUpdate,
        });
      });
    } catch (err) {
      next(err);
    }
  },
  updateUserPushState: async function (req, res, next) {
    const pushState = req.params.push === 'true' ? true : false;
    await User.updatePushState(req, pushState)
      .then(() => {
        if (pushState) {
          res.status(StatusCode.OK).json({
            success: true,
            message: SuccessMessage.notiPushServiceStart,
          });
        } else {
          res.status(StatusCode.OK).json({
            success: true,
            message: SuccessMessage.notiPushServiceExit,
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  },
  deleteUser: async function (req, res, next) {
    await User.deleteUser(req)
      .then(() => {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.userDelete,
        });
      })
      .catch((err) => {
        next(err);
      });
  },
};
