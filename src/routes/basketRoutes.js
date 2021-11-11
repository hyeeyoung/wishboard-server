const basketController = require("../controllers/baketController");
var router = require("express").Router();

router.get("/:user_id", basketController.selectBaksetInfo);
router.post("/", basketController.insertBaksetInfo);
router.put("/", basketController.updateBaksetInfo);
router.delete("/", basketController.deleteBaksetInfo);

module.exports = router;
