require('dotenv').config({ path: '../.env' });

const fromEmail = process.env.WISHBOARD_NAVER_ID;
const links = process.env.FIREBASE_LINK_TO_ANDROID;

const message = {
  from: `WishBoard ${fromEmail}`,
  to: '',
  subject: '[WishBoard] 비밀번호 찾기를 위한 링크가 도착했습니다.',
  html: `
        <h3> 안녕하세요. Wishboard 입니다. </h3>
        <h3> 아래 링크를 클릭하여 앱으로 돌아가 새 비밀번호로 재설정 해주세요. </h3>
        <h3> 감사합니다. </h3>
    `,
};

function generateMessage(toEmail) {
  message.to = toEmail;
  message.html += `<a href="${links}"> ${links} </h3>`;
  return message;
}

module.exports = { generateMessage };
