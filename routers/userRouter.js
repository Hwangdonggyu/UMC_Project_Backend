const express = require("express");

const { getSentLetters, postLetter } = require("../controllers/userController");
const { protect } = require("../middlewares");

const userRouter = express.Router();

userRouter
	.route("/sendLetter")
	.all(protect.protectorMiddleware)
	.get(getSentLetters)
	.post(postLetter);

module.exports = userRouter;
