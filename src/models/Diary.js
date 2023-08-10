const mongoose = require("mongoose");

const diarySchema = mongoose.Schema({
	writer: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true,
	},
	content: {
		type: String,
		maxLength: 1000,
		required: true,
	},
	imgUrl: [
		{
			type: String,
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
});

const Diary = mongoose.model("Diary", diarySchema);

module.exports = Diary;