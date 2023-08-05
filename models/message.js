const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  name: String
});

const audioSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  name: String
});

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  message: {
    type: String,
    required: true,
    maxLength: 200,
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'image', 'audio'],
  },
  image: imageSchema,
  audio: audioSchema,
  date: { 
    type: Date,
    default: Date.now
  }
})

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
