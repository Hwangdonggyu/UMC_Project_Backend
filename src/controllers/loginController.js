const User = require("../models/User");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const { sendMail } = require("../services/emailService");

// 로그인
exports.userLogin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res
				.status(401)
				.json({
					error: "아이디 정보가 확인되지 않습니다.",
					success: false,
				});
		}

		req.session.loggedIn = true;
		req.session.user = user;

		// 파트너의 초대코드가 저장되어있다면 메인으로, 아니면 연결창으로
		let redirectPath = "/main";
		if (user.partnerId === null) {
			redirectPath = "/connect";
		}

		console.log({ message: "Login Success" });
		return res
			.status(200)
			.json({
				message: "로그인 처리되었습니다.",
				success: true,
				redirect: redirectPath,
			});
	} catch (error) {
		console.error("Error in userLogin.", error);
		return res.status(500).json({ error: "Server error", success: false });
	}
};

// 로그아웃
exports.userLogout = (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			console.error("Error while logging out.", error);
			return res
				.status(500)
				.json({ error: "Server error", success: false });
		}

		console.log({ message: "Logout Success" });
		return res
			.status(200)
			.json({
				message: "로그아웃 되었습니다.",
				success: true,
				redirect: "/login",
			});
	});
};

// 회원가입
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
		birthday,
	} = req.body;
	try {
		// 이메일 중복 체크
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res
				.status(400)
				.json({ error: "이미 사용중인 아이디입니다.", success: false });
		}

		// 비밀번호와 비밀번호 확인의 일치 여부
		if (password !== confirmPassword) {
			return res
				.status(400)
				.json({
					error: "비밀번호가 일치하지 않습니다.",
					success: false,
				});
		}

		// 비밀번호 암호화
		const hashedPassword = await bcrypt.hash(password, 10);

		// uuid 생성 (초대코드 10자리)
		const fullUuid = uuid.v4();
		const uuidString = fullUuid.substr(fullUuid.length - 10).toUpperCase();

		// 파일 url
		let imageUrl = "public/uploads/heart.png"; // 기본 이미지 URL
		if (req.file) {
			imageUrl = `public/uploads/${req.file.filename}`;
		}

		// 회원 정보를 DB에 저장
		const newUser = new User({
			username,
			email,
			nickname,
			password: hashedPassword,
			phone,
			age,
			bloodType,
			imageUrl,
			connectCode: uuidString,
			startedDate: new Date(startedDate),
			birthday: new Date(birthday),
		});

		await newUser.save();

		// 환영 메일
		await sendMail(
			email,
			"안녕하세요. Love Keeper 팀입니다.",
			`Love Keeper에 가입에 주셔서 감사합니다. 환영합니다!`,
			`<p>Love Keeper에 가입에 주셔서 감사합니다. 환영합니다!</p>`
		);

		console.log({ message: "Sending success" });

		console.log({ message: "Register success" });

		return res
			.status(200)
			.json({
				message: "회원가입에 성공하였습니다.",
				success: true,
				redirect: "/login",
			});
	} catch (error) {
		console.error("Error in userRegister.", error);
		return res.status(500).json({ error: "Server error", success: false });
	}
};

// 비밀번호 찾기
exports.passwordFind = async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		return res
			.status(400)
			.json({ error: "등록된 이메일 주소가 없습니다.", success: false });
	}
	try {
		// UUID의 첫 8자리를 임시 비밀번호로 사용
		const newUuid = uuid.v4();
		const tempPassword = newUuid.substr(0, 8);

		// 임시 비밀번호를 암호화하여 저장
		const hashedPassword = await bcrypt.hash(tempPassword, 10);
		user.password = hashedPassword;
		await user.save();

		// 임시 비밀번호를 이메일로 전송
		await sendMail(
			email,
			"안녕하세요. Love Keeper입니다.",
			`임시 비밀번호: ${tempPassword}`,
			`<p>임시 비밀번호: <strong>${tempPassword}</strong></p>`
		);

		console.log({ message: "Sending success" });

		return res
			.status(200)
			.json({
				message: "임시 비밀번호를 이메일로 보냈습니다.",
				success: true,
				redirect: "/login",
			});
	} catch (error) {
		console.error("Error in sendingMail.", error);
		return res.status(500).json({ error: "Server error", success: false });
	}
};

// 파트너 연결
exports.connectWithPartner = async (req, res) => {
	const { connectCode } = req.body;

	try {
		const currentUser = await User.findById(req.session.user._id);

		// 입력한 초대코드로 유저 찾기
		const partnerUser = await User.findOne({ connectCode });

		if (!partnerUser) {
			return res
				.status(400)
				.json({
					error: "존재하지 않는 초대코드입니다.",
					success: false,
				});
		}

		currentUser.partnerNickname = partnerUser.nickname;
		currentUser.partnerId = partnerUser.connectCode;

		partnerUser.partnerNickname = currentUser.nickname;
		partnerUser.partnerId = currentUser.connectCode;

		await currentUser.save();
		await partnerUser.save();

		console.log({ message: "Connecting success" });
		return res
			.status(200)
			.json({
				message: "파트너 연결이 성공적으로 완료되었습니다.",
				success: true,
				redirect: "/main",
			});
	} catch (error) {
		console.error("Error while connecting with partner.", error);
		return res.status(500).json({ error: "Server error" });
	}
};

// 문의하기
exports.sendSupportEmail = async (req, res) => {
	if (!req.session.loggedIn) {
		return res
			.status(401)
			.json({ error: "로그인이 필요합니다.", success: false });
	}
	try {
		const user = await User.findById(req.session.user._id);

		// 여러가지 문제에 대한 답변을 이메일로 전송 (ex. 서버문제, 파트너 연결 문제, 애인이 더 화났잖아요@!@! 등등)
		// 각 문제에 대해 숫자를 지정하고 해당 문제에 대한 답변 내용은 emailService.js에 저장해서 활용하면 좋을 듯.
		await sendMail(
			user.email,
			"안녕하세요. Love Keeper입니다.",
			`안녕하세요. 문의해 주셔서 감사합니다. 해당 문제는...`,
			`<p>안녕하세요. 문의해 주셔서 감사합니다. 해당 문제는...</p>`
		);

		console.log({ message: "답변 전송" });

		res.status(200).json({
			message: "답변 이메일을 보냈습니다.",
			success: true,
		});
	} catch (error) {
		console.error("Error in sending support email.", error);
		return res.status(500).json({ error: "Server error", success: false });
	}
};
