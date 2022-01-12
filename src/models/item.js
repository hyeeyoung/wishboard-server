const { NotFound } = require("../utils/errors");
const { ErrorMessage } = require("../utils/response");
const pool = require("../config/db");

module.exports = {
  insertItem: async function (req) {
    var userId = Number(req.decoded);
    var folderId = req.body.folder_id;

    if (folderId != undefined) {
      folderId = Number(req.body.folder_id);
    }
    var itemImg = req.body.item_img;
    var itemName = req.body.item_name;
    var itemPrice = Number(req.body.item_price);
    var itemUrl = req.body.item_url;
    var itemMemo = req.body.item_memo;

    var sqlInsert =
      "INSERT INTO items (user_id, folder_id, item_img, item_name, item_price, item_url, item_memo) VALUES(?,?,?,?,?,?,?)";

    var params = [
      userId,
      folderId,
      itemImg,
      itemName,
      itemPrice,
      itemUrl,
      itemMemo,
    ];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlInsert, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.itemInsertError);
    }
    return true;
  },
  selectItems: async function (req) {
    var userId = Number(req.decoded);
    var sqlSelect = `SELECT i.folder_id, f.folder_name, i.item_id, i.item_img, i.item_name, i.item_price, i.item_url, i.item_memo, 
      CAST(i.create_at AS CHAR(10)) create_at, n.item_notification_type, CAST(n.item_notification_date AS CHAR(16)) item_notification_date, c.item_id cart_item_id 
      FROM items i LEFT OUTER JOIN notification n 
      ON i.item_id = n.item_id  
      LEFT OUTER JOIN (SELECT DISTINCT folder_id, folder_name FROM folders) f 
      ON i.folder_id = f.folder_id 
      LEFT OUTER JOIN cart c
      on i.item_id = c.item_id 
      WHERE i.user_id = ? ORDER BY i.create_at DESC;`;
    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, [userId]);
    connection.release();

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.itemNotFound);
    }
    return rows;
  },
  updateItems: async function (req) {
    var userId = Number(req.decoded);
    var itemId = Number(req.params.item_id);
    // var folderId = Number(req.body.folder_id);
    var itemName = req.body.item_name;
    var itemImage = req.body.item_img;
    var itemPrice = Number(req.body.item_price);
    var itemUrl = req.body.item_url;
    var itemMemo = req.body.item_memo;

    var sqlUpdate =
      "UPDATE items SET item_name = ?, item_img = ?, item_price = ?, item_url = ?, item_memo = ?";
    var params = [itemName, itemImage, itemPrice, itemUrl, itemMemo];

    //TODO 제약조건 때문에 우선 이렇게 해둠
    if (req.body.folder_id) {
      sqlUpdate += ", folder_id = ? WHERE item_id = ?";
      params.push(Number(req.body.folder_id));
      params.push(Number(itemId));
    } else {
      sqlUpdate += " WHERE item_id = ?";
      params.push(Number(itemId));
    }
    sqlUpdate += " AND user_id = ?";
    params.push(Number(userId));

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.itemUpdateError);
    }
    return true;
  },
  deleteItems: async function (req) {
    var userId = Number(req.decoded);
    var itemId = Number(req.body.item_id);
    var sqlDelete = "DELETE FROM items WHERE item_id = ? AND user_id = ?";
    var params = [itemId, userId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlDelete, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.itemDeleteError);
    }
    return true;
  },
};
