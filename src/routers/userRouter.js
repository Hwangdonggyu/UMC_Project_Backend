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

// 보낸 편지함 열기
userRouter
	.route("/getSentLetters")
	.all(protectorMiddleware)
	.get(getSentLetters);

// 받은 편지함 열기
userRouter
	.route("/getReceivedLetters")
	.all(protectorMiddleware)
	.get(getReceivedLetters);

//편지 보내기
userRouter
	.route("/sendLetter")
	.all(protectorMiddleware)
	.get(getSendLetter)
	.post(postSendLetter);

userRouter
	.route("/letter/:letterId(([a-f0-9]{24}))")
	.all(protectorMiddleware)
	.get(getLetter);

module.exports = userRouter;
