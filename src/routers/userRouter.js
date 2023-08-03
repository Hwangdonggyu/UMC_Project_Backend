const express = require("express");

const {
	getSentLetters,
	postSendLetter,
	getReceivedLetters,
	getLetter,
	getSendLetter,
} = require("../controllers/userController");
const { protectorMiddleware, publicOnlyMiddleware } = require("../middlewares");

const userRouter = express.Router();

userRouter
	.route("/getSentLetters")
	// .all(protectorMiddleware)
	.get(getSentLetters);
userRouter
	.route("/getReceivedLetters")
	// .all(protectorMiddleware)
	.get(getReceivedLetters);
userRouter.route("/sendLetter").get(getSendLetter).post(postSendLetter);

userRouter
	.route("/letter/:letterId(([a-f0-9]{24}))")
	// .all(protectorMiddleware)
	.get(getLetter);

module.exports = userRouter;
