const Items = require("../models/item");
const logger = require("../config/winston");

const TAG = "ItemController ";

module.exports = {
  insertItemInfo: async function (req, res) {
    if (!req.body.item_img) {
      return res.status(400).json({
        success: false,
        message: "이미지 정보가 없습니다",
      });
    }

    await Items.insertItem(req)
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "아이템 추가 성공",
        });
      })
      .catch((err) => {
        logger.error(TAG + err);
      });
  },
  selectHomeItemInfo: async function (req, res) {
    await Items.selectItems(req)
      .then((result) => {
        if (Array.isArray(result) && !result.length) {
          res.status(404).json({
            success: false,
            message: "아이템 정보가 없습니다.",
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
          message: "wishboard 서버 에러",
        });
      });
  },
  selectItemDetailInfo: async function (req, res) {
    await Items.selectItemsDetail(req)
      .then((result) => {
        if (Array.isArray(result) && !result.length) {
          res.status(404).json({
            success: false,
            message: "아이템 정보가 없습니다.",
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
          message: "wishboard 서버 에러",
        });
      });
  },
  updateItemDetailInfo: async function (req, res) {
    if (!req.body.item_img || !req.body.item_name) {
      return res.status(400).json({
        success: false,
        message: "잘못된 요청입니다.",
      });
    }
    await Items.updateItemsDetail(req)
      .then((result) => {
        if (!result) {
          res.status(400).json({
            success: false,
            message: "수정한 아이템이 없습니다.",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "아이템 수정 성공",
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
  deleteItemDetailInfo: async function (req, res) {
    if (!req.body.item_id) {
      return res.status(400).json({
        success: false,
        message: "잘못된 요청입니다.",
      });
    }
    await Items.deleteItems(req)
      .then((result) => {
        if (!result) {
          res.status(400).json({
            success: false,
            message: "삭제할 아이템이 없습니다.",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "아이템 삭제 성공",
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
