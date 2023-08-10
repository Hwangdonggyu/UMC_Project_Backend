const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
	from: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	to: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
		required: true,
	},
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;