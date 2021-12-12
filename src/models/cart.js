// const conn = require("../config/db");
const pool = require("../config/db");

module.exports = {
  selectCart: async function (req) {
    var userId = Number(req.decoded);

    var sqlSelect =
      "SELECT a.item_id, a.item_image, a.item_name, a.item_price, b.item_count FROM items a JOIN cart b ON a.item_id = b.item_id WHERE b.user_id = ? ORDER BY a.item_id DESC";

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, userId);
    connection.release();
    return rows;
  },
  insertCart: async function (req) {
    var userId = Number(req.decoded);
    var itemId = Number(req.body.item_id);

    var sqlInsert =
      "INSERT INTO cart (user_id, item_id, item_count) VALUES (?, ?, 1)";
    var params = [userId, itemId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlInsert, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();
    return rows;
  },
  updateCart: async function (req) {
    var userId = Number(req.decoded); // @prams: user_id는 한 명이므로
    var sqlUpdate = "UPDATE cart SET item_count = CASE ";
    var params = [];

    for (var i = 0; i < req.body.length; i++) {
      sqlUpdate += "WHEN item_id = ? then ? ";
      params.push(req.body[i].item_id);
      params.push(req.body[i].item_count);
      if (i == req.body.length - 1) {
        //마지막 원소라면
        sqlUpdate += "ELSE item_count END WHERE user_id = ?";
        params.push(userId);
      }
    }

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();
    return rows;
  },
  deleteCart: async function (req) {
    var userId = Number(req.decoded);
    var itemId = Number(req.body.item_id);

    var sqlDelete = "DELETE FROM cart WHERE user_id = ? AND item_id = ?";
    var params = [userId, itemId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlDelete, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();
    return rows;
  },
};
