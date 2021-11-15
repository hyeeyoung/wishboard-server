const conn = require("../config/db");

module.exports = {
  selectBasket: async function (req) {
    var userId = Number(req.params.user_id);

    var sqlSelect =
      "SELECT a.item_id, a.item_image, a.item_name, a.item_price, b.item_count FROM items a JOIN basket b ON a.item_id = b.item_id WHERE b.user_id = ? ORDER BY a.item_id DESC";

    console.log("sqlSelect : " + sqlSelect);

    const [rows] = await conn.get().query(sqlSelect, userId);
    conn.releaseConn();
    return rows;
  },
  insertBasket: async function (req) {
    var userId = Number(req.body.user_id);
    var itemId = Number(req.body.item_id);

    var sqlInsert =
      "INSERT INTO basket (user_id, item_id, item_count) VALUES (?, ?, 1)";
    var params = [userId, itemId];

    console.log("sqlInsert : " + sqlInsert);

    await (await conn.get().getConnection()).beginTransaction();
    const [rows] = await conn.get().query(sqlInsert, params);
    await (await conn.get().getConnection()).commit();
    conn.releaseConn();
    return rows;
  },
  updateBasket: async function (req) {
    for (var i = 0; i < req.body.length; i++) {
      console.log(
        req.body[i].user_id +
          " " +
          req.body[i].item_id +
          " " +
          req.body[i].item_count +
          " "
      );
    }
    var userId = req.body[0].user_id; // @prams: user_id는 한 명이므로
    var sqlUpdate = "UPDATE basket SET item_count = CASE ";
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

    console.log("sqlUpdate : " + sqlUpdate + "\nparams : " + params);

    const [rows] = await conn.get().query(sqlUpdate, params);
    conn.releaseConn();
    return rows;
  },
  deleteBasket: async function (req) {
    var userId = Number(req.body.user_id);
    var itemId = Number(req.body.item_id);

    var sqlDelete = "DELETE FROM basket WHERE user_id = ? AND item_id = ?";
    var params = [userId, itemId];

    console.log("sqlDelete : " + sqlDelete + "\nparams : " + params);

    const [rows] = await conn.get().query(sqlDelete, params);
    conn.releaseConn();
    return rows;
  },
};
