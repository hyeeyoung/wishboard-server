const Cart = require("../models/cart");
const logger = require("../config/winston");

const TAG = "cartContoller ";

module.exports = {
  selectCartInfo: async function (req, res) {
    await Cart.selectCart(req)
      .then((result) => {
        if (result.length === 0) {
          res.status(404).json({
            success: false,
            message: "장바구니 정보 없습니다.",
          });
        } else {
          logger.info(TAG + result);
          res.status(200).json(result);
        }
      })
      .catch((err) => {
        logger.error(TAG + err);
        res.status(404).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      });
  },
  insertCartInfo: async function (req, res) {
    await Cart.insertCart(req)
      .then((result) => {
        if (result.length === 0) {
          res.status(404).json({
            success: false,
            message: "장바구니에 추가할 수 없습니다.",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "장바구니에 아이템 추가 성공",
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
  updateCartInfo: async function (req, res) {
    await Cart.updateCart(req)
      .then((result) => {
        if (result.length === 0) {
          res.status(404).json({
            success: false,
            message: "장바구니를 수정할 수 없습니다.",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "장바구니 아이템 수정 성공",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      });
  },
  deleteCartInfo: async function (req, res) {
    await Cart.deleteCart(req)
      .then((result) => {
        if (result.length === 0) {
          res.status(404).json({
            success: false,
            message: "장바구니 아이템을 삭제할 수 없습니다.",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "장바구니 아이템 삭제 성공",
          });
        }
      })
      .catch((err) => {
        logger.err(TAG + err);
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      });
  },
};
