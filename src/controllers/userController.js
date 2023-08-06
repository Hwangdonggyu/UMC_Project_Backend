const User = require("../models/User");
const ResetToken = require("../models/ResetToken");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const multer = require('multer');

// 이미지 업로드를 위한 설정 (미완성)
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/uploads"); // 파일 저장 경로
	},
	filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); //파일 이름
    }
  });

// 어떤 파일을 허용할 것인지
const fileFilter = (req, file, cb) => {
    const typeArray = file.mimetype.split('/');
    const fileType = typeArray[1];

    if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg' || fileType == 'gif' || fileType == 'webp') {
        req.fileValidationError = null;
        cb(null, true);
    } else {
        req.fileValidationError = "jpg, jpeg, png, gif, webp 파일만 업로드 가능합니다.";
        cb(null, false)
    }
}

const upload = multer({
    storage : storage,
    fileFilter : fileFilter,
    limits: { 
        fileSize: 10 * 1024 * 1024 // 사진 크기 제한 : 10MB
    }
});

// 유저 페이지 (Demo)
exports.loginPage = async (req, res) => {
	return res.status(200).render('login.ejs');
}
exports.registerPage = async (req, res) => {
	return res.status(200).render('register.ejs');
}
exports.mainPage = async (req, res) => {
    return res.status(200).render('main.ejs', { user: req.session.user });
}
exports.forgetPwPage = async (req, res) => {
	return res.status(200).render('forget-password.ejs');
}
exports.settingPage = async (req, res) => {
	return res.status(200).render('setting.ejs', { user: req.session.user });
}

// 로그인, 로그아웃, 회원가입, 메일전송
exports.userLogin = async (req, res) => {
	const {
		email,
		password
	} = req.body;
	try {
		const user = await User.findOne({ email });
	
		if (!user || !(await bcrypt.compare(password, user.password))) {
		  return res.status(401).json({ error: "아이디 정보가 확인되지 않습니다." });
		}
	
		req.session.loggedIn = true;
		req.session.user = user;

		console.log({ message: "Login Success" });

		res.status(200).redirect('/main');
	
	  } catch (error) {
		console.error("Error in userLogin.", error);
		return res.status(500).json({ error: "Server error" });
	  }
}
exports.userLogout = (req, res) => {
    // 세션 삭제
    req.session.destroy((error) => {
        if (error) {
            console.error("Error while logging out.", error);
            return res.status(500).json({ success: false });
        }

        console.log({ message: "Logout Success" });
        return res.status(200).json({ success: true });
    });
};

exports.userRegister = async (req, res) => {
	const { 
		username,
		email,
		nickname,
		password,
		confirmPassword,
		phone,
		age,
		bloodType,
	//	imageUrl,
		startedDate,
		birthday
	} = req.body;
	try {
		// 이메일 중복 체크
		const existingUser = await User.findOne({ email });
		if (existingUser) {
		  return res.status(400).json({ error: "이미 사용중인 아이디입니다." });
		}

		// 비밀번호와 비밀번호 확인의 일치 여부
		if (password !== confirmPassword) {
			return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
		}
	
		// 비밀번호 암호화
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
		  age,
		  bloodType,
		  imageUrl: req.body.imageUrl || "uploads/heart.png",
		  connectCode: uuidString,
		  startedDate: new Date(startedDate),
		  birthday: new Date(birthday)
		});

		await newUser.save();
	
		console.log({ message: "성공적으로 가입되셨습니다." })

		res.status(200).redirect('/login');

	  } catch (error) {
		console.error("Error in userRegister.", error);
		return res.status(500).json({ error: "Server error" });
	  }
}
exports.sendingMail = async (req, res) => {
	const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
        return res.status(400).json({ error: "등록된 이메일 주소가 없습니다." });
    }
	try {

        // UUID의 첫 8자리를 임시 비밀번호로 사용
		const newUuid = uuid.v4();
        const tempPassword = newUuid.substr(0, 8);

        // 임시 비밀번호를 암호화하여 저장
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // 메일 전송 설정
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
        });

        // 임시 비밀번호를 이메일로 전송
        await transporter.sendMail({
            from: `"Love Keeper Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '안녕하세요. Love Keeper입니다.',
            text: `임시 비밀번호: ${tempPassword}`,
            html: `<p>임시 비밀번호: <strong>${tempPassword}</strong></p>`,
        });

        console.log({ message: "임시 비밀번호를 이메일로 보냈습니다." });

		res.status(200).redirect('/login');

    } catch (error) {
        console.error("Error in sendingMail.", error);
        return res.status(500).json({ error: "Server error" });
    }

}