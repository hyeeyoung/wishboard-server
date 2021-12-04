var pool = require("./db");
const passport = require("passport");
const LocalStragegy = require("passport-local").Strategy;
// const JWTStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: "../.env" });

const localStragegyOption = {
  usernameField: "email",
  passwordField: "password",
};

const jwtStrategyOption = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

async function localVerify(email, password, done) {
  var user;
  try {
    var sqlSelect =
      "SELECT user_id, email, password FROM users WHERE email = ?";

    const connection = await pool.connection(async (conn) => conn);
    await connection
      .query(sqlSelect, email)
      .then((rows) => {
        if (!rows[0]) return done(null, false);
        user = rows[0];

        const checkPassword = bcrypt.compareSync(password, user[0].password);
        console.log(checkPassword);
        if (!checkPassword) return done(null, false);

        return done(null, user);
      })
      .catch((err) => {
        console.log(err);
        return done(null, false);
      });
    connection.release();
  } catch (e) {
    return done(e);
  }
}

async function jwtVerify(payload, done) {
  var user;
  try {
    var sqlSelect = "SELECT user_id, email FROM users WHERE user_id = ?";
    const connection = await pool.connection(async (conn) => conn);
    await connection
      .query(sqlSelect, payload.user_id)
      .then((rows) => {
        if (!rows[0]) return done(null, false);
        user = rows[0];

        return done(null, user);
      })
      .catch((err) => {
        console.log(err);
        return done(null, false);
      });
    connection.release();
  } catch (e) {
    return done(e);
  }
}
module.exports = () => {
  passport.use(new LocalStragegy(localStragegyOption, localVerify));
  passport.use(new JWTStrategy(jwtStrategyOption, jwtVerify));
};
