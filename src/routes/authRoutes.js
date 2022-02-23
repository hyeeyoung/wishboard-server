const authController = require('../controllers/authController');
const express = require('express');
const router = new express.Router();

router.post('/signin', authController.signIn);
router.post('/signup', authController.signUp);
router.post('/mail', authController.sendMail);

module.exports = router;
