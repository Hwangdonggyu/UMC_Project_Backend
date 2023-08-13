const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // 파일 저장 경로
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // 파일 이름
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const fileType = path.extname(file.originalname).toLowerCase().substring(1);
  
  if (allowedTypes.includes(fileType)) {
    req.fileValidationError = null;
    cb(null, true);
  } else {
    req.fileValidationError = 'jpg, jpeg, png, gif, webp 파일만 업로드 가능합니다.';
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 사진 크기 제한: 10MB
  }
});

module.exports = upload;
