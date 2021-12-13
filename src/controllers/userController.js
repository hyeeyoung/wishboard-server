const User = require("../models/user");
const logger = require("../config/winston");

const TAG = "userController ";

module.exports = {
  deleteUserOne: async function (req, res) {
    await User.deleteUser(req)
      .then((result) => {
        if (!result) {
          res.status(404).json({
            success: false,
            message: "이미 삭제된 유저 입니다.",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "유저 삭제 성공",
          });
        }
      })
      .catch((err) => {
        logger.error(TAG + err);
        res.status(500).json({
          success: false,
          message: "wishboard 서버 에러",
        });
      });
  },
  updateUserInfo: async function (req, res) {
    if (!req.body.nickname || !req.body.profile_img)
      return res.status(400).json({
        success: false,
        message: "잘못된 요청입니다.",
      });
    await User.updateInfo(req)
      .then((result) => {
        if (!result) {
          res.status(404).json({
            success: false,
            message: "유저 정보를 수정할 수 없습니다.",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "유저 정보 수정 성공",
          });
        }
      })
      .catch((err) => {
        logger.error(TAG + err);
        res.status(500).json({
          success: false,
          message: "wishboard 서버 에러",
        });
      });
  },
  updateUserImage: async function (req, res) {
    if (!req.body.profile_img)
      return res.status(400).json({
        success: false,
        message: "잘못된 요청입니다.",
      });
    await User.updateImage(req)
      .then((result) => {
        if (!result) {
          res.status(404).json({
            success: false,
            message: "프로필 이미지를 수정할 수 없습니다.",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "프로필 이미지 수정 성공",
          });
        }
      })
      .catch((err) => {
        logger.error(TAG + err);
        res.status(500).json({
          success: false,
          message: "wishboard 서버 에러",
        });
      });
  },
  updateUserNickname: async function (req, res) {
    if (!req.body.nickname)
      return res.status(400).json({
        success: false,
        message: "잘못된 요청입니다.",
      });
    await User.updateNickname(req)
      .then((result) => {
        if (!result) {
          res.status(404).json({
            success: false,
            message: "닉네임을 수정할 수 없습니다.",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "닉네임 수정 성공",
          });
        }
      })
      .catch((err) => {
        logger.error(TAG + err);
        res.status(500).json({
          success: false,
          message: "wishboard 서버 에러",
        });
      });
  },
  // updateUserFCMToken: async function (req, res) { // TODO
  //   await User.updateFCM(req).then().catch();
  // },
  selectUserInfo: async function (req, res) {
    await User.selectInfo(req)
      .then((result) => {
        logger.info(TAG + result);
        res.status(200).json(result);
      })
      .catch((err) => {
        logger.error(TAG + err);
        res.status(500).json({
          success: false,
          message: "wishboard 서버 에러",
        });
      });
  },
};
