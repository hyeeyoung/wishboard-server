const { onBindParsingType } = require('../lib/parser');
const Items = require('../models/item');
const Noti = require('../models/noti');
const { BadRequest } = require('../utils/errors');
const {
  StatusCode,
  SuccessMessage,
  ErrorMessage,
} = require('../utils/response');
const { Strings } = require('../utils/strings');
const { isValidDateFormat } = require('../utils/util');

const existEmptyData = (obj) => {
  if (obj.constructor !== Object) {
    return false;
  }
  if (JSON.stringify(obj) !== '{}') {
    return false;
  }
  return true;
};

module.exports = {
  insertItemInfo: async function (req, res, next) {
    try {
      if (!req.body.item_name) {
        throw new BadRequest(ErrorMessage.itemNameMiss);
      }
      await Items.insertItem(req).then((itemId) => {
        if (
          req.body.item_notification_date &&
          req.body.item_notification_type
        ) {
          // TODO request DTO 분리하기
          const itemNotiDate = req.body.item_notification_date;
          const date = itemNotiDate.slice(0, 10);
          const minute = Number(
            itemNotiDate.slice(-5, itemNotiDate.length - 3),
          );
          if (!isValidDateFormat(date)) {
            throw new BadRequest(ErrorMessage.notiDateBadRequest);
          }
          if (!(minute === 0 || minute === 30)) {
            throw new BadRequest(ErrorMessage.notiDateMinuteBadRequest);
          }
          Noti.insertNoti(req, itemId).then(() => {
            return res.status(StatusCode.CREATED).json({
              success: true,
              message: SuccessMessage.itemAndNotiInsert,
            });
          });
        } else {
          return res.status(StatusCode.CREATED).json({
            success: true,
            message: SuccessMessage.itemInsert,
          });
        }
      });
    } catch (err) {
      next(err);
    }
  },
  selectItemInfo: async function (req, res, next) {
    await Items.selectItems(req)
      .then((result) => {
        res.status(StatusCode.OK).json(result);
      })
      .catch((err) => {
        next(err);
      });
  },
  selectItemDetailInfo: async function (req, res, next) {
    await Items.selectItemDetail(req)
      .then((result) => {
        res.status(StatusCode.OK).json(result);
      })
      .catch((err) => {
        next(err);
      });
  },
  selectItemLatest: async function (req, res, next) {
    await Items.selectItemOneLatest(req)
      .then((result) => {
        res.status(StatusCode.OK).json(result);
      })
      .catch((err) => {
        next(err);
      });
  },
  updateItemInfo: async function (req, res, next) {
    try {
      if (!req.body.item_name) {
        throw new BadRequest(ErrorMessage.itemNameMiss);
      }

      await Items.updateItem(req).then(() => {
        if (
          req.body.item_notification_date &&
          req.body.item_notification_type
        ) {
          // TODO request DTO 분리하기
          const itemNotiDate = req.body.item_notification_date;
          const date = itemNotiDate.slice(0, 10);
          const minute = Number(
            itemNotiDate.slice(-5, itemNotiDate.length - 3),
          );

          if (!isValidDateFormat(date)) {
            throw new BadRequest(ErrorMessage.notiDateBadRequest);
          }
          if (!(minute === 0 || minute === 30)) {
            throw new BadRequest(ErrorMessage.notiDateMinuteBadRequest);
          }
          Noti.upsertNoti(req).then((state) => {
            if (state === Strings.INSERT) {
              return res.status(StatusCode.CREATED).json({
                success: true,
                message: SuccessMessage.itemUpdateAndNotiInsert,
              });
            }

            if (state === Strings.UPSERT) {
              return res.status(StatusCode.OK).json({
                success: true,
                message: SuccessMessage.itemAndNotiUpdate,
              });
            }
          });
        } else {
          //* item 수정 후 item_noti_~가 null인 경우, noti에 존재하면 삭제
          Noti.deleteNoti(req).then((result) => {
            if (result) {
              return res.status(StatusCode.OK).json({
                success: true,
                message: SuccessMessage.itemUpdateAndNotiDelete,
              });
            } else {
              //* 아이템만 수정
              return res.status(StatusCode.OK).json({
                success: true,
                message: SuccessMessage.itemUpdate,
              });
            }
          });
        }
      });
    } catch (err) {
      next(err);
    }
  },
  updateItemToFolder: async function (req, res, next) {
    try {
      if (!req.params.item_id || !req.params.folder_id) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      await Items.updateItemToFolder(req).then(() => {
        res.status(StatusCode.OK).json({
          success: true,
          message: SuccessMessage.itemUpdateToFolder,
        });
      });
    } catch (err) {
      next(err);
    }
  },
  deleteItemInfo: async function (req, res, next) {
    try {
      if (!req.params.item_id) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      await Items.deleteItem(req).then((result) => {
        if (result) {
          res.status(StatusCode.OK).json({
            success: true,
            message: SuccessMessage.itemAndNotiDelete,
          });
        }
      });
    } catch (err) {
      next(err);
    }
  },
  parseItemInfo: async function (req, res, next) {
    try {
      if (!req.query.site) {
        throw new BadRequest(ErrorMessage.BadRequestMeg);
      }
      await onBindParsingType(req.query.site)
        .then((data) => {
          if (existEmptyData(data)) {
            return res.status(StatusCode.NOCONTENT).json();
          }
          return res.status(StatusCode.OK).json({
            success: true,
            message: SuccessMessage.itemParse,
            data,
          });
        })
        .catch((parserFailError) => next(parserFailError));
    } catch (err) {
      next(err);
    }
  },
};
