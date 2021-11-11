const userController = require("../controllers/userController");
var router = require("express").Router();

router.post("/signup", userController.userSignUp);
router.post("/signin", userController.userSignIn);
//@todo : 유저 삭제에 대한 api 추가하긴

module.exports = router;
