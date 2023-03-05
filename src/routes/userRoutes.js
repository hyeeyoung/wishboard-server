const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();
const multer = require('../config/multer');

router.put('/active', verifyToken, userController.unActiveUserOne);
router.put(
  '/',
  verifyToken,
  multer.upload.single('profile_img'),
  userController.updateUserInfo,
);
// router.put('/fcm', verifyToken, userController.updateUserFCMToken);
router.put('/re-passwd', verifyToken, userController.updateUserPassword);
router.put(
  '/push-state/:push',
  verifyToken,
  userController.updateUserPushState,
);
router.get('/', verifyToken, userController.selectUserInfo);
router.delete('/', verifyToken, userController.deleteUser);

module.exports = router;
