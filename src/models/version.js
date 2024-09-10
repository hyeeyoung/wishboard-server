const db = require('../config/db');
const { NotFound } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');

module.exports = {
  checkVersion: async function (req) {
    const osType = req.query.osType;

    const sqlSelect =
      'SELECT min_version, recommended_version FROM deploy WHERE platform = ?';
    const [rows] = await db.query(sqlSelect, osType);

    if (rows.length < 1) {
      throw new NotFound(ErrorMessage.versionInfoNotFound);
    }

    return {
      platform: osType,
      minVersion: rows[0].min_version,
      recommendedVersion: rows[0].recommended_version,
    };
  },
  updateVersion: async function (req) {
    const osType = req.body.osType;
    const minVersion = req.body.minVersion;
    const recommendedVersion = req.body.recommendedVersion;

    const sqlUpdate =
      'UPDATE deploy SET min_version = ?, recommended_version = ? WHERE platform = ?';
    const params = [minVersion, recommendedVersion, osType];
    const [updated] = await db.queryWithTransaction(sqlUpdate, params);

    if (updated.affectedRows < 1) {
      throw new NotFound(ErrorMessage.versionUpdatedFailed);
    }
    return true;
  },
  getVersions: async function (req) {
    const sqlSelect = 'SELECT * FROM deploy';
    const [rows] = await db.query(sqlSelect, null);

    if (rows.length < 1) {
      throw new NotFound(ErrorMessage.versionInfoNotFound);
    }

    return Object.setPrototypeOf(rows, []);
  },
};
