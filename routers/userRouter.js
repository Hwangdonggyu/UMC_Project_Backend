const express = require("express");

const { getSentLetters, sendLetter } = require("../controllers/userController");
const { protectorMiddleware, publicOnlyMiddleware } = require("../middlewares");

const userRouter = express.Router();

userRouter.route("/getLetters").all(protectorMiddleware).get(getSentLetters);
userRouter.route("/sendLetter").all(protectorMiddleware).post(sendLetter);

module.exports = userRouter;
