const StatusCode = {
  OK: 200,
  CREATED: 201,
  NOCONTENT: 204,
  BADREQUEST: 400,
  UNAUTHORIZED: 401,
  NOTFOUND: 404,
  CONFLICT: 409,
};

const SuccessMessage = {
  /* 아이템 및 알림*/
  itemParse: '아이템 파싱 성공',
  itemInsert: '아이템 추가 성공',
  itemUpdate: '아이템 수정 성공',
  itemAndNotiDelete: '해당 아이템 및 알림 삭제 성공',

  itemAndNotiInsert: '아이템 및 알림 추가 성공',
  itemAndNotiUpdate: '아이템 및 알림 수정 성공',
  itemUpdateAndNotiInsert: '아이템 수정 및 알림 추가 성공',
  itemUpdateAndNotiDelete: '아이템 수정 및 알림 삭제 성공',
  itemUpdateToFolder: '아이템 폴더명 수정 성공',

  notiReadStateUpdate: '알림 읽음 상태 수정 성공',

  notiPushServiceStart: '푸쉬 알림 서비스 시작',
  notiPushServiceExit: '푸쉬 알림 서비스 종료',

  /* 장바구니*/
  cartInsert: '장바구니 추가 성공',
  cartUpdate: '장바구니 수정 성공',
  cartDelete: '장바구니 삭제 성공',

  /* 폴더*/
  folderInsert: '폴더 추가 성공',
  folderNameUpdate: '폴더명 수정 성공',
  folderDelete: '폴더 삭제 성공',

  /* 사용자*/
  userInfoUpdate: '사용자 정보 수정 성공',
  userNickNameUpdate: '사용자 닉네임 수정 성공',
  userProfileImgUpdate: '사용자 프로필 이미지 수정 성공',
  userFcmTokenUpdate: '사용자 Fcm Token 수정 성공',
  userActiveUpdate: '사용자 비활성화 성공',
  userDelete: '사용자 삭제 성공',
  userPushStateUpdate: '사용자 푸쉬 알림 여부 수정 성공',
  userPasswordUpdate: '사용자 비밀번호 수정 성공',
  unActvieUserDelete: '매주 월요일 자정, 탈퇴 유저 삭제 성공',

  loginSuccessAfterSuccessSignUp: 'wishboard 회원가입 후 로그인 성공',
  loginfailedAfterSuccessSignUp: 'wishboard 회원가입 성공 후 로그인 실패',
  loginSuccess: 'wishboard 앱 로그인 성공',
  sendMailForCertifiedNumber: '비밀번호 찾기를 위한 인증번호 메일 전송 성공',
  unvalidateEmail: '회원가입이 가능한 이메일주소',

  userDeleteScheudlerStart: '탈퇴 유저 삭제 스케줄러 시작',
  userDeleteScheudlerExit: '탈퇴 유저 삭제 스케줄러 종료',

  /* IpAddress */
  readIpAddress: '차단 IP 목록 읽기 성공',
  addIpAddressDenied: '차단 IP 목록 추가 완료',
};

const ErrorMessage = {
  /* 아이템*/
  itemParseFail: '아이템 파싱 실패',
  itemNameMiss: '아이템 이름 누락',
  itemUpdateError: '수정된 아이템 없음',
  itemInsertError: '추가된 아이템 없음',
  itemDeleteError: '삭제된 아이템 없음',
  itemNotFound: '아이템 정보 없음',
  itemLatestNotFound: '최근 추가한 아이템 정보 없음',
  itemUpdateToFolderError: '수정된 아이템 폴더명 없음',

  /* 장바구니*/
  cartNotFound: '장바구니 정보 없음',
  cartUpdateError: '수정된 장바구니 없음',
  cartInsertError: '추가된 장바구니 없음',
  cartDeleteError: '삭제된 장바구니 없음',

  /* 폴더*/
  validateFolder: '이미 존재하는 폴더명',
  folderNotFound: '폴더 정보 없음',
  folderListNotFound: '폴더리스트 정보 없음',
  folderInItemNotFound: '폴더 내 아이템 정보 없음',
  folderNameUpdateError: '수정된 폴더명 없음',
  folderInsertError: '추가된 폴더 없음',
  folderDeleteError: '삭제된 폴더 없음',

  /* 알림*/
  notiTabNotFound: '알림탭 정보 없음',
  notiCalendarNotFound: '알림캘린더 정보 없음',
  notiReadStateUpdateError: '수정된 알림 읽음 상태 없음',
  notiInsertError: '추가된 알림 없음',
  notiUpsertError: '추가되거나 수정된 알림 없음',

  /* 사용자*/
  validateNickname: '이미 존재하는 닉네임',
  userNotFound: '사용자 정보 없음',
  userInfoUpdateNotFound: '수정된 사용자 정보 없음',
  userNickNameUpdateNotFound: '수정된 사용자 닉네임 없음',
  userProfileImgUpdateNotFound: '수정된 사용자 프로필 이미지 없음',
  userFcmTokenUpdateNotFound: '수정된 사용자 fcm token 없음',
  userActiveUpdateNotFound: '사용자 비활성화 실패',
  userDeleteError: '삭제된 사용자 없음',
  userPushStateUpdateNotFound: '수정된 사용자 푸쉬 알림 여부 없음',
  userPasswordUpdateNotFound: '수정된 사용자 비밀번호 없음',

  unActvieUserDelete: '매주 월요일 자정, 탈퇴 유저 삭제 실패',

  unActiveUser: '탈퇴 처리된 유저',
  signUpFailed: 'wishboard 앱 회원가입 실패',
  validateEmail: '이미 존재하는 이메일 주소',
  unvalidateUser: '존재하지 않는 유저',
  checkIDPasswordAgain: '이메일 주소 혹은 비밀번호를 다시 확인',
  unvalidateToken: 'token이 유효하지 않음',
  requestTokenAgain: 'token 없음. 요청 token 확인',
  sendMailFailed: '새 비밀번호 지정을 위한 메일 전송 실패',
  unvalidateVerificationCode: '유효하지 않은 인증번호.',

  /* 공통*/
  BadRequestMeg: '잘못된 요청',
  ApiUrlIsInvalid: '잘못된 경로',

  /* IP 차단에러*/
  IpDeniedError: `You can't come in`,
};

module.exports = { StatusCode, SuccessMessage, ErrorMessage };
