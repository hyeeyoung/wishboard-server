const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config({ path: '../.env' });
const s3 = require('./s3Config');

module.exports = {
  upload: multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
      },
    }),
  }),
  s3Delete: async function (key) {
    s3.deleteObject(
      {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
      },
      (err) => {
        if (err) throw err;
      },
    );
  },
};
