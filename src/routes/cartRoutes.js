const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();

router.get('/', verifyToken, cartController.selectCartInfo);
router.post('/', verifyToken, cartController.insertCartInfo);
router.put('/:item_id', verifyToken, cartController.updateCartInfo);
router.delete('/:item_id', verifyToken, cartController.deleteCartInfo);

module.exports = router;
