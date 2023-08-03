const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/', messageController.saveMessage);
router.get('/:id', messageController.getMessage);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;