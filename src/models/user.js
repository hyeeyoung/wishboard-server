const pool = require("../config/db");
const bcrypt = require("bcryptjs");

module.exports = {
  signUp: async function (req) {
    var email = req.body.email;
    var beforePw = req.body.password;

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
  deleteUser: async function (req) {
    var userId = Number(req.decoded);

    var sqlDelete = "DELETE FROM users WHERE user_id = ?";

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlDelete, userId)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();
    return rows[0];
  },
  updateImage: async function (req) {
    var userId = Number(req.decoded);
    var profileImg = req.body.profile_img;

    var sqlUpdate = "UPDATE users SET profile_img = ? WHERE user_id = ?";
    var params = [profileImg, userId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();
    return rows.affectedRows >= 1 ? true : false;
  },
  updateNickname: async function (req) {
    var userId = Number(req.decoded);
    var nickname = req.body.nickname;

    var sqlUpdate = "UPDATE users SET nickname = ? WHERE user_id = ?";
    var params = [nickname, userId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();
    return rows.affectedRows >= 1 ? true : false;
  },
  updateInfo: async function (req) {
    var userId = Number(req.decoded);
    var nickname = req.body.nickname;
    var profileImg = req.body.profile_img;

    var sqlUpdate =
      "UPDATE users SET nickname = ?, profile_img = ? WHERE user_id = ?";
    var params = [nickname, profileImg, userId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();
    return rows.affectedRows >= 1 ? true : false;
  },
  // updateFCM: async function (req) { // TODO
  //   var userId = Number(req.decoded);
  //   var fcmToken = req.body.fcm_token;

  //   var sqlUpdate = "UPDATE users SET fcm_token = ? WHERE user_id = ?";
  //   var params = [fcmToken, userId];

  //   const connection = await pool.connection(async (conn) => conn);
  //   await connection.beginTransaction();
  //   const [rows] = await connection
  //     .query(sqlUpdate, params)
  //     .then(await connection.commit())
  //     .catch(await connection.rollback());
  //   connection.release();
  //   return rows.affectedRows >= 1 ? true : false;
  // },
  selectInfo: async function (req) {
    var userId = Number(req.decoded);

    var sqlSelect =
      "SELECT email, profile_img, nickname, fcm_token FROM users WHERE user_id = ?";

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, userId);
    connection.release();
    return rows;
  },
};
