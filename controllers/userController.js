const Letter = require("../models/Letter");
const User = require("../models/User");

exports.getSentLetters = async (req, res) => {
	const {
		session: {
			user: { _id, sentLetters },
		},
	} = req;

	const user = await User.findById(_id).populate("sentLetters");

	return res.json(user.sentLetters);
};

exports.postSentLetter = async (req, res) => {
	const {
		session: {
			user: { _id, partnerId },
		},
		body: {
			reasonForReconciliation,
			reasonForOccurrence,
			currentFeelings,
			waysToMaintainRelationship,
			apologyWithLove,
			letter,
		}, // 클라이언트에서 보내주는 letter의 구조를 안 후에 작성하도록.
	} = req;
	try {
		const newLetter = await Letter.create({
			reasonForReconciliation,
			reasonForOccurrence,
			currentFeelings,
			waysToMaintainRelationship,
			apologyWithLove,
			letter,
		});
		const user = await User.findById(_id);
		user.sentLetters.push(newLetter._id);

		const partner = await User.findById(_id);
		partner.receivedLetters.push(newLetter._id);
	} catch (err) {
		return res.status(400).json({ err });
	}
};

exports.getReceivedLetters = async (req, res) => {
	const {
		session: {
			user: { _id },
		},
	} = req;

	const user = await User.findById(_id).populate("receivedLetters");

	return res.json(user.receivedLetters);
};
