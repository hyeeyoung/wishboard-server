const passport = require('passport');
const LocalStragegy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });
const logger = require('./winston');
const { ErrorMessage } = require('../utils/response');
const db = require('./db');

const TAG = 'PASSPORT ';

const localStragegyOption = {
  usernameField: 'email',
  passwordField: 'password',
};

const jwtStrategyOption = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

async function localVerify(email, password, done) {
  let user;
  try {
    const sqlSelect =
      'SELECT user_id, email, password, nickname, is_active FROM users WHERE email = ?';

    await db
      .query(sqlSelect, email)
      .then((rows) => {
        if (!rows[0]) return done(null, false);

        user = rows[0];

        const checkPassword = bcrypt.compareSync(password, user[0].password);
        logger.info(TAG + checkPassword);
        if (!checkPassword) return done(null, false);

        return done(null, user);
      })
      .catch((err) => {
        logger.error(TAG + err);
        return done(null, false);
      });
  } catch (e) {
    return done(e);
  }
}

async function jwtVerify(payload, done) {
  let user;
  try {
    const sqlSelect = 'SELECT user_id, email FROM users WHERE user_id = ?';

    await db
      .query(sqlSelect, payload.user_id)
      .then((rows) => {
        if (!rows[0]) return done(null, false);
        user = rows[0];

        return done(null, user);
      })
      .catch((err) => {
        logger.error(TAG + err);
        return done(null, false);
      });
  } catch (e) {
    return done(e);
  }
}
module.exports = () => {
  passport.use(new LocalStragegy(localStragegyOption, localVerify));
  passport.use(new JWTStrategy(jwtStrategyOption, jwtVerify));
};
