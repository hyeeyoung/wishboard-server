const pool = require('../config/db');
const { NotFound } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');

module.exports = {
  selectFolder: async function (req) {
    const userId = Number(req.decoded);

    const sqlSelect = `SELECT f.folder_id, f.user_id, f.folder_name, i.item_img folder_thumbnail, ifnull(ic.item_count, 0) item_count
    FROM folders f LEFT OUTER JOIN (SELECT folder_id, item_img FROM items ORDER BY create_at DESC LIMIT 1) i
    ON f.folder_id = i.folder_id 
    LEFT OUTER JOIN (SELECT folder_id, count(folder_id) item_count FROM items GROUP BY folder_id) ic
    ON f.folder_id = ic.folder_id
    WHERE f.user_id = ? GROUP BY f.folder_id ORDER BY f.create_at DESC`;

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, userId);
    connection.release();

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.folderNotFound);
    }
    return Object.setPrototypeOf(rows, []);
  },
  selectFolderList: async function (req) {
    const userId = Number(req.decoded);

    const sqlSelect = `SELECT f.folder_id, f.folder_name, i.item_img folder_thumbnail FROM folders f
    LEFT OUTER JOIN (SELECT folder_id, item_img FROM items ORDER BY create_at DESC LIMIT 1) i
    ON f.folder_id = i.folder_id 
    WHERE f.user_id = ? ORDER BY f.create_at DESC`;

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, userId);
    connection.release();

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.folderListNotFound);
    }
    return Object.setPrototypeOf(rows, []);
  },
  selectFolderItems: async function (req) {
    const userId = Number(req.decoded);
    const folderId = Number(req.params.folder_id);

    const sqlSelect = `SELECT i.item_id, i.user_id, i.item_img, i.item_name,
    i.item_price, i.item_url, i.item_memo, IF(c.item_id IS NULL, false, true) as cart_state, 
    CAST(i.create_at AS CHAR(10)) create_at, n.item_notification_type, CAST(n.item_notification_date AS CHAR(16)) item_notification_date
    FROM items i LEFT OUTER JOIN notification n 
    ON i.item_id = n.item_id  
    LEFT OUTER JOIN cart c ON i.item_id = c.item_id
    WHERE i.user_id = ? AND i.folder_id = ?
    ORDER BY i.create_at DESC`;

    const parmas = [userId, folderId];

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, parmas);
    connection.release();

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.folderInItemNotFound);
    }
    return Object.setPrototypeOf(rows, []);
  },
  insertFolder: async function (req) {
    const folderName = req.body.folder_name;
    const userId = Number(req.decoded);

    const sqInsert = `INSERT INTO folders(folder_name, user_id) VALUES (?, ?)`;
    const params = [folderName, userId];

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
    return Number(rows.insertId);
  },
  updateFolder: async function (req) {
    const userId = Number(req.decoded);
    const folderName = req.body.folder_name;
    const folderId = Number(req.params.folder_id);

    const sqlUpdate = `UPDATE folders SET folder_name = ? WHERE folder_id = ? and user_id = ?`;
    const params = [folderName, folderId, userId];

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
  deleteFolder: async function (req) {
    const folderId = Number(req.params.folder_id);

    const sqlDelete = `DELETE FROM folders WHERE folder_id = ?`;

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
