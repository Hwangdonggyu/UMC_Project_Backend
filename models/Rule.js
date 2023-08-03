const mongoose = require("mongoose");
const date = require('../moment');

const ruleSchema = new mongoose.Schema({
	writer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	content: {
		type: String,
		maxLength: 200,
		required: true,
	},
	created_at: {
		type: String,
		default: date,
	},
});

const Rule = mongoose.model("Rule", ruleSchema);

module.exports = Rule;
