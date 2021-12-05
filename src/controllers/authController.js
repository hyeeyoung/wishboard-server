const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config({ path: "../.env" });

module.exports = {
  signUp: async function (req, res) {
    const isVaildate = await User.vaildateEmail(req);

    if (!isVaildate) {
      await User.signUp(req)
        .then(() => {
          passport.authenticate("local", { session: false }, (err, user) => {
            if (err || !user) {
              console.log(err);
              return res.status(401).json({
                success: false,
                message: "wishboard 회원가입 성공 후 로그인 실패",
              });
            }
            req.login(user, { session: false }, (err) => {
              if (err) {
                console.log(err);
                return res.status(500).send(err);
              }
              const token = jwt.sign(
                user[0].user_id,
                process.env.JWT_SECRET_KEY
              );
              return res.status(201).json({
                success: true,
                message: "wishboard 회원가입 후 로그인 성공",
                token: token,
              });
            });
          })(req, res);
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json({
            success: false,
            message: "wishboard 앱 회원가입 실패",
          });
        });
    } else {
      res.status(400).json({
        success: false,
        message: "이미 존재하는 아이디 입니다.",
      });
    }
  },
  signIn: async function (req, res) {
    passport.authenticate("local", { session: false }, (err, user) => {
      if (err || !user) {
        console.log(err);
        return res.status(401).json({
          success: false,
          message: "아이디 혹은 비밀번호를 다시 확인해주세요.",
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        const token = jwt.sign(user[0].user_id, process.env.JWT_SECRET_KEY);
        return res.status(201).json({
          success: true,
          message: "wishboard 앱 로그인 성공",
          token: token,
        });
      });
    })(req, res);
  },
};
