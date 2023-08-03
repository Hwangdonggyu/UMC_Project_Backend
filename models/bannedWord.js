const mongoose = require('mongoose');

const bannedWordSchema = new mongoose.Schema({
	userID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	bannedWordTxt: {
		type: String,
		required: true,
		unique: true,
	},
	reason: {
		type: String,
		required: true,
		maxLength: 200,
	},
	substitution: {
		type: String,
		required: true,
		maxLength: 200,
	},
});

const BannedWord = mongoose.model('BannedWord', bannedWordSchema);

module.exports = BannedWord;