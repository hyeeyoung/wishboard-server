const pool = require('../config/db');
const { NotFound } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');

module.exports = {
  insertNoti: async function (req) {
    const userId = Number(req.decoded);
    const itemId = req.body.item_id;
    const notiType = req.body.item_notification_type;
    const notiDate = req.body.item_notification_date;

    const sqlInsert =
      'INSERT INTO notification (user_id, item_id, item_notification_type, item_notification_date) VALUES(?,?,?,?)';
    const params = [userId, itemId, notiType, notiDate];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlInsert, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.notiInsertError);
    }
    return true;
  },
  selectNoti: async function (req) {
    const userId = Number(req.decoded);
    const sqlSelect = `SELECT i.item_id, i.item_img, i.item_name, n.item_notification_type, 
        CAST(n.item_notification_date AS CHAR(19)) item_notification_date, n.read_state 
        FROM notification n JOIN items i 
        ON n.item_id = i.item_id 
        WHERE n.user_id = ? and n.item_notification_date <= NOW() 
        ORDER BY n.item_notification_date DESC`;

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, userId);
    connection.release();

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.notiNotFound);
    }

    return Object.setPrototypeOf(rows, []);
  },
  updateNoti: async function (req) {
    const userId = Number(req.decoded);
    const itemId = Number(req.params.item_id);
    const notiType = req.body.item_notification_type;
    const notiDate = req.body.item_notification_date;

    const sqlUpdate =
      'UPDATE notification SET item_notification_type = ?, item_notification_date = ? WHERE user_id = ? AND item_id = ?';
    const params = [notiType, notiDate, userId, itemId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.notiUpdateError);
    }
    return true;
  },
  updateNotiReadState: async function (req) {
    const userId = Number(req.decoded);
    const itemId = Number(req.params.item_id);

    const sqlUpdate =
      'UPDATE notification SET read_state = 1 WHERE user_id = ? AND item_id = ?';
    const params = [userId, itemId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.notiReadStateUpdateError);
    }
    return true;
  },
  deleteNoti: async function (req) {
    const userId = Number(req.decoded);
    const itemId = Number(req.params.item_id);

    const sqlDelete =
      'DELETE FROM notification WHERE user_id = ? AND item_id = ?';
    const params = [userId, itemId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlDelete, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.notiDeleteError);
    }
    return true;
  },
};
