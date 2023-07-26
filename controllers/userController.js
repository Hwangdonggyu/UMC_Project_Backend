const Letter = require("../models/Letter");
const User = require("../models/User");

const getSentLetters = async (req, res) => {
	const {
		session: {
			user: { _id },
		},
	} = req;
};

const postLetter = async (req, res) => {};
