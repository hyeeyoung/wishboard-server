const conn = require("../config/db");
const bcrypt = require("bcryptjs");

module.exports = {
  signUp: async function (req) {
    var email = req.body.email;
    var beforePw = req.body.password;
    var optionNotification = req.body.option_notification;

    //DB에 저장되는 비밀번호를 암호화
    const password = bcrypt.hashSync(beforePw, 10);

    var sqlInsert =
      "INSERT INTO users (email, password, option_notification) VALUES (?, ?, ?)";
    var params = [email, password, optionNotification];

    console.log(sqlInsert);

    await (await conn.get().getConnection()).beginTransaction();
    const [rows] = await conn
      .get()
      .query(sqlInsert, params)
      .then((await conn.get().getConnection()).commit())
      .catch((await conn.get().getConnection()).rollback());
    conn.releaseConn();
    return rows;
  },

  signIn: async function (req) {
    var email = req.body.email;

    var sqlSelect =
      "SELECT user_id, email, password FROM users WHERE email = ?";

    console.log("sqlSelect : " + sqlSelect);

    const [rows] = await conn.get().query(sqlSelect, email);
    conn.releaseConn();
    return rows;
  },
};
