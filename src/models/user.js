const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { NotFound, Conflict } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');

module.exports = {
  signUp: async function (req) {
    const email = req.body.email;
    const password = req.body.password;

    const hashPassword = bcrypt.hashSync(password, 10);

    const sqlInsert = 'INSERT INTO users (email, password) VALUES (?, ?)';
    const params = [email, hashPassword];

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
  validateEmail: async function (req) {
    const email = req.body.email;

    const sqlSelect = 'SELECT email FROM users WHERE email = ?';

    const connection = await pool.connection(async (conn) => conn);
    const row = await connection.query(sqlSelect, email);
    connection.release();

    return row[0].length >= 1 ? true : false;
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
  validateNickname: async function (req) {
    const nickname = req.body.nickname;

    const sqlSelect = 'SELECT nickname FROM users WHERE nickname = ?';

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, nickname);
    connection.release();

    if (rows.length >= 1) {
      throw new Conflict(ErrorMessage.validateNickname);
    }

    return false;
  },
  updateInfo: async function (req) {
    const userId = Number(req.decoded);
    const nickname = req.body.nickname;
    const profileImg = req.body.profile_img;

    let sqlUpdate = 'UPDATE users SET nickname = ?';
    const params = [nickname];

    if (profileImg) {
      sqlUpdate += ' , profile_img = ?';
      params.push(profileImg);
    }
    sqlUpdate += ' WHERE user_id = ?';
    params.push(userId);

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
  updatePasswrod: async function (req) {
    const email = req.body.email;
    const password = req.body.password;
    const hashPassword = bcrypt.hashSync(password, 10);

    const sqlUpdate = 'UPDATE users SET password = ? WHERE email = ?';
    const params = [hashPassword, email];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.userPasswordUpdateNotFound);
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
