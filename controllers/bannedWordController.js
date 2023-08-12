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
    console.log(e.message)
      logger.error("error caught:", {
        message: e.message
      });
      next(e);
  }
};



exports.getBannedWord = async (req, res, next) => {
  try {
      const { bannedWordTxt } = req.params;

      const bannedWord = await BannedWord.findOne({ bannedWordTxt });
      if (!bannedWord) {
          return res.status(404).json({ error: 'BannedWord not found.' });
      }

      res.status(200).json(bannedWord);
  } catch (e) {
      next(e);
  }
};


exports.updateBannedWord = async (req, res, next) => {
  try {
      const { bannedWordTxt } = req.params;
      const { reason, substitution } = req.body;

      const bannedWord = await BannedWord.findOne({ bannedWordTxt });
      if (!bannedWord) {
          return res.status(404).json({ error: 'Word not found.' });
      }

      if (reason) bannedWord.reason = reason;
      if (substitution) bannedWord.substitution = substitution;

      await bannedWord.save();
      res.status(200).json(bannedWord);
  } catch (e) {
      next(e);
  }
};


exports.deleteBannedWord = async (req, res, next) => {
  try {
      const { bannedWordTxt } = req.params;

      const result = await BannedWord.findOneAndDelete({ bannedWordTxt });
      if (!result) {
          return res.status(404).json({ error: 'BannedWord not found.' });
      }

      res.status(200).json({ message: 'BannedWord deleted successfully.' });
  } catch (e) {
      next(e);
  }
};


exports.errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('err');
};
