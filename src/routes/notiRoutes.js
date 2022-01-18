const notiController = require("../controllers/notiController");
const { verifyToken } = require("../middleware/auth");
var router = require("express").Router();

router.post("/", verifyToken, notiController.insertNotiInfo);
router.get("/", verifyToken, notiController.selectNotiInfo);
router.put("/", verifyToken, notiController.updateNotiInfo);
router.put("/readstate", verifyToken, notiController.updateNotiReadStateInfo);
router.delete("/", verifyToken, notiController.deleteNotiInfo);

module.exports = router;
