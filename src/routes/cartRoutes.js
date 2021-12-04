const cartController = require("../controllers/cartController");
const { verifyToken } = require("../middleware/auth");
var router = require("express").Router();

router.get("/", verifyToken, cartController.selectCartInfo);
router.post("/", verifyToken, cartController.insertCartInfo);
router.put("/", verifyToken, cartController.updateCartInfo);
router.delete("/", verifyToken, cartController.deleteCartInfo);

module.exports = router;
