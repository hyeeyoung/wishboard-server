const pool = require("../config/db");
const bcrypt = require("bcryptjs");

module.exports = {
  signUp: async function (req) {
    var email = req.body.email;
    var beforePw = req.body.password;
    var nickname = req.body.nickname;
    var profileImg = req.body.profile_img;

    //DB에 저장되는 비밀번호를 암호화
    const password = bcrypt.hashSync(beforePw, 10);

    var sqlInsert =
      "INSERT INTO users (email, password, nickname, profile_img) VALUES (?, ?, ?, ?)";
    var params = [email, password, nickname, profileImg];

    console.log(sqlInsert);

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

    console.log("sqlSelect : " + sqlSelect);

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, email);
    connection.release();
    return rows;
  },
};
