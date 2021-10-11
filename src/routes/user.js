var express = require("express");
var db = require("../db");
var router = express.Router(); // @brief : express.Router() : router 객체를 생성
// const bcrypt = require("bcrypt"); // @brief : password 암호화
//const jwt = require("jsonwebtoken"); // @brief : jwp 토큰

// @brief : '/' : 함수가 적용되는 경로(라우트)
router.get("/", (req, res) => res.send("user!"));

// @brief : wish board 앱 회원가입
router.post("/signup", function (req, res) {
  var email = req.body.email;
  var before_pw = req.body.password;
  var option_notification = req.body.option_notification;

  // @parms: DB에 저장되는 비밀번호
  // const password = bcrypt.hashSync(before_pw, 10);

  var sql_insert =
    "INSERT INTO users (email, password, option_notification) VALUES (?, ?, ?)";
  var params = [email, before_pw, option_notification];

  console.log("sql_insert : " + sql_insert);

  db.get().query(sql_insert, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        success: true,
        message: "wish board 앱 회원가입 성공 ",
        //	user_id: result[0].insertId,
      });
      db.releaseConn(); // @brief : connection pool 반환
    }
  });
});

// @brief : wish board 앱 로그인
router.post("/signin", function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  var sql_select = "SELECT user_id, email, password FROM users WHERE email = ?";

  console.log("sql_select : " + sql_select);

  db.get().query(sql_select, [email], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0)
        res.status(404).json({
          success: false,
          message: "존재하지 않는 이메일",
        });
      else {
        if (!bcrypt.compareSync(password, result[0].password))
          res.status(404).json({
            success: false,
            message: "비밀번호가 일치하지 않습니다.",
          });
        else
          res.status(200).json({
            success: true,
            message: "wish board 앱 로그인 성공 ",
            user_id: result[0].user_id,
            email: result[0].email,
          });
        // @brief : 토큰 생성
      }
      db.releaseConn(); // @brief : connection pool 반환
    }
  });
});

/* @TODO : 이메일 로그인 후 해당 이메일 주소로 회원가입 성공 메일 보내기
 * 해당 메일 주소는 향후 비밀번호 변경 시 이메일 인증 후 비밀번호 변경 시 사용
 */

// @brief : wishboard register email check
// router.post("/auth/emailcheck", function (req, res) {
//   const { user_email } = req.params;
//   // var email = req.body.email;

//   var sql_select = "SELECT email users where email =";

//   console.log("sql_select : " + sql_select + user_email);

//   db.get().query(sql_insert, user_nickname, function (err, result) {
//     if (err) {
//       res.status(500).send({ message: "서버 오류" });
//       console.log(err);
//     } else {
//       res.status(200).send({ message: "로그인에 성공했습니다." });
//       res.json({
//         result: true,
//         msg: "회원가입에 성공했습니다.",
//       });
//       db.releaseConn(); // @brief : connection pool 반환
//     }
//   });
// });

module.exports = router;
