const express = require("express");
const upload = require('../config/uploadConfig'); // 이미지 업로드 설정 경로 변경

const { loginPage, registerPage, mainPage, forgetPwPage, settingPage, 
	userLogin, userLogout, userRegister, passwordFind, connectWithPartner, sendSupportEmail } = require("../controllers/userController");
const { protectorMiddleware, publicOnlyMiddleware } = require("../middlewares");

const userRouter = express.Router();

userRouter
	.route('/login')
	.all(publicOnlyMiddleware)
	.get(loginPage)
	.post(userLogin);

userRouter
	.route('/register')
	.all(publicOnlyMiddleware)
	.get(registerPage)
	.post(upload.single('profileImage'), userRegister);

userRouter
	.route('/main')
	.all(protectorMiddleware)
	.get(mainPage);

userRouter
	.route('/findpw')
	.all(publicOnlyMiddleware)
	.get(forgetPwPage)
	.post(passwordFind);

userRouter
	.route('/setting')
	.all(protectorMiddleware)
	.get(settingPage);

userRouter
	.route('/logout')
	.get(userLogout);

userRouter
	.route('/connect')
	.all(protectorMiddleware)
	.post(connectWithPartner);

userRouter
	.route('/question')
	.all(protectorMiddleware)
	.get(sendSupportEmail);
	
module.exports = userRouter;