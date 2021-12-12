const pool = require("../config/db");

module.exports = {
  insertItem: async function (req) {
    var userId = Number(req.decoded);
    var folderId = req.body.folder_id;

    if (folderId != undefined) {
      folderId = Number(req.body.folder_id);
    }
    var itemImage = req.body.item_image;
    var itemName = req.body.item_name;
    var itemPrice = req.body.item_price;
    var itemUrl = req.body.item_url;
    var itemMemo = req.body.item_memo;

    var sqlInsert =
      "INSERT INTO items (user_id, folder_id, item_image, item_name, item_price, item_url, item_memo) VALUES(?,?,?,?,?,?,?)";

    var params = [
      userId,
      folderId,
      itemImage,
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
    return rows;
  },
  selectItems: async function (req) {
    var userId = Number(req.decoded);
    var sqlSelect =
      "SELECT i.item_id, i.user_id, i.folder_id, i.item_image, i.item_name, i.item_price, i.item_url, i.item_memo, b.item_id cart_item_id FROM items i left outer join cart b on i.item_id = b.item_id WHERE i.user_id = ? ORDER BY i.create_at DESC";

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, [userId]);
    connection.release();
    return rows;
  },
  selectItemsDetail: async function (req) {
    var itemId = Number(req.params.item_id);
    //요청한 아이템 아이디로 서버에서 해당 item과 folder_name을 select
    var sqlSelect = `SELECT i.folder_id, f.folder_name, i.item_image, i.item_name, i.item_price, i.item_url, i.item_memo, CAST(i.create_at AS CHAR(10)) create_at, n.item_notification_type, CAST(n.item_notification_date AS CHAR(16)) item_notification_date FROM items i LEFT OUTER JOIN notification n ON i.item_id = n.item_id  LEFT OUTER JOIN (SELECT DISTINCT folder_id, folder_name FROM folders) f ON i.folder_id = f.folder_id WHERE i.item_id = ?;`;
    //var temp_sql_select = "SELECT i.folder_id, i.item_image, i.item_name, i.item_price, i.item_url, i.item_memo, CAST(i.create_at AS CHAR(10)) create_at, n.item_notification_type, CAST(n.item_notification_date AS CHAR(16)) item_notification_date FROM items i LEFT OUTER JOIN notification n ON i.item_id = n.item_id WHERE i.item_id = ?";

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, [itemId]);
    connection.release();
    return rows;
  },
  updateItemsDetail: async function (req) {
    var itemId = Number(req.params.item_id);
    var folderId = Number(req.body.folder_id);
    var itemName = req.body.item_name;
    var itemImage = req.body.item_image;
    var itemPrice = req.body.item_price;
    var itemUrl = req.body.item_url;
    var itemMemo = req.body.item_memo;

    var sqlUpdate =
      "UPDATE items SET folder_id = ?, item_name = ?, item_image = ?, item_price = ?, item_url = ?, item_memo = ? WHERE item_id = ?";
    var params = [
      folderId,
      itemName,
      itemImage,
      itemPrice,
      itemUrl,
      itemMemo,
      itemId,
    ];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();
    return rows;
  },
  deleteItems: async function (req) {
    var itemId = Number(req.body.item_id);
    var sqlDelete = "DELETE FROM items WHERE item_id = ?";

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlDelete, [itemId])
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();
    return rows;
  },
};
