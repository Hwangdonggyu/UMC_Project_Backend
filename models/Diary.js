const mongoose = require("mongoose");
const date = require("../config/moment");

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
	img: [
		{
			originalName: { type: String },
			mimetype: { type: String },
			fileName: { type: String },
			dirName: { type: String },
			size: { type: Number }
		}
	],
	comment: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		}
	],
	createdAt: {
		type: Date,
		default: date()
	},
});

const Diary = mongoose.model("Diary", diarySchema);

module.exports = Diary;
