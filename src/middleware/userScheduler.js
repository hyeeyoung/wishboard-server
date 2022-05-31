const logger = require('../config/winston');
const User = require('../models/user');
const { SuccessMessage } = require('../utils/response');

module.exports = {
  usersDelete: async function () {
    await User.unActiveUsersDelete()
      .then((deleteUserCount) => {
        logger.info(
          `${SuccessMessage.unActvieUserDelete} | ${deleteUserCount}명 탈퇴`,
        );
      })
      .catch((err) => logger.info(err));
  },
};
