const express = require('express');
const router = express.Router();
const bannedWordController = require("../controllers/bannedWordController");

router.post('/', bannedWordController.saveBannedWord);
router.get('/:bannedWordTxt', bannedWordController.getBannedWord);
router.put('/:bannedWordTxt', bannedWordController.updateBannedWord);
router.delete('/:bannedWordTxt', bannedWordController.deleteBannedWord);

module.exports = router;
