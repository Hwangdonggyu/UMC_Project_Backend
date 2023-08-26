const mongoose = require("mongoose");

const AlarmSchema = new mongoose.Schema({
	to: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	from: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	letter: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Letter",
	},
});

const Alarm = mongoose.model("Alarm", AlarmSchema);

module.exports = Alarm;
