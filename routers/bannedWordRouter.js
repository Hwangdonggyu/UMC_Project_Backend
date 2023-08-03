const express = require('express');
const router = express.Router();
const bannedWordController = require("./controllers/bannedWordController");

router.post('/', bannedWordController.saveBannedWord);
router.put('/:id', bannedWordController.updateBannedWord);
router.delete('/:id', bannedWordController.deleteBannedWord);

module.exports = router;