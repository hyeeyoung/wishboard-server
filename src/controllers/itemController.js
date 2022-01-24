const Items = require('../models/item');
const logger = require('../config/winston');
const { BadRequest } = require('../utils/errors');
const {
  StatusCode,
  SuccessMessage,
  ErrorMessage,
} = require('../utils/response');

const TAG = 'ItemController ';

module.exports = {
  insertItemInfo: async function (req, res, next) {
    try {
      if (!req.body.item_name) {
        throw new BadRequest(ErrorMessage.itemNameMiss);
      }

      await Items.insertItem(req).then((result) => {
        if (result) {
          res.status(StatusCode.CREATED).json({
            success: true,
            message: SuccessMessage.itemInsert,
          });
        }
      });
    } catch (err) {
      next(err);
    }
  },
  selectItemInfo: async function (req, res, next) {
    await Items.selectItems(req)
      .then((result) => {
        logger.info(TAG + result);
        res.status(StatusCode.OK).json(result);
      })
      .catch((err) => {
        next(err);
      });
  },
  updateItemInfo: async function (req, res, next) {
    try {
      if (!req.body.item_img || !req.body.item_name) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      await Items.updateItems(req).then((result) => {
        if (result) {
          res.status(StatusCode.OK).json({
            success: true,
            message: SuccessMessage.itemUpdate,
          });
        }
      });
    } catch (err) {
      next(err);
    }
  },
  deleteItemInfo: async function (req, res, next) {
    try {
      if (!req.body.item_id) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      await Items.deleteItems(req).then((result) => {
        if (result) {
          res.status(StatusCode.OK).json({
            success: true,
            message: SuccessMessage.itemDelete,
          });
        }
      });
    } catch (err) {
      next(err);
    }
  },
};
