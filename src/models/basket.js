const conn = require("../config/db");

module.exports = {
  selectBasket: async function (req) {
    var user_id = Number(req.params.user_id);

    var sql_select =
      "SELECT a.item_id, a.item_image, a.item_name, a.item_price, b.item_count FROM items a JOIN basket b ON a.item_id = b.item_id WHERE b.user_id = ? ORDER BY a.item_id DESC";

    console.log("sql_select : " + sql_select);

    const [rows] = await conn.get().query(sql_select, user_id);
    conn.releaseConn();
    return rows;
  },
  insertBasket: async function (req) {
    var user_id = Number(req.body.user_id);
    var item_id = Number(req.body.item_id);

    var sql_insert =
      "INSERT INTO basket (user_id, item_id, item_count) VALUES (?, ?, 1)";
    var params = [user_id, item_id];

    console.log("sql_insert : " + sql_insert);

    const [rows] = await conn.get().query(sql_insert, params);
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
    var user_id = req.body[0].user_id; // @prams: user_id는 한 명이므로
    var sql_update = "UPDATE basket SET item_count = CASE ";
    var params = [];

    for (var i = 0; i < req.body.length; i++) {
      sql_update += "WHEN item_id = ? then ? ";
      params.push(req.body[i].item_id);
      params.push(req.body[i].item_count);
      if (i == req.body.length - 1) {
        //마지막 원소라면
        sql_update += "ELSE item_count END WHERE user_id = ?";
        params.push(user_id);
      }
    }

    console.log("sql_update : " + sql_update + "\nparams : " + params);

    const [rows] = await conn.get().query(sql_update, params);
    conn.releaseConn();
    return rows;
  },
  deleteBasket: async function (req) {
    var user_id = Number(req.body.user_id);
    var item_id = Number(req.body.item_id);

    var sql_delete = "DELETE FROM basket WHERE user_id = ? AND item_id = ?";
    var params = [user_id, item_id];

    console.log("sql_delete : " + sql_delete + "\nparams : " + params);

    const [rows] = await conn.get().query(sql_delete, params);
    conn.releaseConn();
    return rows;
  },
};
