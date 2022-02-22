const Cart = require('../models/cart');
const {
  StatusCode,
  SuccessMessage,
  ErrorMessage,
} = require('../utils/response');
const { BadRequest } = require('../utils/errors');

module.exports = {
  selectCartInfo: async function (req, res, next) {
    await Cart.selectCart(req)
      .then((result) => {
        res.status(StatusCode.OK).json(result);
      })
      .catch((err) => {
        next(err);
      });
  },
  insertCartInfo: async function (req, res, next) {
    try {
      if (!req.body.item_id) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      const result = await Cart.insertCart(req);
      if (result) {
        res.status(StatusCode.CREATED).json({
          success: true,
          message: SuccessMessage.cartInsert,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  updateCartInfo: async function (req, res, next) {
    try {
      if (!req.body.item_count) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      const result = await Cart.updateCart(req);
      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.cartUpdate,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  deleteCartInfo: async function (req, res, next) {
    await Cart.deleteCart(req)
      .then(() => {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.cartDelete,
        });
      })
      .catch((err) => {
        next(err);
      });
  },
};
