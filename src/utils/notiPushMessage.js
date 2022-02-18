const { Strings } = require('./strings');

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

function oneDataMessage(itemNotiType, itemId, deviceFcmToken) {
  message.notification.body = itemNotiType + Strings.haveItNoti;
  message.data.itemId = String(itemId);
  message.token = deviceFcmToken;
  return message;
}

function anyDataMessage(itemNotiType, itemId, notiCount, deviceFcmToken) {
  message.notification.body =
    itemNotiType +
    Strings.besidesTheNoti +
    notiCount +
    Strings.anyMore +
    Strings.haveItNoti;
  message.data.itemId = String(itemId);
  message.token = deviceFcmToken;
  return message;
}

module.exports = { oneDataMessage, anyDataMessage };
