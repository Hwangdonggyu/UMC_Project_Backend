const User = require("../models/User");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const multer = require('multer');
const pass = require('pass');

// 프로필 사진 업로드를 위한 설정
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/"); // 파일 저장 경로
	},
	filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); //파일 이름
    }
  });

const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

// 로그인, 회원가입 페이지 (Demo)
exports.loginPage = async (req, res) => {
	return res.status(200).render('login.ejs');
}
exports.registerPage = async (req, res) => {
	return res.status(200).render('register.ejs');
}
exports.mainPage = async (req, res) => {
	return res.status(200).render('main.ejs');
}

// 로그인, 회원가입 기능구현
exports.userLogin = async (req, res) => {
	const {
		email,
		password
	} = req.body;
	try {
		const user = await User.findOne({ email });
	
		if (!user || !(await bcrypt.compare(password, user.password))) {
		  return res.status(401).json({ error: "Invalid ID or password" });
		}
	
		req.session.loggedIn = true;
		req.session.user = user;

		// 로그인 후에 메인창으로
		res.redirect('/user/main');
	
	  } catch (error) {
		console.error("Error in userLogin: ", error);
		return res.status(500).json({ error: "Server error" });
	  }
}
exports.userRegister = async (req, res) => {
	const { 
		username,
		email,
		nickname,
		password,
		phone,
	//	age,
		bloodType,
		connectCode,
	//	startedDate,
		birthday
	} = req.body;
	try {
		// 이메일 중복 체크
		const existingUser = await User.findOne({ email });
		if (existingUser) {
		  return res.status(400).json({ error: "이미 사용중인 아이디입니다." });
		}
	
		// bcrypt를 이용해 비밀번호 암호화
		const hashedPassword = await bcrypt.hash(password, 10);

		// uuid 생성 (초대코드 10자리)
		const fullUuid = uuid.v4();
		const uuidString = fullUuid.substr(fullUuid.length - 10).toUpperCase();

		// 회원 정보를 DB에 저장
		const newUser = new User({
		  username,
		  email,
		  nickname,
		  password: hashedPassword,
		  phone,
	//	  age,
		  bloodType,
		  imageUrl,
		  connectCode: uuidString,
	//	  startedDate: new Date(startedDate),
		  birthday: new Date(birthday)
		});
		await newUser.save();
	
		// 회원가입이 진행되고 다시 로그인창으로
		res.redirect('/user/login');

	  } catch (error) {
		console.error("Error in userRegister: ", error);
		return res.status(500).json({ error: "Server error" });
	  }
}
