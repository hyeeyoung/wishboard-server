const Noti = require("../models/noti");
const logger = require("../config/winston");
const { BadRequest } = require("../utils/errors");
const { Strings } = require("../utils/strings");
const {
  StatusCode,
  SuccessMessage,
  ErrorMessage,
} = require("../utils/response");

const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const TAG = "notiContoller ";

function sendNotification(message) {
  return admin.messaging().send(message)
    .then(function (response) {
      logger.info(`${SuccessMessage.notiFCMSend}: ${response}`)
      return true
    })
    .catch(function (err) {
      logger.error(TAG + err)
      return false
    });
}

module.exports = {
  selectNotiInfo: async function (req, res, next) {
    await Noti.selectNoti(req)
      .then((result) => {
        logger.info(TAG + result);
        res.status(StatusCode.OK).json(result);
      })
      .catch((err) => {
        next(err);
      });
  },
  insertNotiInfo: async function (req, res, next) {
    try {
      if (!req.body.item_id || !req.body.item_notification_type || !req.body.item_notification_date) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }

      const message = {
        data: {
          title: Strings.notiMessageTitle,
          message: `${req.body.item_notification_type} ${Strings.notiMessageDescription}`,
          isScheduled: Strings.true,
          scheduledTime: req.body.item_notification_date
        },
        token: req.body.fcm_token
      };

      const isSuccessful = await sendNotification(message)
      if (!isSuccessful) {
        return res.status(StatusCode.BADREQUEST).json({
          success: false,
          message: ErrorMessage.notiFCMSendError,
        });
      }

      const result = await Noti.insertNoti(req);
      if (result) {
        return res.status(StatusCode.CREATED).json({
          success: true,
          message: SuccessMessage.notiInsert,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  updateNotiInfo: async function (req, res, next) {
    try {
      if (!req.body.item_id || !req.body.item_notification_type || !req.body.item_notification_date) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      await Noti.updateNoti(req).then((result) => {
        if (result) {
          res.status(StatusCode.OK).json({
            success: true,
            message: SuccessMessage.notiUpdate,
          });
        }
      });
    } catch (err) {
      next(err);
    }
  },
  updateNotiReadStateInfo: async function (req, res, next) {
    try {
      if (!req.body.item_id) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      await Noti.updateNotiReadState(req).then((result) => {
        if (result) {
          res.status(StatusCode.OK).json({
            success: true,
            message: SuccessMessage.notiReadStateUpdate,
          });
        }
      });
    } catch (err) {
      next(err);
    }
  },
  deleteNotiInfo: async function (req, res, next) {
    try {
      if (!req.body.item_id) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      const result = await Noti.deleteNoti(req);
      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.notiDelete,
        });
      }
    } catch (err) {
      next(err);
    }
  },
};
