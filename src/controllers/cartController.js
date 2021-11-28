const Cart = require("../models/cart");

module.exports = {
  selectCartInfo: async function (req, res) {
    await Cart.selectCart(req)
      .then((result) => {
        if (result.length === 0) {
          console.log("Failed to selected the cart for data.");
          res.status(404).json({
            success: false,
            message: "장바구니 정보 없습니다.",
          });
        } else {
          console.log("Successfully selected data the cart!!");
          res.status(200).json(result);
          console.log(result);
        }
      })
      .catch((err) => {
        console.log(err);
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
          console.log("Failed to inserted the cart for data.");
          res.status(404).json({
            success: false,
            message: "장바구니에 추가할 수 없습니다.",
          });
        } else {
          console.log("Successfully inserted data into the cart!!");
          res.status(200).json({
            success: true,
            message: "장바구니에 아이템 추가 성공",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        if ((err.code = "ER_DUP_ENTRY")) {
          res.status(404).json({
            success: false,
            message: "이미 장바구니에 존재합니다.",
          });
        } else {
          res.status(500).json({
            success: false,
            message: "wish boarad 서버 에러",
          });
        }
      });
  },
  updateCartInfo: async function (req, res) {
    await Cart.updateCart(req)
      .then((result) => {
        if (result.length === 0) {
          console.log("Failed to updated the cart for data.");
          res.status(404).json({
            success: false,
            message: "장바구니를 수정할 수 없습니다.",
          });
        } else {
          console.log("Successfully updated data into the cart!!");
          res.status(200).json({
            success: true,
            message: "장바구니 아이템 수정 성공",
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
  deleteCartInfo: async function (req, res) {
    await Cart.deleteCart(req)
      .then((result) => {
        if (result.length === 0) {
          console.log("Failed to deleted the cart for data.");
          res.status(404).json({
            success: false,
            message: "장바구니 아이템을 삭제할 수 없습니다.",
          });
        } else {
          console.log("Successfully deleted data into the cart!!");
          res.status(200).json({
            success: true,
            message: "장바구니 아이템 삭제 성공",
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
