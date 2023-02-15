const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();

router.post('/signin', authController.signIn);
router.post('/signup', authController.signUp);
router.post('/logout', verifyToken, authController.logout);
router.post('/check-email', authController.checkEmail);
router.post('/password-mail', authController.sendMail);
router.post('/re-signin', authController.restartSignIn);
router.post('/refresh', authController.refreshToken);

module.exports = router;
