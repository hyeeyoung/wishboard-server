const express = require('express');
const router = new express.Router();
const logger = require('../config/winston');

router.use((req, res, next) => {
  const cloneBody = req.body;
  if (cloneBody.password) {
    cloneBody.password = 'None record data. - wishbaord server';
  }
  logger.info(`----- Request -----
    Headers: ${JSON.stringify(req.headers)}
    Query: ${JSON.stringify(req.query)}
    Params: ${JSON.stringify(req.params)}
    Body: ${JSON.stringify(cloneBody)}
    -------------------`);
  next();
});

router.get('/', (req, res) => res.send('Welcome to WishBoard!!'));

router.use('/version', require('./versionRoutes'));
router.use('/auth', require('./authRoutes'));
router.use('/user', require('./userRoutes'));
router.use('/item', require('./itemRoutes'));
router.use('/cart', require('./cartRoutes'));
router.use('/folder', require('./folderRoutes'));
router.use('/noti', require('./notiRoutes'));

module.exports = router;
