const jwt = require("jsonwebtoken");
const { StatusCode, ErrorMessage } = require("../utils/response");
require("dotenv").config({ path: "../.env" });

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    let jwtSecret = process.env.JWT_SECRET_KEY;

    req.decoded = jwt.verify(token, jwtSecret);
    return next();
  } catch (err) {
    // if (err.name == "TokenExpiredError") { //TODO 현재 만료 기간 X (나중에 사용 안하면 지우기)
    //   return res
    //     .status(419)
    //     .json({ success: false, message: "token 만료되었습니다." });
    // }
    return res
      .status(StatusCode.UNAUTHORIZED)
      .json({ success: false, message: ErrorMessage.unvaildateToken });
  }
};
