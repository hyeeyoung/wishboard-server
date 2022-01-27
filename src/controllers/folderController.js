const Folders = require('../models/folder');
const logger = require('../config/winston');
const { BadRequest } = require('../utils/errors');
const {
  StatusCode,
  SuccessMessage,
  ErrorMessage,
} = require('../utils/response');

const TAG = 'folderController ';

module.exports = {
  selectFolderInfo: async function (req, res, next) {
    await Folders.selectFolder(req)
      .then((result) => {
        logger.info(TAG + result);
        res.status(StatusCode.OK).json(result);
      })
      .catch((err) => {
        next(err);
      });
  },
  selectFolderList: async function (req, res, next) {
    await Folders.selectFolderList(req)
      .then((result) => {
        logger.info(TAG + result);
        res.status(StatusCode.OK).json(result);
      })
      .catch((err) => {
        next(err);
      });
  },
  selectFolderItemInfo: async function (req, res, next) {
    // TODO 필요 없어 보이나 아직 프론트 폴더 작업 진행 전이니 보류
    await Folders.selectFolderItems(req)
      .then((result) => {
        logger.info(TAG + result);
        res.status(StatusCode.OK).json(result);
      })
      .catch((err) => {
        next(err);
      });
  },
  insertFolder: async function (req, res, next) {
    try {
      if (!req.body.folder_name) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      await Folders.insertFolder(req).then((result) => {
        if (result) {
          res.status(StatusCode.CREATED).json({
            success: true,
            message: SuccessMessage.folderInsert,
          });
        }
      });
    } catch (err) {
      next(err);
    }
  },
  updateFolder: async function (req, res, next) {
    try {
      if (!req.body.folder_name) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      await Folders.updateFolder(req).then((result) => {
        if (result) {
          res.status(StatusCode.OK).json({
            success: true,
            message: SuccessMessage.folderNameUpdate,
          });
        }
      });
    } catch (err) {
      next(err);
    }
  },
  updateFolderImage: async function (req, res, next) {
    // TODO 필요 없어 보이나 아직 프론트 폴더 작업 진행 전이니 보류
    await Folders.updateFolderImage(req)
      .then(() => {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.folderImageUpdate,
        });
      })
      .catch((err) => {
        next(err);
      });
  },
  deleteFolder: async function (req, res, next) {
    await Folders.deleteFolder(req)
      .then(() => {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.folderDelete,
        });
      })
      .catch((err) => {
        next(err);
      });
  },
};
