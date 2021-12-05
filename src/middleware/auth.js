const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    let jwtSecret = process.env.JWT_SECRET_KEY;

    req.decoded = jwt.verify(token, jwtSecret);
    return next();
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      return res
        .status(419)
        .json({ success: false, message: "token 만료되었습니다." });
    }
    return res
      .status(401)
      .json({ success: false, message: "token이 유효하지 않습니다." });
  }
};
