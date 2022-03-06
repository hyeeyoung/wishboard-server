const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();

router.put('/active', verifyToken, userController.unActiveUserOne);
router.put('/', verifyToken, userController.updateUserInfo);
router.put('/fcm', verifyToken, userController.updateUserFCMToken);
router.get('/', verifyToken, userController.selectUserInfo);

module.exports = router;
