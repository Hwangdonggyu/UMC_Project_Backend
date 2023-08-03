const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema({
	writer: {
		type: mongoose.Schema.Types.ObjectId,
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
	created_at: {
		type: Date,
		default: Date.now,
		required: true,
	},
});

const Diary = mongoose.model("Diary", diarySchema);

module.exports = Diary;
