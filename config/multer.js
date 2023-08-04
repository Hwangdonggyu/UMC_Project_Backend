const multer = require('multer');
const uuid4 = require('uuid4');
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({
        filename(req, file, cb) {
            const randomID = uuid4();
            const ext = path.extname(file.originalname);    //파일명을 인자로 주면 확장자를 추출하는 함수
            const filename = randomID + ext;
            cb(null, filename);
        },
        destination(req, file, cb){
            cb(null, 'uploads/');   //uploads 폴더가 미리 존재해야 함
        }
    }),
    limits: {fileSize: 1024 * 1024},
});
const uploadMiddleware = upload.array('img', 5);    //req.files

module.exports = uploadMiddleware;