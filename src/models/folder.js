const conn = require("../config/db");

module.exports = {
  selectFolder: async function (req) {
    var user_id = Number(req.params.user_id);

    var sql_select = `SELECT f.user_id, f.folder_name, f.folder_image, f.folder_id, ifnull(i.item_count, 0) item_count FROM folders f LEFT OUTER JOIN (SELECT folder_id, count(*) item_count FROM items GROUP BY folder_id) i 
  ON f.folder_id = i.folder_id WHERE f.user_id = ?`;
    console.log(sql_select, user_id);

    const [rows] = await conn.get().query(sql_select, user_id);
    conn.releaseConn();
    return rows;
  },
  selectFolderList: async function (req) {
    var user_id = Number(req.params.user_id);

    var sql_select = `SELECT f.folder_id, f.folder_name, f.folder_image, ifnull(i.item_count, 0) item_count FROM folders f LEFT OUTER JOIN (SELECT folder_id, count(*) item_count FROM items GROUP BY folder_id) i ON f.folder_id = i.folder_id WHERE f.user_id = ?`;
    console.log(sql_select);

    const [rows] = await conn.get().query(sql_select, user_id);
    conn.releaseConn();
    return rows;
  },
  selectFolderItems: async function (req) {
    var user_id = Number(req.params.user_id);
    var folder_id = Number(req.params.folder_id);

    var sql_select = `SELECT i.item_id, i.user_id, i.item_image, i.item_name,
    i.item_price, i.item_url, i.item_memo, b.item_id cart_item_id
    FROM items i left outer join basket b ON i.item_id = b.item_id
    WHERE i.user_id = ? AND i.folder_id = ?
    ORDER BY i.create_at DESC`;
    var parmas = [user_id, folder_id];
    console.log(sql_select);

    const [rows] = await conn.get().query(sql_select, parmas);
    conn.releaseConn();
    return rows;
  },
  insertFolder: async function (req) {
    var folder_name = req.body.folder_name;
    var folder_image = req.body.folder_image;
    var user_id = Number(req.body.user_id);

    var sql_insert = `INSERt INTO folders(folder_name, folder_image, user_id) VALUES (?, ?, ?)`;
    var params = [folder_name, folder_image, user_id];
    console.log(sql_insert);

    const [rows] = await conn.get().query(sql_insert, params);
    conn.releaseConn();
    return rows;
  },
  updateFolder: async function (req) {
    var user_id = Number(req.body.user_id);
    var folder_name = req.body.folder_name;
    var folder_image = req.body.folder_image;
    var folder_id = Number(req.body.folder_id);

    var sql_update = `UPDATE folders SET folder_name = ?, folder_image = ? WHERE folder_id = ? and user_id = ?`;
    var params = [folder_name, folder_image, folder_id, user_id];
    console.log(sql_update);

    const [rows] = await conn.get().query(sql_update, params);
    conn.releaseConn();
    return rows;
  },
  updateFolderImage: async function (req) {
    var folder_id = Number(req.body.folder_id);
    var folder_image = req.body.folder_image; //@TODO : varchar니까 그대로. 수정?

    var sql_update = `UPDATE folders SET folder_image = ? WHERE folder_id = ?`;
    var params = [folder_image, folder_id];
    console.log(update_sql);

    const [rows] = await conn.get().query(sql_update, params);
    conn.releaseConn();
    return rows;
  },
  deleteFolder: async function (req) {
    var folder_id = Number(req.body.folder_id);

    var sql_delete = `DELETE FROM folders WHERE folder_id = ?`;
    console.log("delete_sql : " + sql_delete);

    const [rows] = await conn.get().query(sql_delete, folder_id);
    conn.releaseConn();
    return rows;
  },
};
