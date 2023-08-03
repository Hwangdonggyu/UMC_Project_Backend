const Letter = require("../models/Letter");
const User = require("../models/User");

// 보낸 편지함 내역 보기
exports.getSentLetters = async (req, res) => {
	const {
		session: {
			user: { _id },
		},
	} = req;

	const user = await User.findById(_id).populate("sentLetters");

	return res.status(200).json(user.sentLetters);
};

// 받은 편지함 내역 보기
exports.getReceivedLetters = async (req, res) => {
	const {
		session: {
			user: { _id },
		},
	} = req;

	const user = await User.findById(_id).populate("receivedLetters");

	return res.status(200).json(user.receivedLetters);
};

// 편지 보내기 화면 보기.
exports.getSendLetter = async (req, res) => {
	req.session.loggedIn = true;

	return res.render("sendLetter.pug");
};

// 편지 전송 기능.
exports.postSendLetter = async (req, res) => {
	const {
		session: {
			// user: { _id, partnerId },
			loggedIn,
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
			from: _id,
			to: partnerId,
		});

		const user = await User.findById(_id);
		user.sentLetters.push(newLetter._id);

		const partner = await User.findById(_id);
		partner.receivedLetters.push(newLetter._id);

		return res.sendStatus(200);
	} catch (err) {
		return res.sendStatus(400);
	}
};

// 보낸 편지 보기.
exports.getLetter = async (req, res) => {
	const {
		params: { letterId },
	} = req;

	const letter = await Letter.findById(letterId);

	return res.json(letter);
};
