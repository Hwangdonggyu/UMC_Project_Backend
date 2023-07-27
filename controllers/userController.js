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

exports.postLetter = async (req, res) => {
	const {
		session: {
			user: { _id },
		},
		body: { letter }, // 클라이언트에서 보내주는 letter의 구조를 안 후에 작성하도록.
	} = req;

	const newLetter = await Letter.create({});
};
