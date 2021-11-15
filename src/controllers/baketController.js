const Basket = require("../models/basket");

module.exports = {
  selectBaksetInfo: async function (req, res) {
    await Basket.selectBasket(req)
      .then((result) => {
        if (result.length === 0) {
          console.log("Failed to selected the basket for data.");
          res.status(404).json({
            success: false,
            message: "장바구니 정보 없습니다.",
          });
        } else {
          console.log("Successfully selected data the basket!!");
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
  insertBaksetInfo: async function (req, res) {
    await Basket.insertBasket(req)
      .then((result) => {
        if (result.length === 0) {
          console.log("Failed to inserted the basket for data.");
          res.status(404).json({
            success: false,
            message: "장바구니에 추가할 수 없습니다.",
          });
        } else {
          console.log("Successfully inserted data into the basket!!");
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
  updateBaksetInfo: async function (req, res) {
    await Basket.updateBasket(req)
      .then((result) => {
        if (result.length === 0) {
          console.log("Failed to updated the basket for data.");
          res.status(404).json({
            success: false,
            message: "장바구니를 수정할 수 없습니다.",
          });
        } else {
          console.log("Successfully updated data into the basket!!");
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
  deleteBaksetInfo: async function (req, res) {
    await Basket.deleteBasket(req)
      .then((result) => {
        if (result.length === 0) {
          console.log("Failed to deleted the basket for data.");
          res.status(404).json({
            success: false,
            message: "장바구니 아이템을 삭제할 수 없습니다.",
          });
        } else {
          console.log("Successfully deleted data into the basket!!");
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
