const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Base directory for receipts
const baseUploadDir = path.join(__dirname, '../../uploads/receipts');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!req.user || !req.user.id) {
      return cb(new Error('User ID missing in request, cannot organize upload'), null);
    }

    // Create user-specific folder: uploads/receipts/{userid}
    const userFolder = path.join(baseUploadDir, req.user.id);

    // Create directory recursively if doesn't exist
    fs.mkdir(userFolder, { recursive: true }, (err) => {
      if (err) return cb(err, null);
      cb(null, userFolder);
    });
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // max 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;
