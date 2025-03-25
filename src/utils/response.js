const StatusCode = {
  OK: 200,
  CREATED: 201,
  NOCONTENT: 204,
  BADREQUEST: 400,
  UNAUTHORIZED: 401,
  NOTFOUND: 404,
  CONFLICT: 409,
  TOOMANYREQUEST: 429,
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
  loginFailedAfterSuccessSignUp: 'wishboard 회원가입 성공 후 로그인 실패',
  loginSuccess: 'wishboard 앱 로그인 성공',
  sendMailForCertifiedNumber: '비밀번호 찾기를 위한 인증번호 메일 전송 성공',
  unValidateEmail: '회원가입이 가능한 이메일주소',

  refreshTokenSuccess: '토큰 갱신 성공',
  logoutSuccess: '로그아웃 성공',

  userDeleteSchedulerStart: '탈퇴 유저 삭제 스케줄러 시작',
  userDeleteSchedulerExit: '탈퇴 유저 삭제 스케줄러 종료',

  /* 버전 */
  versionSuccess: '버전 정보 조회 성공',
  versionUpdate: '버전 정보 수정 성공',
};

const ErrorMessage = {
  /* 아이템*/
  itemParseFail: '아이템 파싱 실패',
  itemNameMiss: '아이템 이름 누락',
  itemInsertTypeMiss: '자동(PARSING)/수동(MANUAL) 타입 누락',
  itemInsertImageMiss: '수동 등록의 경우 아이템 이미지 필수',
  itemUpdate: '수정된 아이템 없음',
  itemInsert: '추가된 아이템 없음',
  itemDelete: '삭제된 아이템 없음',
  itemNotFound: '아이템 정보 없음',
  itemLatestNotFound: '최근 추가한 아이템 정보 없음',
  itemUpdateToFolderNotFound: '수정된 아이템 폴더명 없음',
  itemSiteUrlNotFound: '요청하신 URL은 유효한 링크가 아닙니다.',

  /* 장바구니*/
  cartNotFound: '장바구니 정보 없음',
  cartUpdate: '수정된 장바구니 없음',
  cartInsert: '추가된 장바구니 없음',
  cartDelete: '삭제된 장바구니 없음',

  /* 폴더*/
  validateFolder: '이미 존재하는 폴더명',
  folderNotFound: '폴더 정보 없음',
  folderListNotFound: '폴더리스트 정보 없음',
  folderInItemNotFound: '폴더 내 아이템 정보 없음',
  folderNameUpdate: '수정된 폴더명 없음',
  folderInsert: '추가된 폴더 없음',
  folderDelete: '삭제된 폴더 없음',

  /* 알림*/
  notiTabNotFound: '알림탭 정보 없음',
  notiCalendarNotFound: '알림캘린더 정보 없음',
  notiReadStateUpdate: '수정된 알림 읽음 상태 없음',
  notiInsert: '추가된 알림 없음',
  notiUpsert: '추가되거나 수정된 알림 없음',
  notiDateMinuteBadRequest: '알림 날짜의 분은 00 또는 30',
  notiDateBadRequest: '알림 날짜는 현재 날짜보다 같거나 미래만 가능',

  /* 사용자*/
  validateNickname: '이미 존재하는 닉네임',
  userNotFound: '사용자 정보 없음',
  userInfoUpdateNotFound: '수정된 사용자 정보 없음',
  userNickNameUpdateNotFound: '수정된 사용자 닉네임 없음',
  userProfileImgUpdateNotFound: '수정된 사용자 프로필 이미지 없음',
  userFcmTokenUpdateNotFound: '수정된 사용자 fcm token 없음',
  userActiveUpdateNotFound: '사용자 비활성화 실패',
  userDelete: '삭제된 사용자 없음',
  userPushStateUpdateNotFound: '수정된 사용자 푸쉬 알림 여부 없음',
  userPasswordUpdateNotFound: '수정된 사용자 비밀번호 없음',

  unActvieUserDelete: '매주 월요일 자정, 탈퇴 유저 삭제 실패',

  unActiveUser: '탈퇴 처리된 유저',
  signInPasswordNotCorrect: '입력하신 비밀번호가 올바르지 않음',
  signUpFailed: 'wishboard 앱 회원가입 실패',
  existsUserFcmToken: '이미 존재하는 사용자의 fcmToken',
  validateEmail: '이미 존재하는 이메일 주소',
  unValidateUser: '존재하지 않는 유저',
  checkIDPasswordAgain: '이메일 주소 혹은 비밀번호를 다시 확인',
  failedUpdateFcmToken: '로그인 시 사용자 fcm 토큰 변경 실패',

  sendMailFailed: '새 비밀번호 지정을 위한 메일 전송 실패',
  unValidateVerificationCode: '유효하지 않은 인증번호.',

  tokenBadRequest: 'token 정보 없음. accessToken, refreshToken 필요',
  refreshTokenBadRequest: 'token 정보 없음. refreshToken 필요',
  unValidateToken: 'token이 유효하지 않음',
  expireToken: 'token이 만료. 다시 로그인 필요',
  requestTokenAgain: 'token 없음. 요청 token 확인',
  failedCreateToken: 'token 생성 실패',
  userIdNotFound: '토큰을 생성하기 위한 userId data 없음',

  userAgentNotFound: 'User-Agent가 없음',
  userAgentInOsInfoNotFound: 'User-Agent에 OS정보가 없음',

  /* 버전 */
  versionInfoNotFound: '버전 정보 없음',
  versionUpdatedFailed: '버전 정보 수정 실패',

  /* 공통*/
  BadRequestMeg: '잘못된 요청',
  ApiUrlIsInvalid: '잘못된 경로',
  RequestWithIntentionalInvalidUrl: '의도적인 잘못된 경로 요청',
  TooManyRequest: 'Too many accounts created from this IP',
};

module.exports = { StatusCode, SuccessMessage, ErrorMessage };
