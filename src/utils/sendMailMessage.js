const fromEmail = process.env.WISHBOARD_NAVER_ID;
const message = {
  from: `WishBoard ${fromEmail}`,
  to: '',
  subject: '[Wishboard] 이메일 로그인을 위한 인증번호를 보내드려요.',
  html: '',
  certificationNumber: '',
};

function generateMessage(toEmail, verificationCode) {
  message.to = toEmail;
  message.certificationNumber = verificationCode;
  message.html = generateHTML(verificationCode);
  return message;
}

function generateHTML(verificationCode) {
  return (
    `
    <p>로그인 화면에서 아래의 인증번호를 입력하고 로그인을 완료해주세요. 인증코드는 5분 동안 유효합니다.</p>
    <br />
    <h3>` +
    verificationCode +
    `</h3>
    <br />
    <p>혹시 요청하지 않은 인증 메일을 받으셨나요? 걱정하지 마세요. </p>
    <p>고객님의 이메일 주소가 실수로 입력된 것일 수 있어요. 직접 요청한 인증 메일이 아닌 경우 무시해주세요.</p>
    <br />
    <p>멋진 하루 보내세요!</p>
    <br />
    <p>Wishboard 팀 드림</p>
    `
  );
}

module.exports = { generateMessage, generateHTML };
