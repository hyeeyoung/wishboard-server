const Version = require('../models/version');
const { BadRequest } = require('../utils/errors');
const {
  StatusCode,
  SuccessMessage,
  ErrorMessage,
} = require('../utils/response');

module.exports = {
  checkVersion: async function (req, res, next) {
    try {
      if (!req.query.osType) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      await Version.checkVersion(req).then((result) => {
        return res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.versionSuccess,
          data: result,
        });
      });
    } catch (err) {
      next(err);
    }
  },
  updateVersion: async function (req, res, next) {
    try {
      if (
        !req.body.osType ||
        !req.body.minVersion ||
        !req.body.recommendedVersion
      ) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      await Version.updateVersion(req).then((result) => {
        return res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.versionUpdate,
          data: result,
        });
      });
    } catch (err) {
      next(err);
    }
  },
  getVersions: async function (req, res, next) {
    try {
      await Version.getVersions(req).then((result) => {
        return res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.versionSuccess,
          data: result,
        });
      });
    } catch (err) {
      next(err);
    }
  },
};
