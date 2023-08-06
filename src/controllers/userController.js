const User = require("../models/User");
const ResetToken = require("../models/ResetToken");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const multer = require('multer');

// 이미지 업로드를 위한 설정
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

// 로그인, 회원가입 페이지 (Demo)
exports.loginPage = async (req, res) => {
	return res.status(200).render('login.ejs');
}
exports.registerPage = async (req, res) => {
	return res.status(200).render('register.ejs');
}
exports.mainPage = async (req, res) => {
	/*
	if (!req.session.loggedIn || !req.session.user) {
        // 로그인되지 않았거나 세션이 없을 경우 로그인 페이지로 리다이렉트
        return res.redirect('/user/login');
    }
	*/
    // 현재 로그인한 사용자 정보 활용하여 메인 페이지 렌더링
    return res.status(200).render('main.ejs', { user: req.session.user });
}
exports.forgetPwPage = async (req, res) => {
	return res.status(200).render('forget-password.ejs');
}
exports.resetPwPage = async (req, res) => {
	return res.status(200).render('reset-password.ejs');
}
exports.settingPage = async (req, res) => {
	return res.status(200).render('setting.ejs', { user: req.session.user });
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
		  return res.status(401).json({ error: "아이디 정보가 확인되지 않습니다." });
		}
	
		req.session.loggedIn = true;
		req.session.user = user;

		console.log({ message: "Login Success" });

		// 로그인 후에 메인창으로
		res.redirect('/main');
	
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

        // 세션 삭제 후 응답
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
		startedDate,
		birthday
	} = req.body;
	try {
		// 이메일 중복 체크
		const existingUser = await User.findOne({ email });
		if (existingUser) {
		  return res.status(400).json({ error: "이미 사용중인 아이디입니다." });
		}

		// 비밀번호와 비밀번호 확인의 일치 여부 확인
		if (password !== confirmPassword) {
			return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
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
		  age,
		  bloodType,
		  imageUrl: req.body.imageUrl || "uploads/heart.png",
		  connectCode: uuidString,
		  startedDate: new Date(startedDate),
		  birthday: new Date(birthday)
		});

		await newUser.save();
	
		console.log({ message: "성공적으로 가입되셨습니다." })

		// 회원가입이 진행되고 다시 로그인창으로
		res.redirect('/login');

	  } catch (error) {
		console.error("Error in userRegister.", error);
		return res.status(500).json({ error: "Server error" });
	  }
}
exports.sendingMail = async (req, res) => {
	const { email } = req.body;
    
    // 이메일 주소를 통해 사용자 정보 찾기
    const user = await User.findOne({ email });
    
    if (!user) {
        return res.status(400).json({ error: "등록된 이메일 주소가 없습니다." });
    }
	try{
		// 기존의 재설정 토큰 삭제 (이전 토큰을 지우고 새로 발행)
		const existingToken = await ResetToken.findOne({ userId: user._id });
		if (existingToken) {
			await ResetToken.findOneAndDelete({ userId: user._id });
		}

		// 비밀번호 재설정 토큰 생성 및 저장
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiration = Date.now() + 3600000; // 유효시간은 1시간

		const newResetToken = new ResetToken({
			userId: user._id,
			token: resetToken,
			expiration: resetTokenExpiration
		});
		await newResetToken.save();
		/*
	    // 비밀번호 재설정 링크 전송
		const transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: "sjkl6206s@gmail.com",
				pass: "audgnl3701!",
			},
		});
		
		await transporter.sendMail({
			to: email,
			subject: "안녕하세요, 러브키퍼입니다. :)",
			html: `
				<p>비밀번호를 재설정하려면 아래 링크를 클릭하세요:</p>
				<a href="http://localhost:4000/user/reset-password/${resetToken}">비밀번호 재설정</a>
			`,
		});

		return res.status(200).json({ message: "이메일로 비밀번호 재설정 링크를 보냈습니다." });
		*/
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
		
		// send mail with defined transport object
		const info = await transporter.sendMail({
			from: `"WDMA Team" <${process.env.EMAIL_USER}>`,
			to: email,
			subject: 'WDMA Auth Number',
			text: generatedAuthNumber,
			html: `<b>${generatedAuthNumber}</b>`,
		});
		
		console.log('Message sent: %s', info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
		
		res.status(200).json({
			status: 'Success',
			code: 200,
			message: 'Sent Auth Email',
		});
	} catch (error) {
        console.error("Error in forgetPassword: ", error);
        return res.status(500).json({ error: "Server error" });
    }

}