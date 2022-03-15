const Noti = require('../models/noti');
const { StatusCode, SuccessMessage } = require('../utils/response');

module.exports = {
  selectNotiInfo: async function (req, res, next) {
    await Noti.selectNoti(req)
      .then((result) => {
        res.status(StatusCode.OK).json(result);
      })
      .catch((err) => {
        next(err);
      });
  },
  updateNotiReadStateInfo: async function (req, res, next) {
    await Noti.updateNotiReadState(req)
      .then(() => {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.notiReadStateUpdate,
        });
      })
      .catch((err) => {
        next(err);
      });
  },
};
