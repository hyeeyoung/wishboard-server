const itemController = require("../controllers/itemController");
const { verifyToken } = require("../middleware/auth");
var router = require("express").Router();

router.post("/", verifyToken, itemController.insertItemInfo);
router.get("/", verifyToken, itemController.selectItemInfo);
router.put("/:item_id", verifyToken, itemController.updateItemInfo);
router.delete("/", verifyToken, itemController.deleteItemInfo);

module.exports = router;
