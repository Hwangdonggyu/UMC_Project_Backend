const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  /*user name for socket.io*/
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
  date: { 
    type: Date,
    default: Date.now
  }
})

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;