const express = require("express");

const {
	getSentLetters,
	postSendLetter,
	getReceivedLetters,
	getLetter,
	getSendLetter,
} = require("../controllers/letterController");
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
userRouter.route("/sendLetter").all(protectorMiddleware).post(postSendLetter);

// 편지 보기
userRouter
	.route("/:id(([a-f0-9]{24}))")
	.all(protectorMiddleware)
	.get(getLetter);

module.exports = userRouter;
