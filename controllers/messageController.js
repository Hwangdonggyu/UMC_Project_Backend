const { check, validationResult } = require('express-validator');
const Message = require('../models/message');
const winston = require('winston');
const multer = require('multer');

//file 저장
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, 'uploads/images/');
    } else if (file.mimetype.startsWith('audio/')) {
      cb(null, 'uploads/audios/');
    } else {
      cb({ message: 'err' }, false);
    }
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

exports.uploadFile = upload.single('file');

// 요청, 응답, 에러 정보 로깅
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//메세지 저장
exports.saveMessage = async (req, res, next) => {
  try {
    let newMessageData = {
      name: req.body.name,
      type: req.body.type,
      message: req.body.message,
      date: new Date()
    };

    if (req.file) {
      if (req.body.type === 'image') {
        newMessageData.image = {
          url: 'http://server.com/' + req.file.path,
          name: req.file.filename
        };
      } else if (req.body.type === 'audio') {
        newMessageData.audio = {
          url: 'http://server.com/' + req.file.path,
          name: req.file.filename
        };
      }
    }

    const newMessage = new Message(newMessageData);
    await newMessage.save();
    // io.sockets.emit('new_message', newMessage);
    // res.status(200).json(newMessage);
    // logger.info('Message saved');
  } catch (e) {
    console.error(e);
  }
};



exports.getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id).exec();
    if (!message) {
      return res.status(404).send('Message not found');
    }
    logger.info('Message with id ${req.params.id} retrieved');
    res.status(200).json(message);
  } catch (e) {
    logger.error(e);
    next(e);
  }
};


exports.deleteMessage = async (req, res, next) => {
  try {
    await Message.findByIdAndDelete(req.params.id).exec();
    logger.info('Message deleted');
    res.status(200).send('Message deleted');
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

exports.errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('err');
};