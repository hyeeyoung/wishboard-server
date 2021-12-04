const pool = require("../config/db");

module.exports = {
  selectFolder: async function (req) {
    var userId = Number(req.decoded);

    var sqlSelect = `SELECT f.user_id, f.folder_name, f.folder_image, f.folder_id, ifnull(i.item_count, 0) item_count FROM folders f LEFT OUTER JOIN (SELECT folder_id, count(*) item_count FROM items GROUP BY folder_id) i 
  ON f.folder_id = i.folder_id WHERE f.user_id = ?`;
    console.log(sqlSelect, userId);

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, userId);
    connection.release();
    return rows;
  },
  selectFolderList: async function (req) {
    var userId = Number(req.decoded);

    var sqlSelect = `SELECT f.folder_id, f.folder_name, f.folder_image, ifnull(i.item_count, 0) item_count FROM folders f LEFT OUTER JOIN (SELECT folder_id, count(*) item_count FROM items GROUP BY folder_id) i ON f.folder_id = i.folder_id WHERE f.user_id = ?`;
    console.log(sqlSelect);

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, userId);
    connection.release();
    return rows;
  },
  selectFolderItems: async function (req) {
    var userId = Number(req.decoded);
    var folderId = Number(req.params.folder_id);

    var sqlSelect = `SELECT i.item_id, i.user_id, i.item_image, i.item_name,
    i.item_price, i.item_url, i.item_memo, b.item_id cart_item_id
    FROM items i left outer join cart b ON i.item_id = b.item_id
    WHERE i.user_id = ? AND i.folder_id = ?
    ORDER BY i.create_at DESC`;
    var parmas = [userId, folderId];
    console.log(sqlSelect);

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, parmas);
    connection.release();
    return rows;
  },
  insertFolder: async function (req) {
    var folderName = req.body.folder_name;
    var folderImage = req.body.folder_image;
    var userId = Number(req.decoded);

    var sqInsert = `INSERt INTO folders(folder_name, folder_image, user_id) VALUES (?, ?, ?)`;
    var params = [folderName, folderImage, userId];
    console.log(sqInsert);

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqInsert, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();
    return rows;
  },
  updateFolder: async function (req) {
    var userId = Number(req.decoded);
    var folderName = req.body.folder_name;
    var folderImage = req.body.folder_image;
    var folderId = Number(req.body.folder_id);

    var sqlUpdate = `UPDATE folders SET folder_name = ?, folder_image = ? WHERE folder_id = ? and user_id = ?`;
    var params = [folderName, folderImage, folderId, userId];
    console.log(sqlUpdate);

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();
    return rows;
  },
  updateFolderImage: async function (req) {
    var folderId = Number(req.body.folder_id);
    var folderImage = req.body.folder_image; //@TODO : varchar니까 그대로. 수정?

    var sqlUpdate = `UPDATE folders SET folder_image = ? WHERE folder_id = ?`;
    var params = [folderImage, folderId];
    console.log(sqlUpdate);

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();
    return rows;
  },
  deleteFolder: async function (req) {
    var folderId = Number(req.body.folder_id);

    var sqlDelete = `DELETE FROM folders WHERE folder_id = ?`;
    console.log("sqlDelete : " + sqlDelete);

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlDelete, folderId)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();
    return rows;
  },
};
