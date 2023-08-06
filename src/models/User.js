const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	username:    { type: String, required: true },
	email:       { type: String, required: true },
	nickname:    { type: String, required: true },
	password:    { type: String, required: true },
	phone:       { type: String, required: true },
	age:         { type: Number, required: true },
	bloodType:   { type: String, required: true },
	imageUrl:    {
		type: String,
		default: "public/uploads/heart.png"
	},
	startedDate: { type: Date},
	birthday:    { type: Date},
	connectCode: { type: String, required: true },
	partnerId:   { type: String, default: null }, // 기본값을 null로 하고 연결 시에 저장하는 걸로
	createdAt:   { type: Date,	default: Date.now, required: true }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;


// kakaoId: { type: String, required: true, unique: true },