const mongoose = require("mongoose");
const date = require("../config/moment");

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
	img: [
		{
			originalname: { type: String },
			mimetype: { type: String },
			filename: { type: String },
			destination: { type: String },
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
		type: String,
		default: date()
	},
});

const Diary = mongoose.model("Diary", diarySchema);

module.exports = Diary;
