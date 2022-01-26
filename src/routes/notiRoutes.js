const notiController = require('../controllers/notiController');
const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();

router.post('/', verifyToken, notiController.insertNotiInfo);
router.get('/', verifyToken, notiController.selectNotiInfo);
router.put('/:item_id', verifyToken, notiController.updateNotiInfo);
router.put(
  '/:item_id/read-state',
  verifyToken,
  notiController.updateNotiReadStateInfo,
);
router.delete('/:item_id', verifyToken, notiController.deleteNotiInfo);

module.exports = router;
