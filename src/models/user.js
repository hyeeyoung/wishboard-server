const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { NotFound, Conflict } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');

module.exports = {
  signUp: async function (req) {
    const email = req.body.email;
    const password = req.body.password;

    const hashPassword = bcrypt.hashSync(password, 10);

    const sqlInsert =
      'INSERT IGNORE INTO users (email, password) VALUES (?, ?)';
    const params = [email, hashPassword];

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlInsert, params)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.validateEmail);
    }

    return Object.setPrototypeOf(rows, []);
  },
  signIn: async function (req) {
    const email = req.body.email;
    const sqlSelect =
      'SELECT user_id, email FROM users WHERE email = ? AND is_active = true';
    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, email);
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.unvalidateUser);
    }

    return Object.setPrototypeOf(rows, []);
  },
  validateEmail: async function (req) {
    const email = req.body.email;

    const sqlSelect = 'SELECT email, is_active FROM users WHERE email = ?';

    const connection = await pool.connection(async (conn) => conn);
    const [row] = await connection.query(sqlSelect, email);
    connection.release();

    return row.length >= 1
      ? { success: true, isActive: row[0].is_active }
      : false;
  },
  unActiveUserOne: async function (req) {
    const userId = Number(req.decoded);

    // const sqlDelete = 'DELETE FROM users WHERE user_id = ?';
    const sqlUpdate = 'UPDATE users SET is_active = false WHERE user_id = ?';

    const connection = await pool.connection(async (conn) => conn);
    await connection.beginTransaction();
    const [rows] = await connection
      .query(sqlUpdate, userId)
      .then(await connection.commit())
      .catch(await connection.rollback());
    connection.release();

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.userActiveUpdateNotFound);
    }
    return true;
  },
  // deleteUsers: async function (req) { //TODO 추후 유저 삭제 배치 작업 시 사용
  //   const userId = Number(req.decoded);

  //   const sqlDelete = 'DELETE FROM users WHERE is_active = false';

  //   const connection = await pool.connection(async (conn) => conn);
  //   await connection.beginTransaction();
  //   const [rows] = await connection
  //     .query(sqlDelete, userId)
  //     .then(await connection.commit())
  //     .catch(await connection.rollback());
  //   connection.release();

  //   if (rows.affectedRows < 1) {
  //     throw new NotFound(ErrorMessage.userDeleteError);
  //   }
  //   return true;
  // },
  validateNickname: async function (req) {
    if (!req.body.nickname) {
      return true;
    }
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
  updateImage: async function (req) {
    const userId = Number(req.decoded);
    const profileImg = req.body.profile_img;

    const sqlUpdate = 'UPDATE users SET profile_img = ? WHERE user_id = ?';
    const params = [profileImg, userId];

    console.log(sqlUpdate);
    console.log(params);

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
      'SELECT email, profile_img, nickname, push_state FROM users WHERE user_id = ?';

    const connection = await pool.connection(async (conn) => conn);
    const [rows] = await connection.query(sqlSelect, userId);
    connection.release();

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.userNotFound);
    }
    return Object.setPrototypeOf(rows, []);
  },
};
