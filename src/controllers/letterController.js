const Letter = require("../models/Letter");
const User = require("../models/User");

const { io } = require("../server");

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

	// 파트너가 없으면 에러.
	if (!partnerId) {
		return res.status(400).json({ message: "파트너가 없습니다." });
	}

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

		return res
			.status(200)
			.json({ message: "편지가 성공적으로 전송되었습니다." });
	} catch (err) {
		return res.status(400).json({ message: err });
	}
};

// 보낸 편지 보기.
exports.getLetter = async (req, res) => {
	const {
		params: { id },
	} = req;

	const letter = await Letter.findById(id);
	// 편지 없음
	if (!letter) return res.status(400).json({ message: "편지가 없습니다." });

	// 편지가 있으면 읽은 횟수 +1
	letter.readedCount += 1;
	letter.save();

	return res.status(200).json(letter);
};
