const authController = require('../controllers/authController');
const { verifyToken, getOsType } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();

router.post('/signin', getOsType, authController.signIn);
router.post('/signup', getOsType, authController.signUp);
router.post('/logout', verifyToken, authController.logout);
router.post('/check-email', authController.checkEmail);
router.post('/password-mail', authController.sendMail);
router.post('/re-signin', getOsType, authController.restartSignIn);
router.post('/refresh', authController.refreshToken);

module.exports = router;
