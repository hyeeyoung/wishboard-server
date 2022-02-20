const notiController = require('../controllers/notiController');
const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();

router.get('/', verifyToken, notiController.selectNotiInfo);
router.put(
  '/:item_id/read-state',
  verifyToken,
  notiController.updateNotiReadStateInfo,
);
router.get('/schedule', verifyToken, notiController.scheduleSettings); // /noti/schedule?push=true/false

module.exports = router;
