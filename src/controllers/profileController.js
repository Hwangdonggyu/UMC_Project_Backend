const User = require("../models/User");
const ResetToken = require("../models/ResetToken");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
// const crypto = require("crypto");
const nodemailer = require('nodemailer');
const multer = require('multer');

// 프로필 페이지 (Demo)
exports.profilePage = async (req, res) => {
	return res.status(200).render('profile.ejs', { user: req.session.user });
}
exports.pweditPage = async (req, res) => {
	return res.status(200).render('pwedit.ejs', { user: req.session.user });
}

// 유저 정보 변경, 회원 탈퇴
exports.passwordEdit = async (req, res) => {
	const { currentPassword, newPassword, confirmPassword } = req.body;

    try {
        const user = await User.findById(req.session.user._id);

        // 현재 비밀번호 일치 여부 확인
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: '기존의 비밀번호와 일치하지 않습니다.' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: '새 비밀번호가 일치하지 않습니다.' });
        }

        // 새 비밀번호 암호화 및 저장
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        console.log({ message : '비밀번호가 변경되었습니다.' });
        return res.status(200).redirect('/profile');

    } catch (error) {
        console.error('Error in password change.', error);
        return res.status(500).json({ error: 'Server error' });
    }
}
exports.deleteUser = async (req, res) => {
	try {
        const user = await User.findByIdAndDelete(req.session.user._id);
        if (!user) {
            return res.status(400).json({ success: false, error: "회원 정보를 찾을 수 없습니다." });
        }

        // 세션에서 사용자 정보 제거
        req.session.destroy();

		console.log({ message : '삭제처리되었습니다.' });
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error in user delete.", error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}