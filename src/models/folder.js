const pool = require("../config/db");
const { NotFound } = require("../utils/errors");
const { ErrorMessage } = require("../utils/response");

module.exports = {
  selectFolder: async function (req) {
    var userId = Number(req.decoded);

    var sqlSelect = `SELECT f.user_id, f.folder_name, f.folder_img, f.folder_id, ifnull(i.item_count, 0) item_count FROM folders f LEFT OUTER JOIN (SELECT folder_id, count(*) item_count FROM items GROUP BY folder_id) i 
  ON f.folder_id = i.folder_id WHERE f.user_id = ?`;

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, userId);
    connection.release();

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.folderNotFound);
    }
    return rows;
  },
  selectFolderList: async function (req) {
    var userId = Number(req.decoded);

    var sqlSelect = `SELECT f.folder_id, f.folder_name, f.folder_img, ifnull(i.item_count, 0) item_count FROM folders f LEFT OUTER JOIN (SELECT folder_id, count(*) item_count FROM items GROUP BY folder_id) i ON f.folder_id = i.folder_id WHERE f.user_id = ?`;

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, userId);
    connection.release();

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.folderListNotFound);
    }
    return rows;
  },
  selectFolderItems: async function (req) {
    var userId = Number(req.decoded);
    var folderId = Number(req.params.folder_id);

    var sqlSelect = `SELECT i.item_id, i.user_id, i.item_img, i.item_name,
    i.item_price, i.item_url, i.item_memo, b.item_id cart_item_id
    FROM items i left outer join cart b ON i.item_id = b.item_id
    WHERE i.user_id = ? AND i.folder_id = ?
    ORDER BY i.create_at DESC`;
    var parmas = [userId, folderId];

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, parmas);
    connection.release();

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.folderInItemNotFound);
    }
    return rows;
  },
  insertFolder: async function (req) {
    var folderName = req.body.folder_name;
    var folderImg = req.body.folder_img;
    var userId = Number(req.decoded);

    var sqInsert = `INSERt INTO folders(folder_name, folder_img, user_id) VALUES (?, ?, ?)`;
    var params = [folderName, folderImg, userId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqInsert, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.folderInsertError);
    }
    return true;
  },
  updateFolder: async function (req) {
    var userId = Number(req.decoded);
    var folderName = req.body.folder_name;
    var folderImg = req.body.folder_img;
    var folderId = Number(req.body.folder_id);

    var sqlUpdate = `UPDATE folders SET folder_name = ?, folder_img = ? WHERE folder_id = ? and user_id = ?`;
    var params = [folderName, folderImg, folderId, userId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.folderNameUpdateError);
    }
    return true;
  },
  updateFolderImage: async function (req) {
    var folderId = Number(req.body.folder_id);
    var folderImg = req.body.folder_img;

    var sqlUpdate = `UPDATE folders SET folder_img = ? WHERE folder_id = ?`;
    var params = [folderImg, folderId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.folderImageUpdateError);
    }
    return true;
  },
  deleteFolder: async function (req) {
    var folderId = Number(req.body.folder_id);

    var sqlDelete = `DELETE FROM folders WHERE folder_id = ?`;

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlDelete, folderId)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.folderDeleteError);
    }
    return true;
  },
};
