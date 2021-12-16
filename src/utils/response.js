const StatusCode = {
  OK: 200,
  CREATED: 201,
  BADREQUEST: 400,
  UNAUTHORIZED: 401,
  NOTFOUND: 404,
};

const SuccessMessage = {
  /*아이템*/
  itemInsert: "아이템 추가 성공",
  itemUpdate: "아이템 수정 성공",
  itemDelete: "아이템 삭제 성공",

  /*장바구니*/
  cartInsert: "장바구니 추가 성공",
  cartUpdate: "장바구니 수정 성공",
  cartDelete: "장바구니 삭제 성공",

  /*폴더*/
  folderInsert: "폴더 추가 성공",
  folderNameUpdate: "폴더명 수정 성공",
  folderImageUpdate: "폴더이미지 수정 성공",
  folderDelete: "폴더 삭제 성공",

  /*사용자*/
  userInfoUpdate: "사용자 정보 수정 성공",
  userNickNameUpdate: "사용자 닉네임 수정 성공",
  userProfileImgUpdate: "사용자 프로필 이미지 수정 성공",
  userDelete: "사용자 삭제 성공",

  loginSuccessAfterSuccessSignUp: "wishboard 회원가입 후 로그인 성공",
  loginfailedAfterSuccessSignUp: "wishboard 회원가입 성공 후 로그인 실패",
  loginSuccess: "wishboard 앱 로그인 성공",
};

const ErrorMessage = {
  /*아이템*/
  itemImageMiss: "이미지 정보 누락",
  itemUpdateError: "수정된 아이템 없음",
  itemInsertError: "추가된 아이템 없음",
  itemDeleteError: "삭제된 아이템 없음",
  itemNotFound: "아이템 정보 없음",

  /*장바구니*/
  cartNotFound: "장바구니 정보 없음",
  cartUpdateError: "수정된 장바구니 없음",
  cartInsertError: "추가된 장바구니 없음",
  cartDeleteError: "삭제된 장바구니 없음",

  /*폴더*/
  folderNotFound: "폴더 정보 없음",
  folderListNotFound: "폴더리스트 정보 없음",
  folderInItemNotFound: "폴더 내 아이템 정보 없음",
  folderNameUpdateError: "수정된 폴더명 없음",
  folderImageUpdateError: "수정된 폴더명 없음",
  folderInsertError: "추가된 폴더 없음",
  folderDeleteError: "삭제된 폴더 없음",

  /*사용자*/
  userNotFound: "사용자 정보 없음",
  userInfoUpdateNotFound: "수정된 사용자 정보 없음",
  userNickNameUpdateNotFound: "수정된 사용자 닉네임 없음",
  userProfileImgUpdateNotFound: "수정된 사용자 프로필 이미지 없음",
  userDeleteError: "삭제된 사용자 없음",

  signUpFailed: "wishboard 앱 회원가입 실패",
  vaildateEmail: "이미 존재하는 아이디",
  checkIDPasswordAgain: "아이디 혹은 비밀번호를 다시 확인",
  unvaildateToken: "token이 유효하지 않음",

  /*공통*/
  BadRequestMeg: "잘못된 요청",
};

module.exports = { StatusCode, SuccessMessage, ErrorMessage };
