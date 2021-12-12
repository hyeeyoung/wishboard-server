const Folders = require("../models/folder");
const logger = require("../config/winston");

const TAG = "folderController ";

module.exports = {
  selectFolderInfo: async function (req, res) {
    await Folders.selectFolder(req)
      .then((result) => {
        if (result.length === 0) {
          res.status(404).json({
            success: false,
            message: "폴더 정보가 없습니다.",
          });
        } else {
          logger.info(TAG + result);
          res.status(200).json(result);
        }
      })
      .catch((err) => {
        logger.error(TAG + err);
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      });
  },
  selectFolderList: async function (req, res) {
    await Folders.selectFolderList(req)
      .then((result) => {
        if (result.length === 0) {
          res.status(404).json({
            success: false,
            message: "폴더 리스트 정보가 없습니다.",
          });
        } else {
          logger.info(TAG + result);
          res.status(200).json(result);
        }
      })
      .catch((err) => {
        logger.error(TAG + err);
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      });
  },
  selectFolderItemInfo: async function (req, res) {
    await Folders.selectFolderItems(req)
      .then((result) => {
        if (result.length === 0) {
          res.status(404).json({
            success: false,
            message: "폴더 내 아이템 정보가 없습니다.",
          });
        } else {
          logger.info(TAG + result);
          res.status(200).json(result);
        }
      })
      .catch((err) => {
        logger.error(TAG + err);
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      });
  },
  insertFolder: async function (req, res) {
    await Folders.insertFolder(req)
      .then((result) => {
        if (result.length === 0) {
          res.status(404).json({
            success: false,
            message: "폴더를 추가할 수 없습니다.",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "폴더 데이터베이스 추가 성공",
          });
        }
      })
      .catch((err) => {
        logger.error(TAG + err);
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      });
  },
  updateFolder: async function (req, res) {
    await Folders.updateFolder(req)
      .then((result) => {
        if (result.length === 0) {
          res.status(404).json({
            success: false,
            message: "폴더명을 수정할 수 없습니다.",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "폴더명 수정 성공",
          });
        }
      })
      .catch((err) => {
        logger.error(TAG + err);
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      });
  },
  updateFolderImage: async function (req, res) {
    await Folders.updateFolderImage(req)
      .then((result) => {
        if (result.length === 0) {
          res.status(404).json({
            success: false,
            message: "폴더 이미지 수정할 수 없습니다.",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "폴더 이미지 수정 성공",
          });
        }
      })
      .catch((err) => {
        logger.error(TAG + err);
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      });
  },
  deleteFolder: async function (req, res) {
    await Folders.deleteFolder(req)
      .then((result) => {
        if (result.length === 0) {
          res.status(404).json({
            success: false,
            message: "폴더를 삭제할 수 없습니다.",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "폴더 삭제 성공",
          });
        }
      })
      .catch((err) => {
        logger.error(TAG + err);
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      });
  },
};
