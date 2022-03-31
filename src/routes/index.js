const express = require('express');
const router = new express.Router();

router.get('/', (req, res) => res.send('Welcome to WishBoard!!'));

router.use('/auth', require('./authRoutes'));
router.use('/user', require('./userRoutes'));
router.use('/item', require('./itemRoutes'));
router.use('/cart', require('./cartRoutes'));
router.use('/folder', require('./folderRoutes'));
router.use('/noti', require('./notiRoutes'));

module.exports = router;
