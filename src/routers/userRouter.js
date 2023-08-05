const express = require("express");

const { loginPage, registerPage, mainPage, userLogin, userRegister } = require("../controllers/userController");
const { protectorMiddleware, publicOnlyMiddleware } = require("../middlewares");

const userRouter = express.Router();

// 로그인, 회원가입 페이지 (Demo)
userRouter
	.route('/login')
	// .all(protectorMiddleware)
	.get(loginPage);
userRouter
	.route('/register')
	// .all(protectorMiddleware)
	.get(registerPage);
userRouter
	.route('/main')
	// .all(protectorMiddleware)
	.get(mainPage);


// 로그인, 회원가입 기능구현
userRouter
	.route('/login')
	.post(userLogin);
userRouter
	.route('/register')
	.post(userRegister);

module.exports = userRouter;