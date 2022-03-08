# :green_heart: wishboard-server :green_heart:
위시리스트 통합 관리 안드로이드 어플리케이션

<details>
<summary><b>Contents</b></summary>
<div markdown="1">       

1. [프로젝트 설명](#프로젝트-설명)
2. [프로젝트 핵심 기능](#프로젝트-핵심-기능)
3. [구성원 / 역할](#구성원-/-역할)
4. [개발환경](#개발환경)
5. [API 문서](#API-문서-바로가기)
6. [ERD](#ERD)
7. [Architecture](#Architecture)
8. [Folder structure](#Folder-structure)
9. [Dependencies module](#Dependencies-module)
10. [Git convention](#Git-convention)
11. [Code convention](#Code-convention)

</div>
</details>

## 💭 프로젝트 설명
> 여러 쇼핑 플랫폼에서 사고 싶은 물건들을 보관할 때 갤러리, 카카오톡 나에게 보내기 등 무분별하게 보관하여 한눈에 파악하기 어려웠던 적 있지 않으신가요? 
>
>**WishBoard**는 **위시리스트 항목을 한 곳에 모아 보관**할 수 있도록 해줍니다. 
>
>또한 상품 일정(프리오더, 재입고, 할인 등)관리의 불편함을 줄여줌으로써 **사용자에게 상품 구매 편의를 제공**하는 안드로이드 어플리케이션입니다.
>
>_추후 iOS 어플리케이션도 개발 할 예정입니다._

`ui 사진이 들어가면 좋을 것 같음!!!! (간단한 UI 화면을 넣어주면 좋을 것 같음! 아니면 우리 발표 ppt에 올린 시연 영상 같은 것도 갱찬을 듯! )`

## 💭 프로젝트 핵심 기능
#### 1. 위시리스트 아이템 등록
- 링크 공유를 통한 간편 등록과 사용자의 수동 등록으로 위시리스트 아이템 등록 방식을 제공합니다.
#### 2. 폴더 관리
- 위시리스트를 더 쉽고, 편리하게 관리할 수 있도록 폴더 기능 제공합니다.
#### 3. 알림 관리
- 사용자가 지정한 상품의 알림 유형 및 날짜에 맞춰 푸쉬 알림 기능 제공합니다.
- 푸쉬 알림 외 지난 알림들 열람 가능합니다.
#### 4. 장바구니 관리
- 장바구니에 담아 구매 예정인 상품의 총 결제 금액을 확인합니다. 

`요 자리에는 ui 사진이 들어가면 좋을 것 같음!!!! (피그마 UI 구성 캡쳐 .. ? )`

## 🙋🏻‍♂️구성원 / 역할
`WishBoard`는 2021.05 ~ 2022.03 동안 개발을 진행하였습니다.

|김혜정|최영진|
|:---:|:---:|
|<img src="https://user-images.githubusercontent.com/68772751/139533613-e4695172-50b5-4f12-8d39-0dd93de7b774.png" width="60%" />|<img src="https://user-images.githubusercontent.com/68772751/157168318-69a254fd-2c12-4e12-b10e-90e75e9fab0a.png" width="60%" />|
|Server Developer|Android Developer|

- 2021.05 ~ 2021.09 (4 Month)
  - 개발 초기에는 프론트, 백엔드 두 파트를 모두를 경험 해볼 수 있도록 진행하되 중심적으로 담당할 부분을 분담하는 형태로 개발을 진행하였습니다.
  - 혜정 : API・DB・아키텍처 설계 / 로그인, 회원가입, 장바구니・폴더 CRUD 기능 구현
  - 영진 : UIUX 설계, DB・서버 구축 / 홈화면, 아이템・알림 CRUD 기능 구현 

- 2021.10 ~ 2021.03 (6 Month)
  - 50% 정도 기능 개발이 완성된 시점에서 코드 리팩토링의 필요성을 느꼈습니다. 각자에게 더 흥미있었던 파트로 나눠 작업을 진행하며 Server 개발과 Android 개발로 나누어 작업하게 되었고, 그 과정에서 언어 변환(Android의 경우 Java -> Kotlin), 디자인 패턴 적용 및 API, DB, Architecture 재설계를 진행하였습니다.

> 해당 Repository는 Server, Android 개발로 나뉜 이후의 레포입니다.

**:raised_hands: 저희의 10개월 간의 발자취는 [노션](https://www.notion.so/84c305675a7e43308bc8c90e94afeb9c?v=d8fbe05719154feeb03b8c234a5b861f)에서 볼 수 있어요! :raised_hands:**

## :toolbox: 개발환경
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
- Nginx
- Git Action
- PM2
```
## :point_right: [API 문서 바로가기](https://www.notion.so/84c305675a7e43308bc8c90e94afeb9c?v=6593c15e7edf4f6188f4a3e9c370c8d6&p=a48acc4185544784a0c78100fdc6ff45)

## :wrench: ERD
![image](https://user-images.githubusercontent.com/68772751/157175406-aea15d13-d8c2-4a5a-be36-b6135bffe274.png)

## :bank: Architecture
![image](https://user-images.githubusercontent.com/68772751/157170506-ac498a6a-afb0-44cd-a865-aa1ca5daed23.png)

## 📂 Folder Structure
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

## 🛠 Dependencies module
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
## :point_right: [Git convention 문서 바로가기](https://www.notion.so/84c305675a7e43308bc8c90e94afeb9c?v=6593c15e7edf4f6188f4a3e9c370c8d6&p=37031c99b0d84cd5b03aa2e9197b4e96)

## :point_down: Code convention
**1. 변수명 정의**
- `camelCase`를 적용할 것
- boolean 변수는 is 접두사 사용
- DB 변수명의 경우, `snake_case`사용 할 것

**2. 함수명 정의**
- 동사 + 명사 의 순서로 작성해서 무슨 기능을 하는 함수인지 명확히 알아볼 수 있도록 작성
- 대소문자 혼용할 수 있지만 반드시 소문자로 시작
   - `cameCase`를 적용할 것

**3. 클래스 정의**
- `PascalCase`를 이용
- 기능을 알 수 있도록 정의

**4. DB 및 그 외 모듈 정의**
- 기능에 해당하는 DB 모듈을 import 할 때 구분을 위해 `PascalCase`를 이용
- enum 처럼 사용되는 모듈의 경우, `PascalCase` 적용

**5. ESLint**
- `Google JavaScript Style Guide` 적용
```json
{
    "env": {
        "node": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": [
        "google",
        "plugin:prettier/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "rules": {
        "camelCase" : "off",
        "prettier/prettier": "error",
        "no-unused-vars": "warn",
        "no-bitwise": "off",
        "require-jsdoc":[ "error", {
            "require": {
                "FunctionDeclaration": false,
                "MethodDefinition": false,
                "ClassDeclaration": false,
                "ArrowFunctionExpression": false,
                "FunctionExpression": false
            }
        }]
    },
    "ignorePatterns": [
        "node_modules/"
    ]
}
```
