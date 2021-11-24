const mysql = require("mysql2/promise");
require("dotenv").config({ path: "../.env" });

/* @see : connection은 DB에 접속 -> SQL문 날림 -> 결과 받고 -> 연결 종료의 flow를 갖음
 * connection을 닫지 않으면 리소스를 불필요하게 낭비
 * pool.getConnection() -> connection.query() -> connection.release()
 */

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  port: process.env.PORT,
  database: process.env.DATABASE_NAME,
  connectionLimit: 30,
});

console.log(process.env.HOST);
console.log(pool);
console.log("success create pool!!");

exports.connection = async function () {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    console.log("DB connection Pool Success!");
    return connection;
  } catch (err) {
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
};
