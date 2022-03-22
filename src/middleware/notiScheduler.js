const { firebaseAdmin } = require('../config/firebaseAdmin');
const Noti = require('../models/noti');
const { message } = require('../utils/notiPushMessage');
const logger = require('../config/winston');
const { SuccessMessage, ErrorMessage } = require('../utils/response');

async function sendFcmTokenToFirebase(message) {
  try {
    const response = await firebaseAdmin.messaging().sendMulticast(message); // 멀티캐스팅
    logger.info(SuccessMessage.notiFCMSend);
    logger.info(response); //* 추후 삭제
    // failureCount 존재 시 예외처리
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(registrationTokens[idx]);
        }
      });
      message.tokens = failedTokens; // 실패 토큰으로 메세지 재정의
      // 실패 토큰에 한하여 재전송
      const response = await firebaseAdmin.messaging().sendMulticast(message);
      logger.info(`${SuccessMessage.notiFCMSend}: ${response}`);
    }
    return true;
  } catch (e) {
    const firebaseError = { err: e };
    if (firebaseError.err.code == 'messaging/invalid-payload') {
      console.log(e);
      logger.error(ErrorMessage.notiFCMSendError);
    } else {
      logger.error(e);
    }
    return false;
  }
}

module.exports = {
  /*
   * @params: sendPushNotification()
   * 30분마다 noti 테이블 조회하여 유저별로 알림을 보내야 할 데이터가 있는지 탐색
   * 데이터가 있을 경우 firebase에 fcm 토큰 전송
   */
  sendPushNotification: async function () {
    await Noti.selectNotiFrom30minAgo()
      .then((notiTokens) => {
        // multicast 형식
        message.tokens = notiTokens;
        sendFcmTokenToFirebase(message).catch(() => {
          logger.error(ErrorMessage.notiSendFailed);
        });
      })
      .catch((err) => logger.info(err));
  },
};
