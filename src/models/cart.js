const pool = require("../config/db");
const { CartResponse } = require("../dto/cartResponse");
const { NotFound } = require("../utils/errors");
const { ErrorMessage } = require("../utils/response");

module.exports = {
  selectCart: async function (req) {
    var userId = Number(req.decoded);

    var sqlSelect = `SELECT i.folder_id, f.folder_name, i.item_id, i.item_img, i.item_name, i.item_price, i.item_url, i.item_memo, 
    CAST(i.create_at AS CHAR(10)) create_at, n.item_notification_type, CAST(n.item_notification_date AS CHAR(16)) item_notification_date, IF(c.item_id IS NULL, false, true) as cart_state, c.item_count item_count
    FROM items i LEFT OUTER JOIN notification n 
    ON i.item_id = n.item_id  
    LEFT OUTER JOIN (SELECT DISTINCT folder_id, folder_name FROM folders) f 
    ON i.folder_id = f.folder_id 
    INNER JOIN cart c
    on i.item_id = c.item_id 
    WHERE i.user_id = ? ORDER BY i.create_at DESC;`;

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, userId);
    connection.release();

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.cartNotFound);
    }

    const cartResponse = new CartResponse().convertToResponse(rows);
    return cartResponse;
  },
  insertCart: async function (req) {
    var userId = Number(req.decoded);
    var itemId = Number(req.body.item_id);

    var sqlInsert =
      "INSERT INTO cart (user_id, item_id, item_count) VALUES (?, ?, 1)";
    var params = [userId, itemId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlInsert, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.cartInsertError);
    }
    return true;
  },
  updateCart: async function (req) {
    var userId = Number(req.decoded);
    var sqlUpdate = "UPDATE cart SET item_count = CASE ";
    var params = [];

    for (var i = 0; i < Object.keys(req.body).length; i++) {
      sqlUpdate += "WHEN item_id = ? then ? ";
      params.push(req.body[i].item_id);
      params.push(req.body[i].item_count);
      if (i === Object.keys(req.body).length - 1) {
        //마지막 원소라면
        sqlUpdate += "ELSE item_count END WHERE user_id = ?";
        params.push(userId);
      }
    }

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.cartUpdateError);
    }
    return true;
  },
  deleteCart: async function (req) {
    var userId = Number(req.decoded);
    var itemId = Number(req.body.item_id);

    var sqlDelete = "DELETE FROM cart WHERE user_id = ? AND item_id = ?";
    var params = [userId, itemId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlDelete, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.cartDeleteError);
    }
    return true;
  },
};
