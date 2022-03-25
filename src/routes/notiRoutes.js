const notiController = require('../controllers/notiController');
const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();

router.get('/', verifyToken, notiController.selectNotiInfo);
router.get('/calendar', verifyToken, notiController.selectCalendar); //* 배포 이후 query parameter로 월별 조회
router.put(
  '/:item_id/read-state',
  verifyToken,
  notiController.updateNotiReadStateInfo,
);
module.exports = router;
