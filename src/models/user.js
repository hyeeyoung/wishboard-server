const pool = require("../config/db");
const bcrypt = require("bcryptjs");

module.exports = {
  signUp: async function (req) {
    var email = req.body.email;
    var beforePw = req.body.password;

    //DB에 저장되는 비밀번호를 암호화
    const password = bcrypt.hashSync(beforePw, 10);

    var sqlInsert = "INSERT INTO users (email, password) VALUES (?, ?)";
    var params = [email, password];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlInsert, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();
    return rows;
  },

  signIn: async function (req) {
    var email = req.body.email;

    var sqlSelect =
      "SELECT user_id, email, password FROM users WHERE email = ?";

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, email);
    connection.release();
    return rows;
  },

  vaildateEmail: async function (req) {
    var email = req.body.email;

    var sqlSelect = "SELECT email FROM users WHERE email = ?";

    const connection = await pool.connection(async (conn) => conn);
    const row = await connection.query(sqlSelect, email);
    connection.release();
    return row[0].length >= 1 ? true : false;
  },
};
