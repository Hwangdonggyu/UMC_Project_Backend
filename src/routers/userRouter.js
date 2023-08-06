const express = require("express");

const { loginPage, registerPage, mainPage, forgetPwPage, settingPage, userLogin, userLogout, userRegister, sendingMail } = require("../controllers/userController");
const { protectorMiddleware, publicOnlyMiddleware } = require("../middlewares");

const userRouter = express.Router();

// 로그인, 회원가입 페이지 (Demo)
userRouter
	.route('/login')
	.get(publicOnlyMiddleware, loginPage);
userRouter
	.route('/register')
	.get(publicOnlyMiddleware, registerPage);
userRouter
	.route('/main')
	.get(protectorMiddleware, mainPage);
userRouter
	.route('/forget-password')
	.get(publicOnlyMiddleware, forgetPwPage);
userRouter
	.route('/setting')
	.get(protectorMiddleware, settingPage);


// 로그인, 로그아웃, 회원가입, 메일전송
userRouter
	.route('/login')
	.post(userLogin);
userRouter
	.route('/logout')
	.post(userLogout);
userRouter
	.route('/register')
	.post(userRegister);
userRouter
	.route('/forget-password')
	.post(sendingMail);

module.exports = userRouter;