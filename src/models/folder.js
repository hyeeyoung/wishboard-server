const pool = require('../config/db');
const { NotFound } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');

module.exports = {
  selectFolder: async function (req) {
    const userId = Number(req.decoded);

    const sqlSelect = `SELECT f.user_id, f.folder_name, f.folder_thumbnail, f.folder_id, ifnull(i.item_count, 0) item_count
    FROM folders f LEFT OUTER JOIN (SELECT folder_id, count(folder_id) item_count 
    FROM items GROUP BY folder_id) i ON f.folder_id = i.folder_id 
    WHERE f.user_id = ? ORDER BY create_at DESC;`;

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

    const sqlSelect = `SELECT folder_id, folder_name, folder_thumbnail FROM folders
    WHERE user_id = ? ORDER BY create_at DESC`;

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
    i.item_price, i.item_url, i.item_memo, IF(c.item_id IS NULL, false, true) as cart_state
    FROM items i left outer join cart c ON i.item_id = c.item_id
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
    const folderThumbnail = req.body.folder_thumbnail;
    const userId = Number(req.decoded);

    const sqInsert = `INSERT INTO folders(folder_name, folder_thumbnail, user_id) VALUES (?, ?, ?)`;
    const params = [folderName, folderThumbnail, userId];

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
    const folderThumbnail = req.body.folder_thumbnail;
    const folderId = Number(req.params.folder_id);

    const sqlUpdate = `UPDATE folders SET folder_name = ?, folder_thumbnail = ? WHERE folder_id = ? and user_id = ?`;
    const params = [folderName, folderThumbnail, folderId, userId];

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
  updateFolderThumbnail: async function (req) {
    const folderId = Number(req.params.folder_id);
    const folderThumbnail = req.body.folder_thumbnail;

    const sqlUpdate = `UPDATE folders SET folder_thumbnail = ? WHERE folder_id = ?`;
    const params = [folderThumbnail, folderId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.folderThumbnailUpdateError);
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
