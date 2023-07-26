const express = require("express");

const { getSentLetters, postLetter } = require("../controllers/userController");
const { protectorMiddleware, publicOnlyMiddleware } = require("../middlewares");

const userRouter = express.Router();

userRouter
	.route("/sendLetter")
	.all(protectorMiddleware)
	.get(getSentLetters)
	.post(postLetter);

module.exports = userRouter;
