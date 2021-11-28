const cartController = require("../controllers/cartController");
var router = require("express").Router();

router.get("/:user_id", cartController.selectCartInfo);
router.post("/", cartController.insertCartInfo);
router.put("/", cartController.updateCartInfo);
router.delete("/", cartController.deleteCartInfo);

module.exports = router;
