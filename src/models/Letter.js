const mongoose = require("mongoose");

// Create a schema for the letter
const letterSchema = new mongoose.Schema({
	reasonForReconciliation: {
		type: String,
		required: true,
	},
	reasonForOccurrence: {
		type: String,
		required: true,
	},
	currentFeelings: {
		type: String,
		required: true,
	},
	waysToMaintainRelationship: {
		type: String,
		required: true,
	},
	apologyWithLove: {
		type: String,
		required: true,
	},
	letter: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
	from: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	to: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	readedCount: {
		type: Number,
		default: 0,
		required: true,
	},
});

// Create the model using the schema
const Letter = mongoose.model("Letter", letterSchema);

// Export the model
module.exports = Letter;
