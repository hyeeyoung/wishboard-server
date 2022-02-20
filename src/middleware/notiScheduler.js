const { firebaseAdmin } = require('../config/firebaseAdmin');
const Noti = require('../models/noti');
const { oneDataMessage, anyDataMessage } = require('../utils/notiPushMessage');
const logger = require('../config/winston');
const { SuccessMessage, ErrorMessage } = require('../utils/response');

async function sendFcmTokenToFirebase(message) {
  try {
    const response = await firebaseAdmin.messaging().send(message);
    logger.info(`${SuccessMessage.notiFCMSend}: ${response}`);
    return true;
  } catch (e) {
    const firebaseError = { err: e };
    if (firebaseError.err.code == 'messaging/invalid-payload') {
      logger.error(ErrorMessage.notiFCMSendError);
    } else {
      logger.error(e);
    }
    return false;
  }
}

module.exports = {
  /*
   * @params: sendSchduledService()
   * 1분마다 noti 테이블 조회하여 유저별로 5분 뒤에 알림을 보내야 할 데이터가 있는지 탐색
   * 데이터가 있을 경우 firebase에 fcm 토큰 전송
   */
  sendSchduledService: async function (req, res) {
    await Noti.selectNotiFrom5minAgo(req)
      .then((notiData) => {
        let message;
        if (notiData.length === 1) {
          message = oneDataMessage(
            notiData[0].item_notification_type,
            notiData[0].item_id,
            notiData[0].fcm_token,
          );
        } else {
          const notiCount = notiData.length;
          message = anyDataMessage(
            notiData[0].item_notification_type,
            notiData[0].item_id,
            notiCount,
            notiData[0].fcm_token,
          );
        }
        sendFcmTokenToFirebase(message).catch(() => {
          logger.error(ErrorMessage.notiSendFailed);
          return res.status(StatusCode.NOTFOUND).json({
            success: false,
            message: SuccessMessage.notiPushServiceExit,
          });
        });
      })
      .catch((err) => logger.info(err));
  },
};
