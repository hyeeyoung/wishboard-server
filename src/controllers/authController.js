const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config({ path: "../.env" });

module.exports = {
  signUp: async function (req, res) {
    await User.signUp(req)
      .then((result) => {
        console.log(result);
        res.status(200).json({
          success: true,
          message: "wishboard 회원가입을 성공했습니다.",
        });
      })
      .catch((err) => {
        if (err.code == "ER_DUP_ENTRY") {
          res.status(400).json({
            success: false,
            message: "이미 존재하는 아이디 입니다.",
          });
        } else {
          res.status(404).json({
            success: false,
            message: "wish board 앱 회원가입 실패",
          });
        }
      });
  },
  signIn: async function (req, res) {
    passport.authenticate("local", { session: false }, (err, user) => {
      if (err || !user) {
        console.log(err);
        return res
          .status(401)
          .json({ success: false, message: "wish board 앱 로그인 실패" });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        const token = jwt.sign(user[0].user_id, process.env.JWT_SECRET_KEY);
        return res.status(200).json({
          success: true,
          message: "wish board 앱 로그인 성공",
          token: token,
        });
      });
    })(req, res);
  },
};
