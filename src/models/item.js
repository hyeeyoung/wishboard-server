const conn = require("../config/db");

module.exports = {
  insertItem: async function (req) {
    var user_id = Number(req.body.user_id);
    var folder_id = req.body.folder_id;

    if (folder_id != undefined) {
      folder_id = Number(req.body.folder_id);
    }
    var item_image = req.body.item_image;
    var item_name = req.body.item_name;
    var item_price = req.body.item_price;
    var item_url = req.body.item_url;
    var item_memo = req.body.item_memo;

    var sql_insert =
      "INSERT INTO items (user_id, folder_id, item_image, item_name, item_price, item_url, item_memo) VALUES(?,?,?,?,?,?,?)";

    var params = [
      user_id,
      folder_id,
      item_image,
      item_name,
      item_price,
      item_url,
      item_memo,
    ];

    console.log("sql_insert : " + sql_insert);

    const [rows] = await conn.get().query(sql_insert, params);
    conn.releaseConn();
    return rows;
  },
  selectItems: async function (req) {
    var user_id = Number(req.params.user_id);
    var sql_select =
      "SELECT i.item_id, i.user_id, i.folder_id, i.item_image, i.item_name, i.item_price, i.item_url, i.item_memo, b.item_id cart_item_id FROM items i left outer join basket b on i.item_id = b.item_id WHERE i.user_id = ? ORDER BY i.create_at DESC";

    console.log("sql_select : " + sql_select + "\nuser_id : " + user_id);

    const [rows] = await conn.get().query(sql_select, [user_id]);
    conn.releaseConn();
    return rows;
  },
  selectItemsDetail: async function (req) {
    var item_id = Number(req.params.item_id);
    console.log("item_id : " + item_id);

    //요청한 아이템 아이디로 서버에서 해당 item과 folder_name을 select
    var sql_select = `SELECT i.folder_id, f.folder_name, i.item_image, i.item_name, i.item_price, i.item_url, i.item_memo, CAST(i.create_at AS CHAR(10)) create_at, n.item_notification_type, CAST(n.item_notification_date AS CHAR(16)) item_notification_date FROM items i LEFT OUTER JOIN notification n ON i.item_id = n.item_id  LEFT OUTER JOIN (SELECT DISTINCT folder_id, folder_name FROM folders) f ON i.folder_id = f.folder_id WHERE i.item_id = ?;`;
    //var temp_sql_select = "SELECT i.folder_id, i.item_image, i.item_name, i.item_price, i.item_url, i.item_memo, CAST(i.create_at AS CHAR(10)) create_at, n.item_notification_type, CAST(n.item_notification_date AS CHAR(16)) item_notification_date FROM items i LEFT OUTER JOIN notification n ON i.item_id = n.item_id WHERE i.item_id = ?";
    console.log("sql : " + sql_select + "\nitem_id : " + item_id);

    const [rows] = await conn.get().query(sql_select, [item_id]);
    conn.releaseConn();
    return rows;
  },
  updateItemsDetail: async function (req) {
    var item_id = Number(req.params.item_id);
    var folder_id = Number(req.body.folder_id);
    var item_name = req.body.item_name;
    var item_image = req.body.item_image;
    var item_price = req.body.item_price;
    var item_url = req.body.item_url;
    var item_memo = req.body.item_memo;

    var sql_update =
      "UPDATE items SET folder_id = ?, item_name = ?, item_image = ?, item_price = ?, item_url = ?, item_memo = ? WHERE item_id = ?";
    var params = [
      folder_id,
      item_name,
      item_image,
      item_price,
      item_url,
      item_memo,
      item_id,
    ];
    console.log("sql_update : " + sql_update + "\nitem_id : " + item_id);

    const [rows] = await conn.get().query(sql_update, params);
    conn.releaseConn();
    return rows;
  },
  deleteItems: async function (req) {
    var item_id = Number(req.params.item_id);
    var sql_delete = "DELETE FROM items WHERE item_id = ?";

    console.log("sql_delete : " + sql_delete + "\nitem_id : " + item_id);

    const [rows] = await conn.get().query(sql_delete, [item_id]);
    conn.releaseConn();
    return rows;
  },
};
