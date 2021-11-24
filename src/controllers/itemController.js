const Items = require("../models/item");

module.exports = {
  insertItemInfo: async function (req, res) {
    if (!req.body.item_image) {
      return res.status(400).json({
        success: false,
        message: "이미지 정보가 없습니다",
      });
    }

    await Items.insertItem(req)
      .then((result) => {
        res.status(200).json({
          success: true,
          data: result.insertId,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  selectHomeItemInfo: async function (req, res) {
    await Items.selectItems(req)
      .then((result) => {
        if (result.length === 0) {
          res.status(404).json({
            success: false,
            message: "아이템 정보가 없습니다.",
          });
        } else {
          console.log("rows : " + JSON.stringify(result));
          res.status(200).json(result);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "wishboard 서버 에러",
        });
      });
  },
  selectItemDetailInfo: async function (req, res) {
    await Items.selectItemsDetail(req)
      .then((result) => {
        if (result.length > 0) {
          console.log("rows : " + JSON.stringify(result));
          res.status(200).json(result[0]);
        } else {
          res.status(404).json({
            success: false,
            message: "아이템 정보가 없습니다.",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "wishboard 서버 에러",
        });
      });
  },
  updateItemDetailInfo: async function (req, res) {
    await Items.updateItemsDetail(req)
      .then((result) => {
        if (result.length === 0) {
          console.log("Failed to updated the items for data.");
          res.status(400).json({
            success: false,
            message: "수정한 아이템이 없습니다.",
          });
        } else {
          console.log("Successfully updated data into the items!!");
          res.status(200).json({
            success: true,
            message: "아이템 수정 성공",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      });
  },
  deleteItemDetailInfo: async function (req, res) {
    await Items.deleteItems(req)
      .then((result) => {
        if (result.length === 0) {
          console.log("Failed to deleted the items for data.");
          res.status(400).json({
            success: false,
            message: "삭제할 아이템이 없습니다.",
          });
        } else {
          console.log("Successfully deleted data into the items!!");
          res.status(200).json({
            success: true,
            message: "아이템 삭제 성공",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      });
  },
};
