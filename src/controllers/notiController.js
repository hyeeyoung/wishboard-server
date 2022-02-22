const Noti = require('../models/noti');
const logger = require('../config/winston');
const {
  StatusCode,
  SuccessMessage,
  ErrorMessage,
} = require('../utils/response');
const { BadRequest } = require('../utils/errors');
const schedule = require('node-schedule');
const { Strings } = require('../utils/strings');
const { sendSchduledService } = require('../middleware/notiScheduler');

const task = schedule;

module.exports = {
  selectNotiInfo: async function (req, res, next) {
    await Noti.selectNoti(req)
      .then((result) => {
        res.status(StatusCode.OK).json(result);
      })
      .catch((err) => {
        next(err);
      });
  },
  updateNotiReadStateInfo: async function (req, res, next) {
    await Noti.updateNotiReadState(req)
      .then(() => {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.notiReadStateUpdate,
        });
      })
      .catch((err) => {
        next(err);
      });
  },
  scheduleSettings: async function (req, res, next) {
    try {
      if (!req.query.push) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      const pushService = req.query.push === 'true' ? true : false;

      if (pushService) {
        logger.info(Strings.pushNotiSchedulerStart);
        task.scheduleJob('0/5 * * * *', function () {
          sendSchduledService(req);
        });
        return res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.notiPushServiceStart,
        });
      } else {
        if (task != null) {
          logger.info(Strings.pushNotiSchedulerEnd);
          task.gracefulShutdown();
        }
        return res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.notiPushServiceExit,
        });
      }
    } catch (err) {
      next(err);
    }
  },
};
