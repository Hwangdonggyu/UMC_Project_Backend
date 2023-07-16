const mongoose = require("mongoose");

const patchSchema = new mongoose.Schema({
	send_user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	reason: String, // 화해 요청 계기
	whatHappened: String, // 무슨 일이 있었나요?
	emotion: String,
	anything: String,
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
});
