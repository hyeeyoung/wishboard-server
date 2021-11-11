const itemController = require("../controllers/itemController");
var router = require("express").Router();

// /api/:~ 방식은 pathVaild 방식 -> req.params.변수명 로 접근
// /api/:~? 방식은 queryString 방식 -> req.query.변수명 로 접근
router.post("/", itemController.insertItemInfo);
router.get("/home/:user_id", itemController.selectHomeItemInfo); //기존 : /item/home/:user_id
router.get("/detail/:item_id", itemController.selectItemDetailInfo); //기존 : /item/detail/:user_id
router.put("/detail/:item_id", itemController.updateItemDetailInfo); //기존 : /item/detail/:user_id
router.delete("/detail/:item_id", itemController.deleteItemDetailInfo); //기존 : /item/detail/:user_id

module.exports = router;
