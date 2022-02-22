const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { NotFound, Conflict } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');

module.exports = {
  signUp: async function (req) {
    const email = req.body.email;
    const beforePw = req.body.password;

    const password = bcrypt.hashSync(beforePw, 10);

    const sqlInsert = 'INSERT INTO users (email, password) VALUES (?, ?)';
    const params = [email, password];

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
    const email = req.body.email;

    const sqlSelect =
      'SELECT user_id, email, password FROM users WHERE email = ?';

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, email);
    connection.release();
    return rows;
  },
  vaildateEmail: async function (req) {
    const email = req.body.email;

    const sqlSelect = 'SELECT email FROM users WHERE email = ?';

    const connection = await pool.connection(async (conn) => conn);
    const row = await connection.query(sqlSelect, email);
    connection.release();

    if (row.length >= 1) {
      throw new Conflict(ErrorMessage.vaildateEmail);
    }

    return false;
  },
  deleteUser: async function (req) {
    const userId = Number(req.decoded);

    const sqlDelete = 'DELETE FROM users WHERE user_id = ?';

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlDelete, userId)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.userDeleteError);
    }
    return true;
  },
  updateImage: async function (req) {
    const userId = Number(req.decoded);
    const profileImg = req.body.profile_img;

    const sqlUpdate = 'UPDATE users SET profile_img = ? WHERE user_id = ?';
    const params = [profileImg, userId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.userProfileImgUpdateNotFound);
    }
    return true;
  },
  updateNickname: async function (req) {
    const userId = Number(req.decoded);
    const nickname = req.body.nickname;

    const sqlUpdate = 'UPDATE users SET nickname = ? WHERE user_id = ?';
    const params = [nickname, userId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.userNickNameUpdateNotFound);
    }
    return true;
  },
  updateInfo: async function (req) {
    const userId = Number(req.decoded);
    const nickname = req.body.nickname;
    const profileImg = req.body.profile_img;

    const sqlUpdate =
      'UPDATE users SET nickname = ?, profile_img = ? WHERE user_id = ?';
    const params = [nickname, profileImg, userId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.userInfoUpdateNotFound);
    }
    return true;
  },
  updateFCM: async function (req) {
    const userId = Number(req.decoded);
    const fcmToken = req.body.fcm_token;

    const sqlUpdate = 'UPDATE users SET fcm_token = ? WHERE user_id = ?';
    const params = [fcmToken, userId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.userFcmTokenUpdateNotFound);
    }

    return true;
  },
  updatePushState: async function (req, pushState) {
    const userId = Number(req.decoded);

    const sqlUpdate = 'UPDATE users SET push_state = ? WHERE user_id = ?';
    const params = [pushState, userId];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.userPushStateUpdateNotFound);
    }

    return true;
  },
  selectInfo: async function (req) {
    const userId = Number(req.decoded);

    const sqlSelect =
      'SELECT email, profile_img, nickname, fcm_token FROM users WHERE user_id = ?';

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, userId);
    connection.release();

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.userNotFound);
    }
    return Object.setPrototypeOf(rows, []);
  },
};
