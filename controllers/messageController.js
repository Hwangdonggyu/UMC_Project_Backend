const { check, validationResult } = require('express-validator');
const Message = require('./models/message');
const winston = require('winston');

// 요청, 응답, 에러 정보 로깅
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

exports.saveMessage = [
  check('name').isString().not().isEmpty(),
  check('message').isString().not().isEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newMessage = new Message({
        name: req.body.name,
        message: req.body.message,
      });

      await newMessage.save();
      logger.info('Message saved');
      res.status(200).send('Message saved');
    } catch (e) {
      logger.error(e);
      next(e);
    }
  },
];

exports.getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id).exec();
    if (!message) {
      return res.status(404).send('Message not found');
    }
    logger.info(`Message with id ${req.params.id} retrieved`);
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