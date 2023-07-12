const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
	title: String,
	body: String,
	createdAt: Date,
	send_user: String,
	receive_user: String,
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
