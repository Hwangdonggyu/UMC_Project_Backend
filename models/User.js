const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	// username:     {type: String, required: true},
	nickname: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	phone: { type: String, required: true, unique: true },
	age: { type: Number, required: true },
	bloodType: { type: String, required: true },
	imageUrl: { type: String },
	starteddate: { type: Date, required: true },
	birthday: { type: Date, required: true },
	connectCode: { type: String, required: true},
	createdAt: { type: Date, default: Date.now, required: true },
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
	],

	//  createdDate: {type: Date  , required: true},
	//  modifiedDate:{type: Date  , required: true},
});

const User = mongoose.model("User", UserSchema);

module.exports = User;







// username:    { type: String, required: true },
// 	email:       { type: String, required: true, unique: true },
// 	nickname:    { type: String, required: true, unique: true },
// 	password:    { type: String, required: true },
// 	phone:       { type: String, required: true, unique: true },
// 	age:         { type: Number, required: true },
// 	bloodType:   { type: String, required: true },
// 	imageUrl: {
// 		type: String,
// 		default: "public/uploads/heart.png",
// 	},
// 	startedDate: { type: Date  , required: true },
// 	birthday:    { type: Date  , required: true },
// 	connectCode: { type: String, required: true },
// 	partnerNickname: { type: String, dafult: null },
// 	partnerId:   { type: String, default: null },
// 	createdAt:   { type: Date  , default: Date.now, required: true },


// sentLetters: [
// 		{
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: "Letter",
// 		},
// 	],
// 	receivedLetters: [
// 		{
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: "Letter",
// 		},
// 	],
