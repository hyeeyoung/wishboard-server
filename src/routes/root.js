var express = require('express');
// @brief : express.Router() : router 객체를 생성
var router = express.Router();

//@brief '/' : 함수가 적용되는 경로(라우트) -> 미들웨어 설정
router.get('/', (req, res) => res.send('Hello World!!'))
module.exports = router;
