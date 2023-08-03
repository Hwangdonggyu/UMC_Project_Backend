const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema({
	writeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	writerName: {
		type: String,
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
	comment: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		}
	],
	created_at: {
		type: Date,
		default: () => Date.now() + KR_TIME_DIFF,
	},
});

const Diary = mongoose.model("Diary", diarySchema);

module.exports = Diary;
