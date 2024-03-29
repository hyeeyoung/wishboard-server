const folderController = require('../controllers/folderController');
const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();

router.get('/', verifyToken, folderController.selectFolderInfo);
router.get('/list', verifyToken, folderController.selectFolderList);
router.get(
  '/item/:folder_id',
  verifyToken,
  folderController.selectFolderItemInfo,
);
router.post('/', verifyToken, folderController.insertFolder);
router.put('/:folder_id', verifyToken, folderController.updateFolder);
router.delete('/:folder_id', verifyToken, folderController.deleteFolder);

module.exports = router;
