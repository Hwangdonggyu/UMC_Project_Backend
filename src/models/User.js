const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	username:    { type: String, required: true },
	email:       { type: String, required: true, unique: true },
	nickname:    { type: String, required: true, unique: true },
	password:    { type: String, required: true },
	phone:       { type: String, required: true, unique: true },
	age:         { type: Number, required: true },
	bloodType:   { type: String, required: true },
	imageUrl: {
		type: String,
		default: "public/uploads/heart.png",
	},
	startedDate: { type: Date  , required: true },
	birthday:    { type: Date  , required: true },
	connectCode: { type: String, required: true },
	partnerNickname: { type: String, dafult: null }, // 메인 페이지에서 '누구와 누구 연애한 지 ~일째'를 위해 필요
	partnerId:   { type: String, default: null },
	createdAt:   { type: Date  , default: Date.now, required: true },
	sentLetters: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Letter",
		},
	],
	receivedLetters: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Letter",
		},
	]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
