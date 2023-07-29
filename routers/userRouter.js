const express = require("express");

const {
	getSentLetters,
	postSentLetter,
	getReceivedLetters,
} = require("../controllers/userController");
const { protectorMiddleware, publicOnlyMiddleware } = require("../middlewares");

const userRouter = express.Router();

userRouter
	.route("/getSendLetters")
	.all(protectorMiddleware)
	.get(getSentLetters);
userRouter
	.route("/getReceivedLetters")
	.all(protectorMiddleware)
	.get(getReceivedLetters);
userRouter.route("/sendLetter").all(protectorMiddleware).post(postSentLetter);

module.exports = userRouter;
