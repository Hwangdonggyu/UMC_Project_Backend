const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  name: String,
  message: String,
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Message', messageSchema)