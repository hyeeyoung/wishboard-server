const mysql = require('mysql2/promise');
const logger = require('./winston');
require('dotenv').config({ path: '../.env' });

/* @see : connection은 DB에 접속 -> SQL문 날림 -> 결과 받고 -> 연결 종료의 flow를 갖음
 * connection을 닫지 않으면 리소스를 불필요하게 낭비
 * pool.getConnection() -> connection.query() -> connection.release()
 */

const TAG_SUCCESS = 'DB success create pool!!';
const TAG_PROTOCOL_CONNECTION_LOST = 'Database connection was closed.';
const TAG_ER_CON_COUNT_ERROR = 'Database has too many connections.';
const TAG_ECONNREFUSED = 'Database connection was refused.';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  connectionLimit: 50,
});

logger.info(TAG_SUCCESS);

exports.connection = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    return connection;
  } catch (err) {
    switch (err.code) {
      case 'PROTOCOL_CONNECTION_LOST':
        logger.error(TAG_PROTOCOL_CONNECTION_LOST);
        break;
      case 'ER_CON_COUNT_ERROR':
        logger.error(TAG_ER_CON_COUNT_ERROR);
        break;
      case 'ECONNREFUSED':
        logger.error(TAG_ECONNREFUSED);
        break;
    }
  }
};
