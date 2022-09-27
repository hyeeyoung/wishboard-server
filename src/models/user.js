const bcrypt = require('bcryptjs');
const { NotFound, Conflict } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');
const db = require('../config/db');

module.exports = {
  signUp: async function (req) {
    const email = req.body.email;
    const password = req.body.password;

    const hashPassword = bcrypt.hashSync(password, 10);

    const sqlInsert =
      'INSERT IGNORE INTO users (email, password) VALUES (?, ?)';
    const params = [email, hashPassword];

    const [rows] = await db.queryWithTransaction(sqlInsert, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.validateEmail);
    }

    return Object.setPrototypeOf(rows, []);
  },
  signIn: async function (req) {
    const email = req.body.email;

    const sqlSelect =
      'SELECT user_id, email FROM users WHERE email = ? AND is_active = true';

    const [rows] = await db.query(sqlSelect, [email]);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.unValidateUser);
    }

    return Object.setPrototypeOf(rows, []);
  },
  validateEmail: async function (req) {
    const email = req.body.email;

    const sqlSelect = 'SELECT email, is_active FROM users WHERE email = ?';

    const [row] = await db.query(sqlSelect, [email]);

    return row.length >= 1
      ? { success: true, isActive: row[0].is_active }
      : false;
  },
  unActiveUserOne: async function (req) {
    const userId = Number(req.decoded);

    const sqlUpdate = 'UPDATE users SET is_active = false WHERE user_id = ?';

    const [rows] = await db.queryWithTransaction(sqlUpdate, [userId]);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.userActiveUpdateNotFound);
    }
    return true;
  },
  validateNickname: async function (req) {
    if (!req.body.nickname) {
      return true;
    }
    const nickname = req.body.nickname;

    const sqlSelect = 'SELECT nickname FROM users WHERE nickname = ?';

    const [rows] = await db.query(sqlSelect, [nickname]);

    if (rows.length >= 1) {
      throw new Conflict(ErrorMessage.validateNickname);
    }

    return false;
  },
  updateImage: async function (req) {
    const userId = Number(req.decoded);

    const image = { originalname: '', location: '' };
    if (req.file != undefined) {
      image.originalname = req.file.key;
      image.location = req.file.location;
    }

    const sqlUpdate =
      'UPDATE users SET profile_img = ?, profile_img_url = ?  WHERE user_id = ?';
    const params = [image.originalname, image.location, userId];

    const [rows] = await db.queryWithTransaction(sqlUpdate, params);

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

    const [rows] = await db.queryWithTransaction(sqlUpdate, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.userNickNameUpdateNotFound);
    }
    return true;
  },
  updateInfo: async function (req) {
    const userId = Number(req.decoded);
    const nickname = req.body.nickname;

    const image = { originalname: '', location: '' };
    if (req.file != undefined) {
      image.originalname = req.file.key;
      image.location = req.file.location;
    }

    const sqlUpdate =
      'UPDATE users SET nickname = ?, profile_img = ?, profile_img_url = ?   WHERE user_id = ?';
    const params = [nickname, image.originalname, image.location, userId];

    const [rows] = await db.queryWithTransaction(sqlUpdate, params);

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

    const [rows] = await db.queryWithTransaction(sqlUpdate, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.userFcmTokenUpdateNotFound);
    }
    return true;
  },
  updatePushState: async function (req, pushState) {
    const userId = Number(req.decoded);

    const sqlUpdate = 'UPDATE users SET push_state = ? WHERE user_id = ?';
    const params = [pushState, userId];

    const [rows] = await db.queryWithTransaction(sqlUpdate, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.userPushStateUpdateNotFound);
    }
    return true;
  },
  updatePassword: async function (req) {
    const userId = Number(req.decoded);
    const email = req.body.email;
    const password = req.body.password;
    const hashPassword = bcrypt.hashSync(password, 10);

    const sqlUpdate =
      'UPDATE users SET password = ? WHERE email = ? AND user_id = ?';
    const params = [hashPassword, email, userId];

    const [rows] = await db.queryWithTransaction(sqlUpdate, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.userPasswordUpdateNotFound);
    }

    return true;
  },
  selectInfo: async function (req) {
    const userId = Number(req.decoded);

    const sqlSelect =
      'SELECT email, profile_img_url, nickname, push_state FROM users WHERE user_id = ?';

    const [rows] = await db.query(sqlSelect, [userId]);

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.userNotFound);
    }
    return Object.setPrototypeOf(rows, []);
  },
  unActiveUsersDelete: async function () {
    const sqlSelect =
      'SELECT profile_img_url FROM users WHERE is_active = false AND DATE(update_at) = DATE(NOW() - INTERVAL 7 DAY)';
    const sqlDelete =
      'DELETE FROM users WHERE is_active = false AND DATE(update_at) = DATE(NOW() - INTERVAL 7 DAY)';

    const [deleteImages] = await db.query(sqlSelect);

    // s3에서 삭제
    await Promise.all(
      deleteImages.map(async (imageName) => {
        await multer.s3Delete(imageName.profile_img);
      }),
    );

    // db에서 삭제
    const [rows] = await db.queryWithTransaction(sqlDelete);

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.unActvieUserDelete);
    }

    return Number(rows.affectedRows);
  },
};
