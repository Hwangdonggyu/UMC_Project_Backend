const mongoose = require("mongoose");

const ruleSchema = mongoose.Schema({
	writer: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true,
	},
	content: {
		type: String,
		maxLength: 200,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
});

const Rule = mongoose.model("Rule", ruleSchema);

module.exports = Rule;
