const { Strings } = require('./strings');

require('dotenv').config({ path: '../.env' });

const message = {
  notification: {
    title: Strings.notiMessageTitle,
    body: '',
  },
  data: {
    notiType: '',
    itemId: '',
    pushType: Strings.NOTI_SCREEN,
  },
  token: '',
};

function dataMessage(itemNotiType, itemId, deviceFcmToken) {
  message.notification.body = Strings.notiMessageDescription;
  message.data.notiType = itemNotiType;
  message.data.itemId = String(itemId);
  message.token = deviceFcmToken;
  return message;
}

function dataMessageWithCount(itemNotiType, itemId, notiCount, deviceFcmToken) {
  message.notification.body =
    `${notiCount}개의 ` + Strings.notiMessageDescription;
  message.data.notiType = itemNotiType;
  message.data.itemId = String(itemId);
  message.token = deviceFcmToken;
  return message;
}

module.exports = { dataMessage, dataMessageWithCount };
