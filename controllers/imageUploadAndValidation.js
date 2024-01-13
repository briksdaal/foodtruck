const FileType = require('file-type');
const { buildCheckFunction } = require('express-validator');
const multer = require('multer');

const upload = multer({ dest: 'public/uploads' });

exports.imageUploadAndValidation = [
  // Upload image
  upload.single('image'),
  // Validate image
  buildCheckFunction(['file'])().custom(async (val) => {
    if (val) {
      const whitelist = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      const meta = await FileType.fromFile(val.path);

      if (!meta || !whitelist.includes(meta.mime)) {
        throw new Error('Unaccepted file type');
      }
    }
  }),
];
