const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		// username:     {type: String, required: true},
		kakaoId: { type: String, required: true, unique: true },
		nickname: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		phone: { type: String, required: true, unique: true },
		age: { type: Number, required: true },
		bloodType: { type: String, required: true },
		imageUrl: { type: String },
		started_date: { type: Date, required: true },
		birthday: { type: Date, required: true },
		connectCode: { type: String, required: true, unique: true },
		partnerId: { type: String, required: true, unique: true },
		createdAt: { type: Date, default: Date.now, required: true },
		//  created_date: {type: Date  , required: true},
		//  modified_date:{type: Date  , required: true},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
