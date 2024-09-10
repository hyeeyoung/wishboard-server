const versionController = require('../controllers/versionController');
const express = require('express');
const router = new express.Router();

router.get('/check', versionController.checkVersion);
router.get('/', versionController.getVersions);
router.put('/', versionController.updateVersion);

module.exports = router;
