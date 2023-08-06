const Letter = require("../models/Letter");
const User = require("../models/User");

// 보낸 편지함 내역 보기
exports.getSentLetters = async (req, res) => {
	// 로그인 된 회원의 _id 가져옴
	const {
		session: {
			user: { _id },
		},
	} = req;

	// 그 유저의 보낸 편지함 populate
	const user = await User.findById(_id).populate("sentLetters");

	return res.status(200).json(user.sentLetters); // 최신순으로 정렬.
};

// 받은 편지함 내역 보기
exports.getReceivedLetters = async (req, res) => {
	// 로그인 된 회원의 _id 가져옴
	const {
		session: {
			user: { _id },
		},
	} = req;

	// 그 유저의 받은 편지함 populate
	const user = await User.findById(_id).populate("receivedLetters");

	return res.status(200).json(user.receivedLetters); // 최신순으로 정렬.
};

// 편지 보내기 화면 보기.
exports.getSendLetter = async (req, res) => {
	return res.render("sendLetter.pug");
};

// 편지 전송 기능.
exports.postSendLetter = async (req, res) => {
	const {
		session: {
			user: { _id, partnerId },
		},

		// 편지 내용 가져오기.
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
		// 편지 객체 생성.
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
		user.save();

		const partner = await User.findById(partnerId);
		partner.receivedLetters.push(newLetter._id);
		partner.save();

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
	if (!letter) return res.sendStatus(404); // 편지 없음.

	return res.status(200).json(letter);
};
