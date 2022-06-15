const db = require('../config/db');
const { NotFound, Conflict } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');

module.exports = {
  selectFolder: async function (req) {
    const userId = Number(req.decoded);

    const sqlSelect = `SELECT f.folder_id, f.folder_name, i.folder_thumbnail, ifnull(ic.item_count, 0) item_count FROM folders f 
    LEFT OUTER JOIN (
    (SELECT a.folder_id, a.item_img folder_thumbnail, a.create_at
    FROM items a INNER JOIN (SELECT max(create_at) create_at FROM items GROUP BY folder_id) b
    WHERE a.create_at = b.create_at)) i
    ON f.folder_id = i.folder_id 
    LEFT OUTER JOIN (SELECT folder_id, count(folder_id) item_count FROM items GROUP BY folder_id) ic
    ON f.folder_id = ic.folder_id
    WHERE f.user_id = ? ORDER BY f.create_at DESC`;

    const [rows] = await db.query(sqlSelect, [userId]);

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.folderNotFound);
    }
    return Object.setPrototypeOf(rows, []);
  },
  selectFolderList: async function (req) {
    const userId = Number(req.decoded);

    const sqlSelect = `SELECT f.folder_id, f.folder_name, i.folder_thumbnail FROM folders f 
    LEFT OUTER JOIN (
    (SELECT a.folder_id, a.item_img folder_thumbnail, a.create_at
    FROM items a INNER JOIN (SELECT max(create_at) create_at FROM items GROUP BY folder_id) b
    WHERE a.create_at = b.create_at)) i
    ON f.folder_id = i.folder_id 
    WHERE f.user_id = ? ORDER BY f.create_at DESC`;

    const [rows] = await db.query(sqlSelect, [userId]);

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.folderListNotFound);
    }
    return Object.setPrototypeOf(rows, []);
  },
  selectFolderItems: async function (req) {
    const userId = Number(req.decoded);
    const folderId = Number(req.params.folder_id);

    const sqlSelect = `SELECT i.folder_id, f.folder_name, i.item_id, i.item_img, i.item_name,
    i.item_price, i.item_url, i.item_memo, IF(c.item_id IS NULL, false, true) as cart_state, 
    CAST(i.create_at AS CHAR) create_at, n.item_notification_type, CAST(n.item_notification_date AS CHAR(16)) item_notification_date
    FROM items i LEFT OUTER JOIN notifications n 
    ON i.item_id = n.item_id  
    LEFT OUTER JOIN (SELECT folder_id, folder_name FROM folders GROUP BY folder_id) f 
    ON i.folder_id = f.folder_id 
    LEFT OUTER JOIN cart c ON i.item_id = c.item_id
    WHERE i.user_id = ? AND i.folder_id = ?
    ORDER BY i.create_at DESC`;

    const params = [userId, folderId];

    const [rows] = await db.query(sqlSelect, params);

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

    const [rows] = await db.queryWithTransaction(sqInsert, params);

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

    const [rows] = await db.queryWithTransaction(sqlUpdate, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.folderNameUpdateError);
    }
    return true;
  },
  deleteFolder: async function (req) {
    const userId = Number(req.decoded);
    const folderId = Number(req.params.folder_id);

    const sqlDelete = `DELETE FROM folders WHERE folder_id = ? AND user_id = ?`;
    const params = [folderId, userId];

    const [rows] = await db.queryWithTransaction(sqlDelete, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.folderDeleteError);
    }
    return true;
  },
  validateFolder: async function (req) {
    const userId = Number(req.decoded);
    const folderName = req.body.folder_name;

    const sqlSelect =
      'SELECT folder_name FROM folders WHERE user_id = ? AND folder_name = ?';
    const params = [userId, folderName];

    const [rows] = await db.query(sqlSelect, params);

    if (rows.length >= 1) {
      throw new Conflict(ErrorMessage.validateFolder);
    }
    return false;
  },
};
