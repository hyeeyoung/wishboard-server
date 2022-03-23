# Wishboard
<img width="150" alt="app_logo" src="https://user-images.githubusercontent.com/48701368/157261515-b0809692-3fc6-46eb-b4db-a0849cd557b6.svg">

<br>

__위시리스트 통합관리 앱, 위시보드(Wishboard)__

Timeline: 21.9.26 - 22.3.8 (+ iOS 개발 예정)

TEAM: Hyeeyoung   

<br>

## Contents
* [About Wishboard](#-About-Wishboard)
* [Contributors](#-Contributors)
* [Feature](#-Feature)
* [Develop Environment](#-Develop-Environment)
* [API Documents 바로가기 Click✔](#API-Documents-바로가기-Click)
* [ERD](#ERD)
* [Architecture](#Architecture)
* [Dependencies Module](#-Dependencies-Module)
* [Directory Structure](#-Directory-Structure)
* [Meeting Note](#-Meeting-Note)
* [Convention](#-Convention)

<br>

## About Wishboard
<img width="1200" alt="thumbnail" src="https://user-images.githubusercontent.com/48701368/157662866-afc6bc95-4c7c-41d0-aab9-385aeb129cec.png">

화면 캡처나 페이지 즐겨찾기, 카톡 나에게 보내기는 이제 그만! Wishboard로 간편하게 위시리스트를 통합 관리해 보세요😉

여러 쇼핑몰 플랫폼에 흩어져있는 아이템들, 사고 싶은 아이템을 링크 공유로 Wishboard에 저장합니다. 저장 시 아이템의 재입고 날짜, 프리오더 날짜와 같이 상품 일정을 설정하면 알림을 보내줍니다. 

구매할 아이템은 장바구니에 담아서 최종 결제 금액을 예상해보고, 폴더로 아이템을 보기 쉽게 정리할 수 있습니다!
<!-- 
<img width="1200" alt="userflow" src="https://user-images.githubusercontent.com/48701368/157239273-7ded387e-4204-486f-ad4c-de0a61e18a60.png">
 -->
<br>

## Feature

| 분류 | 세부 기능 | 진척도|
| --- | --- | --- |
| `auth` | 회원가입 | ✔ |
| `auth` | 로그인 | ✔ |
| `auth` | 이메일 인증 | ✔ |
| `auth` | 비밀번호 없이 로그인 | ✔ |
| `auth` | 사용자 탈퇴 배치 작업 | 배포 이후 |
| `item` | 홈화면 및 상세화면 조회 | ✔| 
| `item`, `noti` | 아이템 등록 및 알림 추가| ✔| 
| `item`, `noti` | 아이템 수정 및 알림 수정/추가/삭제 | ✔ |
| `noti` | 푸쉬 알림 설정 및 배치 작업 | ✔ |
| `item` | 아이템 삭제 | ✔ |
| `cart` | 장바구니 추가 | ✔ |
| `cart` | 장바구니 수정 | ✔ |
| `cart` | 장바구니 삭제 | ✔ |
| `cart` | 장바구니 조회 | ✔ |
| `cart` | 장바구니 공유 | 배포 이후 |
| `folder` | 폴더, 폴더리스트, 폴더 내 아이템 조회 | ✔ |
| `folder` | 폴더 추가 | ✔ |
| `folder` | 폴더 수정 | ✔ |
| `folder` | 폴더 삭제 | ✔ |
| `my` | 사용자 정보 조회 | ✔ |
| `my` | 사용자 정보 수정 | ✔ |
| `my` | 회원 정보 탈퇴| ✔ |
| `search` | 검색 기능 | 배포 이후 |

<br>

## Contributors

| <img src="https://user-images.githubusercontent.com/68772751/139533613-e4695172-50b5-4f12-8d39-0dd93de7b774.png" width="60%" /> | <img src="https://user-images.githubusercontent.com/48701368/157186833-1f852f89-1094-4d92-ba3c-de5a706ed7e1.jpg" width="60%" /> |
| --- | --- |
| [김혜정](https://github.com/hyejungg) / Server | [최영진](https://github.com/youngjinc) / Android & Design |

## Develop Environment
- Develop
```
- Visual Studio Code
- Npm 6.14.16
- Node 16.13.2
- MySQL 5.7.37
- JavaScript
```
- DevOps
```
- AWS EC2 프리티어 (Ubuntu 18.04 LTS)
- AWS S3
- Nginx 1.14.0
- Git Action
- PM2 5.7.2
```

## [API Documents 바로가기 Click✔](https://www.notion.so/84c305675a7e43308bc8c90e94afeb9c?v=6593c15e7edf4f6188f4a3e9c370c8d6&p=a48acc4185544784a0c78100fdc6ff45)

## ERD
![image](https://user-images.githubusercontent.com/68772751/157206413-62111af6-dc6e-4865-8ae5-7f9cd542f272.png)

## Architecture
![image](https://user-images.githubusercontent.com/68772751/157170506-ac498a6a-afb0-44cd-a865-aa1ca5daed23.png)

## Dependencies module
- `bcrpytjs` : 회원 정보 저장 시 비밀번호 암호화를 위해 사용
- `passport`, `passport-local`, `passport-jwt`, `jsonwebtoken` : 회원가입 및 로그인 서비스 이용과 jwt 생성을 하여 클라이언트와 작업 시 사용
- `dotenv` : 중요 비밀 정보 파일 저장을 위해 사용
- `morgan`, `winston`, `winston-daily-rotate-file` : http 요청에 따른 log 파일 저장을 위해 사용
- `firebase-admin` : 푸쉬 알림 서비스를 위해 firebase FCM cloud messaging 서비스 이용을 위해 사용
- `node-schedule` : 푸쉬 알림 배치 작업을 위해 사용. _추후 회원 정보 탈퇴 배치 시에도 사용 될 예정_
- `node-mailer` : 비밀번호 없이 로그인 시 이메일 인증을 위해 사용
- `webpack` : build 파일 압축을 위해 사용
```json
"dependencies": {
    "app-root-path": "^3.0.0",
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.19.0",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "firebase-admin": "^10.0.2",
    "helmet": "^5.0.2",
    "hpp": "^0.2.3",
    "jsonwebtoken": "^8.5.1",
    "morgan": "^1.10.0",
    "mysql2": "^2.3.0",
    "node-schedule": "^2.1.0",
    "nodemailer": "^6.7.2",
    "passport": "^0.5.0",
    "passport-jwt": "^4.0.0",
    "passport-local": "^1.0.0",
    "winston": "^3.5.1",
    "winston-daily-rotate-file": "^4.5.5"
  },
"devDependencies": {
    "eslint": "^8.7.0",
    "eslint-config-google": "^0.14.0",
    "eslint-config-prettier": "^8.3.0",
    "eslint-plugin-prettier": "^4.0.0",
    "prettier": "2.5.1",
    "webpack": "^5.65.0",
    "webpack-cli": "^4.9.1"
  }
```

## Directory Structure
```
📦src
┣ 📂config
┃ ┣ 📜db.js
┃ ┣ 📜firebaseAdmin.js
┃ ┣ 📜passport.js
┃ ┣ 📜winston.js
┣ 📂controllers
┃ ┣ 📜authControllers.js
┃ ┣ 📜cartControllers.js
┃ ┣ 📜folderControllers.js
┃ ┣ 📜itemControllers.js
┃ ┣ 📜notiControllers.js
┃ ┣ 📜userControllers.js
┣ 📂dto
┃ ┣ 📜cartResponse.js
┣ 📂middleware
┃ ┣ 📜auth.js
┃ ┣ 📜handleError.js
┃ ┣ 📜mailTransport.js
┃ ┣ 📜notiScheduler.js
┣ 📂models
┃ ┣ 📜cart.js
┃ ┣ 📜folder.js
┃ ┣ 📜item.js
┃ ┣ 📜noti.js
┃ ┣ 📜user.js
┣ 📂routes
┃ ┣ 📜authRoutes.js
┃ ┣ 📜cartRoutes.js
┃ ┣ 📜folderRoutes.js
┃ ┣ 📜itemRoutes.js
┃ ┣ 📜notiRoutes.js
┃ ┣ 📜userRoutes.js
┣ 📂utils
┃ ┣ 📜errors.js
┃ ┣ 📜notiPushMessage.js
┃ ┣ 📜notiType.js
┃ ┣ 📜response.js
┃ ┣ 📜sendMailMessage.js
┃ ┣ 📜strings.js
┣ 📜app.js
┃ 📜.eslintrc.js
┃ 📜.prettierrc.js
┃ 📜pacakge.json
┃ 📜pacakge-lock.json
┃ 📜webpack.config.js
```

<br>

## Meeting Note
[hyeeyoung의 10개월 간의 발자취예요! Click ✔](https://www.notion.so/84c305675a7e43308bc8c90e94afeb9c?v=d8fbe05719154feeb03b8c234a5b861f)

<br>

## Convention
[Git Convention 바로가기 Click ✔](https://www.notion.so/Git-fcda833780394a6bb658e1473d480d2f)

[Code Convention 바로가기 Click ✔](https://www.notion.so/Server-Code-46541ebbcab74b149673b5eefe6c753e)
