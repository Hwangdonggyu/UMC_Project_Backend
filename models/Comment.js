const mongoose = require("mongoose");
const date = require('../config/moment');

const commentSchema = new mongoose.Schema({
	diary: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Diary",
		required: true,
	},
	parentComment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment",
		required: false
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
	isDeleted: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: String,
		default: date(),
		required: true,
	}
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
