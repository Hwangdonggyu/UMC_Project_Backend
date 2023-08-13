const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
	send_user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	photoUrl: String,
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;