const { app } = require("firebase-admin");
const mysql = require("mysql");
require("dotenv").config({ path: "/home/ubuntu/.env" });

/* @see : connection은 DB에 접속 -> SQL문 날림 -> 결과 받고 -> 연결 종료의 flow를 갖음
 * connection을 닫지 않으면 리소스를 불필요하게 낭비
 * pool.getConnection() -> connection.query() -> connection.release()
 */

// @brief : mysql connection pool 생성
var conn;
const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: process.env.PORT,
  database: process.env.DATABASE_NAME,
  connectionLimit: 30,
});

// @brief : 호스트 및 pool 연결 확인을 위한 console
console.log(process.env.HOST);
console.log(pool);

exports.connect = function () {
  // @brief : db 연결시도
  pool.getConnection((err, connection) => {
    if (err) {
      switch (err.code) {
        case "PROTOCOL_CONNECTION_LOST":
          console.error("Database connection was closed.");
          break;
        case "ER_CON_COUNT_ERROR":
          console.error("Database has too many connections.");
          break;
        case "ECONNREFUSED":
          console.error("Database connection was refused.");
          break;
      }
    }
    if (connection) {
      console.log("DB connection Pool Success!");
      conn = connection;
    }
  });
};

// @brief : db connection pool 반환
exports.releaseConn = function () {
  conn.release();
};

exports.get = function () {
  return pool;
};

// @brief : 다중 쿼리 사용 시 이용
exports.format = function () {
  mysql.format();
};
