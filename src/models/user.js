const bcrypt = require('bcryptjs');
const { NotFound, Conflict } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');
const db = require('../config/db');
const { trimToString } = require('../utils/util');
const S3ImageUtils = require('../utils/S3ImageUtils');

module.exports = {
  signUp: async function (req) {
    const email = req.body.email;
    const password = req.body.password;
    const fcmToken = req.body.fcmToken;

    const hashPassword = bcrypt.hashSync(password, 10);

    const sqlSelect =
      'SELECT user_id, fcm_token FROM users WHERE fcm_token = ?';
    const [selectRows] = await db.query(sqlSelect, [fcmToken]);

    if (selectRows.length > 1) {
      const sqlUpdate = 'UPDATE users SET fcm_token = null WHERE user_id = ?';
      const [updateRows] = await db.queryWithTransaction(sqlUpdate, [
        selectRows[0].user_id,
      ]);

      if (updateRows.affectedRows < 1) {
        throw new NotFound(ErrorMessage.failedUpdateFcmToken);
      }
    }

    const sqlInsert =
      'INSERT IGNORE INTO users (email, password, fcm_token) VALUES (?, ?, ?)';
    const params = [email, hashPassword, fcmToken];

    const [rows] = await db.queryWithTransaction(sqlInsert, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.existsUserFcmToken);
    }
    return rows.insertId;
  },
  signIn: async function (req) {
    const email = req.body.email;
    const password = req.body.password;
    const fcmToken = req.body.fcmToken;

    const sqlSelect =
      'SELECT user_id, email, nickname, fcm_token, password, is_active FROM users WHERE email = ?';
    const [selectRows] = await db.query(sqlSelect, [email]);

    if (selectRows.length < 1) {
      throw new NotFound(ErrorMessage.unValidateUser);
    }

    const checkPassword = bcrypt.compareSync(password, selectRows[0].password);

    // fcm 토큰이 다른 유저에 존재한다면, null 처리
    const sqlSelectByFcmToken =
      'SELECT user_id, fcm_token FROM users WHERE fcm_token = ?';
    const [selectFcmToken] = await db.query(sqlSelectByFcmToken, [fcmToken]);

    if (selectFcmToken.length >= 1) {
      const sqlUpdate = 'UPDATE users SET fcm_token = null WHERE user_id = ?';
      const [updateRows] = await db.queryWithTransaction(sqlUpdate, [
        selectFcmToken[0].user_id,
      ]);

      if (updateRows.affectedRows < 1) {
        throw new NotFound(ErrorMessage.failedUpdateFcmToken);
      }
    }

    // 현재 유저로 fcm 토큰 갱신
    if (selectRows[0].fcm_token !== fcmToken) {
      const sqlUpdate = 'UPDATE users SET fcm_token = ? WHERE user_id = ?';
      const params = [fcmToken, selectRows[0].user_id];

      const [updateRows] = await db.queryWithTransaction(sqlUpdate, params);

      if (updateRows.affectedRows < 1) {
        throw new NotFound(ErrorMessage.failedUpdateFcmToken);
      }
    }

    return {
      result: checkPassword,
      userId: selectRows[0].user_id,
      nickname: selectRows[0].nickname,
    };
  },
  restartSignIn: async function (req) {
    const email = req.body.email;
    const fcmToken = req.body.fcmToken;

    const sqlSelect =
      'SELECT user_id, email, nickname FROM users WHERE email = ? AND is_active = true';

    const [rows] = await db.query(sqlSelect, [email]);

    if (rows.length > 1) {
      throw new NotFound(ErrorMessage.unValidateUser);
    }

    if (rows[0].fcm_token !== fcmToken) {
      const sqlUpdate = 'UPDATE users SET fcm_token = ? WHERE user_id = ?';
      const params = [fcmToken, rows[0].user_id];

      const [updateRows] = await db.queryWithTransaction(sqlUpdate, params);

      if (updateRows.affectedRows < 1) {
        throw new NotFound(ErrorMessage.failedUpdateFcmToken);
      }
    }

    return Object.setPrototypeOf(rows, []);
  },
  selectUser: async function (userId) {
    const sqlSelect = 'SELECT * FROM users WHERE user_id = ?';

    const [rows] = await db.query(sqlSelect, [userId]);

    if (rows.length > 1) {
      throw new NotFound(ErrorMessage.unValidateUser);
    }

    return rows[0].is_active === true ? true : false;
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
    const nickname = trimToString(req.body.nickname);

    const sqlSelect = 'SELECT nickname FROM users WHERE nickname = ?';

    const [rows] = await db.query(sqlSelect, [nickname]);

    if (rows.length >= 1) {
      throw new Conflict(ErrorMessage.validateNickname);
    }

    return false;
  },
  updateImage: async function (req) {
    const userId = Number(req.decoded);

    S3ImageUtils.deleteProfileImg(userId);

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
    const nickname = trimToString(req.body.nickname);

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
    const nickname = trimToString(req.body.nickname);

    const image = { originalname: '', location: '' };
    if (req.file != undefined) {
      S3ImageUtils.deleteProfileImg(userId);

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
    const fcmToken = null;

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
    const newPassword = req.body.newPassword;
    const hashPassword = bcrypt.hashSync(newPassword, 10);

    const sqlUpdate = 'UPDATE users SET password = ? WHERE user_id = ?';
    const params = [hashPassword, userId];

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
      deleteImages.map(async (item) => {
        if (!item.profile_img) {
          await multer.s3Delete(item.profile_img);
        }
      }),
    );

    // db에서 삭제
    const [rows] = await db.queryWithTransaction(sqlDelete);

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.unActvieUserDelete);
    }

    return Number(rows.affectedRows);
  },
  deleteUser: async function (req) {
    const userId = Number(req.decoded);
    const sqlDelete = 'DELETE FROM users WHERE user_id = ?';

    // s3에서 삭제
    S3ImageUtils.deleteItemImgAll(userId);
    S3ImageUtils.deleteProfileImg(userId);

    const [rows] = await db.queryWithTransaction(sqlDelete, [userId]);

    if (rows.affectedRows < 1) {
      throw new NotFound(ErrorMessage.userDelete);
    }

    return true;
  },
};
