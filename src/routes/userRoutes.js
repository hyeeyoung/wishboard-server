const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");
var router = require("express").Router();

router.delete("/", verifyToken, userController.deleteUserOne);
router.put("/", verifyToken, userController.updateUserInfo);
router.put("/image", verifyToken, userController.updateUserImage);
router.put("/nickname", verifyToken, userController.updateUserNickname);
// router.put("/fcm", userController.updateUserFCMToken); // TODO
router.get("/", verifyToken, userController.selectUserInfo);

module.exports = router;
