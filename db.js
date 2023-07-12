const mongoose = require("mongoose");

// Connect to the database
mongoose.connect("mongodb://localhost:27017/love_keeper", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error);

db.on("error", handleError);
db.once("open", handleOpen);
