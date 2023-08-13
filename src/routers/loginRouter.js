const express = require("express");
const upload = require('../config/uploadConfig'); // 이미지 업로드 설정 경로 변경

const { userLogin, userLogout, userRegister, passwordFind, connectWithPartner, sendSupportEmail } = require("../controllers/loginController");
const { protectorMiddleware, publicOnlyMiddleware } = require("../middlewares");

const userRouter = express.Router();

userRouter
	.route('/login')
	.all(publicOnlyMiddleware)
	.post(userLogin);

userRouter
	.route('/register')
	.all(publicOnlyMiddleware)
	.post(upload.single('profileImage'), userRegister);

userRouter
	.route('/findpw')
	.all(publicOnlyMiddleware)
	.post(passwordFind);

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