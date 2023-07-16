const mongoose = require("mongoose");

const chattingSchema = new mongoose.Schema({
	chattingContent: {
		type: String,
		required: true,
	},
	chattingTime: {
		type: Date,
		default: Date.now,
		required: true,
	},
	checkStatus: {
		type: Boolean,
		required: true,
	},
	userID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	chattingRoomID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "chattingRoom",
		required: true,
	},
});

const Chatting = mongoose.model("Chatting", chattingSchema);

module.exports = Chatting;
