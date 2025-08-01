const multer = require('multer');

// Memory storage to store the file buffer for DB BLOB upload
const storage = multer.memoryStorage();

const uploadProfilePic = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

module.exports = uploadProfilePic;
