const { NotFound } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');
const db = require('../config/db');
const { trimToString } = require('../utils/util');
const S3ImageUtils = require('../utils/S3ImageUtils');

module.exports = {
  insertItem: async function (req) {
    const userId = Number(req.decoded);
    let folderId = !req.body.folder_id ? null : Number(req.body.folder_id);
    const itemName = trimToString(req.body.item_name);
    const itemPrice = !req.body.item_price ? 0 : req.body.item_price;
    const itemUrl = !req.body.item_url ? null : trimToString(req.body.item_url);
    const itemMemo = trimToString(req.body.item_memo);
    const addType = trimToString(req.query.type);

    if (isNaN(folderId)) {
      folderId = null;
    }

    const params = [
      userId,
      folderId,
      itemName,
      itemPrice,
      itemUrl,
      itemMemo,
      addType,
    ];

    let sqlInsert;
    if (req.file != undefined) {
      // 이미지가 존재할 경우
      const image = { originalname: '', location: '' };
      image.originalname = req.file.key;
      image.location = req.file.location;

      const itemImg = image.originalname;
      const itemImgUrl = image.location;

      sqlInsert =
        'INSERT INTO items (user_id, folder_id, item_name, item_price, item_url, item_memo, add_type, item_img, item_img_url) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
      params.push(itemImg);
      params.push(itemImgUrl);
    } else {
      sqlInsert =
        'INSERT INTO items (user_id, folder_id, item_name, item_price, item_url, item_memo, add_type) VALUES(?, ?, ?, ?, ?, ?, ?)';
    }

    const [rows] = await db.queryWithTransaction(sqlInsert, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.itemInsert);
    }
    return Number(rows.insertId);
  },
  selectItems: async function (req) {
    const userId = Number(req.decoded);

    const sqlSelect = `SELECT i.folder_id, ifNull(f.folder_name, "") folder_name, i.item_id, i.item_img_url, i.item_name, i.item_price, ifNull(i.item_url, "") item_url, ifNull(i.item_memo, "") item_memo, 
    CAST(i.create_at AS CHAR) create_at, n.item_notification_type, CAST(n.item_notification_date AS CHAR(16)) item_notification_date, IF(c.item_id IS NULL, false, true) as cart_state
    FROM items i LEFT OUTER JOIN notifications n 
    ON i.item_id = n.item_id  
    LEFT OUTER JOIN (SELECT folder_id, folder_name FROM folders GROUP BY folder_id) f 
    ON i.folder_id = f.folder_id 
    LEFT OUTER JOIN cart c
    on i.item_id = c.item_id 
    WHERE i.user_id = ? ORDER BY i.create_at DESC`;

    const [rows] = await db.query(sqlSelect, userId);

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.itemNotFound);
    }
    return Object.setPrototypeOf(rows, []);
  },
  selectItemDetail: async function (req) {
    const userId = Number(req.decoded);
    const itemId = Number(req.params.item_id);

    const sqlSelect = `SELECT i.folder_id, ifNull(f.folder_name, "") folder_name, i.item_id, i.item_img_url, i.item_name, i.item_price, ifNull(i.item_url, "") item_url, ifNull(i.item_memo, "") item_memo, 
    CAST(i.create_at AS CHAR) create_at, n.item_notification_type, CAST(n.item_notification_date AS CHAR(16)) item_notification_date
    FROM items i LEFT OUTER JOIN notifications n 
    ON i.item_id = n.item_id  
    LEFT OUTER JOIN (SELECT folder_id, folder_name FROM folders GROUP BY folder_id) f 
    ON i.folder_id = f.folder_id 
    WHERE i.item_id = ? AND i.user_id = ? ORDER BY i.create_at DESC`;

    const [rows] = await db.query(sqlSelect, [itemId, userId]);

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.itemNotFound);
    }
    return Object.setPrototypeOf(rows, []);
  },
  selectItemOneLatest: async function (req) {
    const userId = Number(req.decoded);

    const sqlSelect = `SELECT i.folder_id, ifNull(f.folder_name, "") folder_name, i.item_id, i.item_img_url, i.item_name, i.item_price, ifNull(i.item_url, "") item_url, ifNull(i.item_memo, "") item_memo, 
    CAST(i.create_at AS CHAR) create_at, n.item_notification_type, CAST(n.item_notification_date AS CHAR(16)) item_notification_date, IF(c.item_id IS NULL, false, true) as cart_state
    FROM items i LEFT OUTER JOIN notifications n 
    ON i.item_id = n.item_id  
    LEFT OUTER JOIN (SELECT DISTINCT folder_id, folder_name FROM folders) f 
    ON i.folder_id = f.folder_id 
    LEFT OUTER JOIN cart c
    on i.item_id = c.item_id 
    WHERE i.user_id = ? ORDER BY i.create_at DESC LIMIT 1`;

    const [rows] = await db.query(sqlSelect, [userId]);

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.itemLatestNotFound);
    }
    return Object.setPrototypeOf(rows, []);
  },
  updateItem: async function (req) {
    const userId = Number(req.decoded);
    const itemId = Number(req.params.item_id);
    const itemName = trimToString(req.body.item_name);
    const itemPrice = !req.body.item_price ? 0 : Number(req.body.item_price);
    const itemUrl = req.body.item_url;
    const itemMemo = trimToString(req.body.item_memo);
    const folderId = Number(req.body.folder_id);

    let sqlUpdate =
      'UPDATE items SET item_name = ?, item_price = ?, item_url = ?, item_memo = ?';
    const params = [itemName, itemPrice, itemUrl, itemMemo];

    // 아이템이미지 있을 경우에만 동작
    if (req.file != undefined) {
      S3ImageUtils.deleteItemImg([itemId, userId]);

      const image = { originalname: '', location: '' };
      image.originalname = req.file.key;
      image.location = req.file.location;

      const itemImg = image.originalname;
      const itemImgUrl = image.location;

      sqlUpdate += ', item_img = ?, item_img_url = ?';
      params.push(itemImg);
      params.push(itemImgUrl);
    }

    // 폴더id가 있을 경우에만 동작
    if (folderId) {
      sqlUpdate += ', folder_id = ?';
      params.push(folderId);
    }
    sqlUpdate += ' WHERE item_id = ? AND user_id = ?';
    params.push(itemId);
    params.push(userId);

    const [rows] = await db.queryWithTransaction(sqlUpdate, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.itemUpdate);
    }
    return true;
  },
  updateItemToFolder: async function (req) {
    const userId = Number(req.decoded);
    const itemId = Number(req.params.item_id);
    const folderId = Number(req.params.folder_id);

    const sqlUpdate =
      'UPDATE items SET folder_id = ? WHERE user_id = ? AND item_id = ?';
    const params = [folderId, userId, itemId];

    const [rows] = await db.queryWithTransaction(sqlUpdate, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.itemUpdateToFolderNotFound);
    }
    return true;
  },
  deleteItem: async function (req) {
    const userId = Number(req.decoded);
    const itemId = Number(req.params.item_id);
    const sqlDelete = 'DELETE FROM items WHERE item_id = ? AND user_id = ?';
    const params = [itemId, userId];

    S3ImageUtils.deleteItemImg(params);
    const [rows] = await db.queryWithTransaction(sqlDelete, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.itemDelete);
    }
    return true;
  },
};
