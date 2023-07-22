const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
	diary: {
		type: mongoose.Types.ObjectId,
		ref: "Diary",
		required: true,
	},
	writer: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true,
	},
	content: {
		type: String,
		maxLength: 200,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;