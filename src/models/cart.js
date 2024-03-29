const db = require('../config/db');
const { CartItem } = require('../dto/cartResponse');
const { NotFound } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');

module.exports = {
  selectCart: async function (req) {
    const userId = Number(req.decoded);

    const sqlSelect = `SELECT i.folder_id, ifNull(f.folder_name, "") folder_name, i.item_id, i.item_img_url, i.item_name, i.item_price, ifNull(i.item_url, "") item_url, ifNull(i.item_memo, "") item_memo, 
    CAST(i.create_at AS CHAR) create_at, n.item_notification_type, CAST(n.item_notification_date AS CHAR(16)) item_notification_date, IF(c.item_id IS NULL, false, true) as cart_state, c.item_count item_count
    FROM items i LEFT OUTER JOIN notifications n 
    ON i.item_id = n.item_id  
    LEFT OUTER JOIN (SELECT DISTINCT folder_id, folder_name FROM folders) f 
    ON i.folder_id = f.folder_id 
    INNER JOIN cart c
    on i.item_id = c.item_id 
    WHERE i.user_id = ? ORDER BY c.create_at DESC;`;

    const [rows] = await db.query(sqlSelect, [userId]);

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.cartNotFound);
    }
    const cartItems = [];
    rows.forEach((row) => {
      cartItems.push(new CartItem().convertToCartItem(row));
    });
    return cartItems;
  },
  insertCart: async function (req) {
    const userId = Number(req.decoded);
    const itemId = Number(req.body.item_id);

    const sqlInsert =
      'INSERT INTO cart (user_id, item_id, item_count) VALUES (?, ?, 1)';
    const params = [userId, itemId];

    const [rows] = await db.queryWithTransaction(sqlInsert, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.cartInsert);
    }
    return true;
  },
  updateCart: async function (req) {
    const userId = Number(req.decoded);
    const itemId = Number(req.params.item_id);
    const itemCount = Number(req.body.item_count);

    const sqlUpdate =
      'UPDATE cart SET item_count = ? WHERE item_id = ? AND user_id = ?';
    const params = [itemCount, itemId, userId];

    const [rows] = await db.queryWithTransaction(sqlUpdate, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.cartUpdate);
    }
    return true;
  },
  deleteCart: async function (req) {
    const userId = Number(req.decoded);
    const itemId = Number(req.params.item_id);

    const sqlDelete = 'DELETE FROM cart WHERE user_id = ? AND item_id = ?';
    const params = [userId, itemId];

    const [rows] = await db.queryWithTransaction(sqlDelete, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.cartDelete);
    }
    return true;
  },
};
