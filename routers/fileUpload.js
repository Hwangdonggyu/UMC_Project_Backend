//For image upload_need to fix
const express = require('express');
const multer = require('multer');
const router = express.Router();
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), function(req, res, next) {
  res.status(200).json({ filePath: `uploads/${req.file.originalname}` });
});

module.exports = router;
