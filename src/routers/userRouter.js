const express = require("express");
const upload = require('../uploadConfig'); // 이미지 업로드 설정 모듈 가져오기

const { loginPage, registerPage, mainPage, forgetPwPage, settingPage, userLogin, userLogout, userRegister, passwordFind, connectWithPartner, sendSupportEmail } = require("../controllers/userController");
const { protectorMiddleware, publicOnlyMiddleware } = require("../middlewares");

const userRouter = express.Router();

// 로그인, 회원가입 페이지 (Demo)
userRouter
	.route('/login')
	.all(publicOnlyMiddleware)
	.get(loginPage)
	.post(userLogin); // 로그인 처리도 같은 라우트 경로에 POST 메소드로 정의

userRouter
	.route('/register')
	.all(publicOnlyMiddleware)
	.get(registerPage)
	.post(upload.single('profileImage'), userRegister); // 회원가입 처리도 같은 라우트 경로에 POST 메소드로 정의

userRouter
	.route('/main')
	.all(protectorMiddleware)
	.get(mainPage);

userRouter
	.route('/findpw')
	.all(publicOnlyMiddleware)
	.get(forgetPwPage)
	.post(passwordFind); // 메일 전송도 같은 라우트 경로에 POST 메소드로 정의

userRouter
	.route('/setting')
	.all(protectorMiddleware)
	.get(settingPage);

userRouter
	.route('/logout')
	.post(userLogout);

userRouter
	.route('/connect')
	.all(protectorMiddleware)
	.post(connectWithPartner);

userRouter
	.route('/question')
	.all(protectorMiddleware)
	.get(sendSupportEmail);
	
module.exports = userRouter;