const itemController = require('../controllers/itemController');
const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();
const multer = require('../config/multer');

router.post(
  '/',
  verifyToken,
  multer.upload.single('item_img'),
  itemController.insertItemInfo,
);
router.get('/', verifyToken, itemController.selectItemInfo);
router.get('/:item_id', verifyToken, itemController.selectItemDetailInfo);
router.get('/latest', verifyToken, itemController.selectItemLatest);
router.get('/parse', itemController.parseItemInfo);
router.put(
  '/:item_id',
  verifyToken,
  multer.upload.single('item_img'),
  itemController.updateItemInfo,
);
router.put(
  '/:item_id/folder/:folder_id',
  verifyToken,
  itemController.updateItemToFolder,
);
router.delete('/:item_id', verifyToken, itemController.deleteItemInfo);

module.exports = router;
