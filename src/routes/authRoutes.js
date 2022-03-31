const authController = require('../controllers/authController');
const express = require('express');
const router = new express.Router();

router.post('/signin', authController.signIn);
router.post('/signup', authController.signUp);
router.post('/check-email', authController.checkEmail);
router.post('/password-mail', authController.sendMail);
router.post('/re-signin', authController.restartSignIn);

module.exports = router;
