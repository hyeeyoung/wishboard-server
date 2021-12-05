const itemController = require("../controllers/itemController");
const { verifyToken } = require("../middleware/auth");
var router = require("express").Router();

// /api/:~ 방식은 pathVaild 방식 -> req.params.변수명 로 접근
// /api/:~? 방식은 queryString 방식 -> req.query.변수명 로 접근
router.post("/", verifyToken, itemController.insertItemInfo);
router.get("/home", verifyToken, itemController.selectHomeItemInfo);
router.get("/detail/:item_id", itemController.selectItemDetailInfo);
router.put("/detail/:item_id", itemController.updateItemDetailInfo);
router.delete("/detail", itemController.deleteItemDetailInfo);

module.exports = router;
