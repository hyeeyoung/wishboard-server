const authController = require("../controllers/authController");
var router = require("express").Router();

router.post("/signin", authController.signIn);
router.post("/signup", authController.signUp);

module.exports = router;
