const { Strings } = require('./strings');

require('dotenv').config({ path: '../.env' });

// 프론트에서 NotiType 변경 시 key, value 값 통일해야함
const notiType = {
  RESTOCK: '재입고',
  OPEN_DAY: '오픈일',
  PREORDER_CLOSE: '프리오더 마감',
  SALE_START: '세일 시작',
  SALE_CLOSE: '세일 마감',
};

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
  message.notification.body = `${notiType.itemNotiType} ${Strings.notiMessageDescription}`;
  message.data.itemId = String(itemId);
  message.token = deviceFcmToken;
  return message;
}

function dataMessageWithCount(itemNotiType, itemId, notiCount, deviceFcmToken) {
  message.notification.body = `${notiType.itemNotiType} 알림 외 ${notiCount}개의 ${Strings.notiMessageDescription}`;
  message.data.itemId = String(itemId);
  message.token = deviceFcmToken;
  return message;
}

module.exports = { dataMessage, dataMessageWithCount };
