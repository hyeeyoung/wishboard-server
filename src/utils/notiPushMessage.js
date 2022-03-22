const { Strings } = require('./strings');

// multicast 방식
const message = {
  notification: {
    title: Strings.notiMessageTitle,
    body: Strings.notiMessageDescription,
  },
  tokens: '',
};

module.exports = { message };
