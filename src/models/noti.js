const db = require('../config/db');
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

    const [rows] = await db.queryWithTransaction(sqlInsert, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.notiInsert);
    }
    return true;
  },
  selectNoti: async function (req) {
    const userId = Number(req.decoded);
    const sqlSelect = `SELECT i.item_id, i.item_img_url, i.item_name, i.item_url, n.item_notification_type, 
        CAST(n.item_notification_date AS CHAR(19)) item_notification_date, n.read_state 
        FROM notifications n JOIN items i 
        ON n.item_id = i.item_id 
        WHERE n.user_id = ? and n.item_notification_date <= DATE_ADD(NOW(), INTERVAL 30 MINUTE)
        ORDER BY n.item_notification_date DESC`;

    const [rows] = await db.query(sqlSelect, [userId]);

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.notiTabNotFound);
    }

    return Object.setPrototypeOf(rows, []);
  },
  selectCalendar: async function (req) {
    const userId = Number(req.decoded);
    // const month = req.query.month;

    const sqlSelect = `SELECT i.item_id, i.item_img_url, i.item_name, i.item_url, n.item_notification_type, 
    CAST(n.item_notification_date AS CHAR(19)) item_notification_date, n.read_state 
    FROM notifications n JOIN items i 
    ON n.item_id = i.item_id WHERE n.user_id = ? 
    ORDER BY n.item_notification_date ASC`;

    const [rows] = await db.query(sqlSelect, [userId]);

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.notiCalendarNotFound);
    }

    return Object.setPrototypeOf(rows, []);
  },
  updateNotiReadState: async function (req) {
    const userId = Number(req.decoded);
    const itemId = Number(req.params.item_id);

    const sqlUpdate =
      'UPDATE notifications SET read_state = 1 WHERE user_id = ? AND item_id = ?';
    const params = [userId, itemId];

    const [rows] = await db.queryWithTransaction(sqlUpdate, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.notiReadStateUpdate);
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

    const [rows] = await db.queryWithTransaction(sqlUpsert, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.notiUpsert);
    }

    return rows.affectedRows === 1 ? Strings.INSERT : Strings.UPSERT;
  },
  deleteNoti: async function (req) {
    const userId = Number(req.decoded);
    const itemId = Number(req.params.item_id);

    const sqlDelete =
      'DELETE FROM notifications WHERE user_id = ? AND item_id = ?';
    const params = [userId, itemId];

    const [rows] = await db.queryWithTransaction(sqlDelete, params);

    return rows.affectedRows < 1 ? false : true;
  },
};
