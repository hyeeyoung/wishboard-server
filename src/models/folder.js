const pool = require('../config/db');
const { NotFound } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');

module.exports = {
  selectFolder: async function (req) {
    const userId = Number(req.decoded);

    const sqlSelect = `SELECT f.user_id, f.folder_name, f.folder_img, f.folder_id, ifnull(i.item_count, 0) item_count
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

    const sqlSelect = `SELECT folder_id, folder_name, folder_img FROM folders
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
    // TODO selectFolderItems가 필요 없어 보이나 아직 프론트 폴더 작업 진행 전이니 보류
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
    const folderImg = req.body.folder_img;
    const userId = Number(req.decoded);

    const sqInsert = `INSERt INTO folders(folder_name, folder_img, user_id) VALUES (?, ?, ?)`;
    const params = [folderName, folderImg, userId];

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
    const userId = Number(req.decoded);
    const folderName = req.body.folder_name;
    const folderImg = req.body.folder_img;
    const folderId = Number(req.params.folder_id);

    const sqlUpdate = `UPDATE folders SET folder_name = ?, folder_img = ? WHERE folder_id = ? and user_id = ?`;
    const params = [folderName, folderImg, folderId, userId];

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
    /** TODO updateFolder로 처리하면 될 것 같아 필요 없어 보이나
     *       아직 프론트 폴더 작업 진행 전이니 보류             */
    const folderId = Number(req.params.folder_id);
    const folderImg = req.body.folder_img;

    const sqlUpdate = `UPDATE folders SET folder_img = ? WHERE folder_id = ?`;
    const params = [folderImg, folderId];

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
