const pool = require('../config/db');
const { NotFound } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');
const { Strings } = require('../utils/strings');

module.exports = {
  insertNoti: async function (req, itemId) {
    const userId = Number(req.decoded);
    const notiType = req.body.item_notification_type;
    const notiDate = req.body.item_notification_date;

    const sqlInsert =
      'INSERT INTO notifications (user_id, item_id, item_notification_type, item_notification_date) VALUES(?,?,?,?)';
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
    const sqlSelect = `SELECT i.item_id, i.item_img, i.item_name, i.item_url, n.item_notification_type, 
        CAST(n.item_notification_date AS CHAR(19)) item_notification_date, n.read_state 
        FROM notifications n JOIN items i 
        ON n.item_id = i.item_id 
        WHERE n.user_id = ? and n.item_notification_date <= MINUTE(DATE_ADD(NOW(), INTERVAL 30 MINUTE))
        ORDER BY n.item_notification_date DESC`;

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, userId);
    connection.release();

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.notiNotFound);
    }

    return Object.setPrototypeOf(rows, []);
  },
  updateNotiReadState: async function (req) {
    const userId = Number(req.decoded);
    const itemId = Number(req.params.item_id);

    const sqlUpdate =
      'UPDATE notifications SET read_state = 1 WHERE user_id = ? AND item_id = ?';
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
  upsertNoti: async function (req) {
    const userId = Number(req.decoded);
    const itemId = Number(req.params.item_id);
    const itemNotiType = req.body.item_notification_type;
    const itemNotiDate = req.body.item_notification_date;

    const sqlUpsert = `INSERT INTO notifications (user_id, item_id, item_notification_type, item_notification_date)
    VALUES(?, ?, ?, ?) ON DUPLICATE KEY UPDATE item_notification_type = ?, item_notification_date = ?`;

    const params = [
      userId,
      itemId,
      itemNotiType,
      itemNotiDate,
      itemNotiType,
      itemNotiDate,
    ];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpsert, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.notiUpsertError);
    }

    return rows.affectedRows === 1 ? Strings.INSERT : Strings.UPSERT;
  },
  deleteNoti: async function (req) {
    const userId = Number(req.decoded);
    const itemId = Number(req.params.item_id);

    const sqlDelete =
      'DELETE FROM notifications WHERE user_id = ? AND item_id = ?';
    const params = [userId, itemId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlDelete, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    return rows.affectedRows < 1 ? false : true;
  },
  selectNotiFrom30minAgo: async function (req) {
    const userId = Number(req.decoded);

    const sqlSelect = `SELECT n.item_notification_type, n.item_notification_date, n.item_id, n.user_id, u.fcm_token FROM notifications n 
    INNER JOIN users u ON n.user_id = u.user_id
    WHERE MINUTE(n.item_notification_date) = MINUTE(DATE_ADD(NOW(), INTERVAL 30 MINUTE)) AND n.user_id = ? AND u.push_state = true
    ORDER BY n.item_notification_date ASC`;

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, userId);
    connection.release();

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.notiTodayNotFound);
    }

    return Object.setPrototypeOf(rows, []);
  },
};
