const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports = {
  userSignUp: async function (req, res) {
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

  userSignIn: async function (req, res) {
    await User.signIn(req)
      .then((result) => {
        console.log(result);
        if (result.length === 0)
          res.status(404).json({
            success: false,
            message: "존재하지 않는 이메일입니다.",
          });
        else {
          if (!bcrypt.compareSync(req.body.password, result[0].password))
            res.status(404).json({
              success: false,
              message: "비밀번호가 일치하지 않습니다.",
            });
          else
            res.status(200).json({
              success: true,
              message: "wish board 앱 로그인 성공",
              data: {
                user_id: result[0].user_id,
                email: result[0].email,
              },
            });
        }
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "wishboard 서버 에러",
        });
        console.log(err);
        throw err;
      });
  },
};
