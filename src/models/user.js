const conn = require("../config/db");
const bcrypt = require("bcrypt");

module.exports = {
  signUp: async function (req) {
    var email = req.body.email;
    var before_pw = req.body.password;
    var option_notification = req.body.option_notification;

    //DB에 저장되는 비밀번호를 암호화
    const password = bcrypt.hashSync(before_pw, 10);

    var sql_insert =
      "INSERT INTO users (email, password, option_notification) VALUES (?, ?, ?)";
    var params = [email, password, option_notification];

    console.log(sql_insert);

    const [rows] = await conn.get().query(sql_insert, params);
    conn.releaseConn();
    return rows;
  },

  signIn: async function (req) {
    var email = req.body.email;

    var sql_select =
      "SELECT user_id, email, password FROM users WHERE email = ?";

    console.log("sqlSelect : " + sql_select);

    const [rows] = await conn.get().query(sql_select, email);
    conn.releaseConn();
    return rows;
  },
};
