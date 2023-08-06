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
exports.pwEditPage = async (req, res) => {
	return res.status(200).render('pwEdit.ejs', { user: req.session.user });
}

// 유저 정보 변경, 회원 탈퇴
exports.deleteUser = async (req, res) => {
	return res.status(200).render('profile.ejs', { user: req.session.user });
}