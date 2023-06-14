const db = require('../config/db');
const multer = require('../config/multer');

module.exports = {
  deleteItemImg: async (params) => {
    const sqlSelect =
      'SELECT item_img FROM items WHERE item_id = ? AND user_id = ?';
    const [deleteImages] = await db.query(sqlSelect, params);

    await Promise.all(
      deleteImages.map(async (item) => {
        if (item.item_img !== null) {
          await multer.s3Delete(item.item_img);
        }
      }),
    );
  },
  deleteItemImgAll: async (userId) => {
    const sqlSelect = 'SELECT item_img FROM items WHERE user_id = ?';
    const [deleteImages] = await db.query(sqlSelect, [userId]);

    await Promise.all(
      deleteImages.map(async (item) => {
        if (item.item_img !== null) {
          await multer.s3Delete(item.item_img);
        }
      }),
    );
  },
  deleteProfileImg: async (userId) => {
    const sqlSelect = 'SELECT profile_img FROM users WHERE user_id = ?';
    const [deleteImages] = await db.query(sqlSelect, [userId]);

    await Promise.all(
      deleteImages.map(async (item) => {
        if (item.profile_img !== null) {
          await multer.s3Delete(item.profile_img);
        }
      }),
    );
  },
};
