const { check, validationResult } = require('express-validator');
const BannedWord = require('../models/bannedWord');
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

exports.saveBannedWord = async (req, res, next) => {
  try {
      const bannedWordTxt = req.body.bannedWordTxt;
      const reason = req.body.reason;
      const substitution = req.body.substitution;

      const bannedWord = new BannedWord({ bannedWordTxt, reason, substitution });
      await bannedWord.save();
      logger.info('BannedWord saved');
      res.status(201).json(bannedWord);
  } catch (e) {
      logger.error(e);
      next(e);
  }
};



exports.getBannedWord = async (req, res, next) => {
  try {
    const bannedWord = await BannedWord.findById(req.params.id).exec();
    if (!bannedWord) {
      return res.status(404).send('BannedWord not found');
    }
    logger.info('BannedWord with id ${req.params.id} retrieved');
    res.status(200).json(bannedWord);
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

exports.updateBannedWord = async (req, res, next) => {
  try {
    const { bannedWordTxt, reason, substitution } = req.body;
    const bannedWord = await BannedWord.findByIdAndUpdate(
      req.params.id,
      { bannedWordTxt, reason, substitution },
      { new: true }
    ).exec();
    if (!bannedWord) {
      return res.status(404).send('BannedWord not found');
    }
    logger.info('BannedWord with id ${req.params.id} updated');
    res.status(200).json(bannedWord);
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

exports.deleteBannedWord = async (req, res, next) => {
  try {
    const bannedWord = await BannedWord.findByIdAndDelete(req.params.id).exec();
    if (!bannedWord) {
      return res.status(404).send('BannedWord not found');
    }
    logger.info('BannedWord deleted');
    res.status(200).send('BannedWord deleted');
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

exports.errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('err');
};
