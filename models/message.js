const mongoose = require('mongoose')

const textSchema = new mongoose.Schema({
  type: String,
  required: true,
  maxLength: 200,
});

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
  type: {
    type: String,
    required: true,
    enum: ['text', 'image', 'audio'],
  },
  text: textSchema,
  image: imageSchema,
  audio: audioSchema,
  date: { 
    type: Date,
    default: Date.now
  }
})

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
