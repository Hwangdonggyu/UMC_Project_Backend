const mongoose = require("mongoose");

const chattingRoomSchema = new mongoose.Schema({
	messages: [
		{
			type: mongoose.Types.ObjectId,
			ref: "Chatting",
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
});

const ChattingRoom = mongoose.model("ChattingRoom", chattingRoomSchema);

module.exports = ChattingRoom;
