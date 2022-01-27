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
); // TODO 필요 없어 보이나 아직 프론트 폴더 작업 진행 전이니 보류
router.post('/', verifyToken, folderController.insertFolder);
router.put('/:folder_id', verifyToken, folderController.updateFolder);
router.put('/image/:folder_id', folderController.updateFolderImage); // TODO 필요 없어 보이나 아직 프론트 폴더 작업 진행 전이니 보류
router.delete('/:folder_id', folderController.deleteFolder);

module.exports = router;
