const { Strings } = require('./strings');
const { NotiType } = require('./notiType');
require('dotenv').config({ path: '../.env' });

const message = {
  notification: {
    title: Strings.notiMessageTitle,
    body: '',
  },
  data: {
    itemId: '',
    pushType: Strings.NOTI_SCREEN,
  },
  token: '',
};

function dataMessage(itemNotiType, itemId, deviceFcmToken) {
  message.notification.body = `${NotiType[itemNotiType]} ${Strings.notiMessageDescription}`;
  message.data.itemId = String(itemId);
  message.token = deviceFcmToken;
  return message;
}

function dataMessageWithCount(itemNotiType, itemId, notiCount, deviceFcmToken) {
  message.notification.body = `${NotiType[itemNotiType]} 알림 외 ${notiCount}개의 ${Strings.notiMessageDescription}`;
  message.data.itemId = String(itemId);
  message.token = deviceFcmToken;
  return message;
}

module.exports = { dataMessage, dataMessageWithCount };
