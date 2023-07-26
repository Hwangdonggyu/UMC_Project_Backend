const mongoose = require("mongoose");

// Connect to the database
await mongoose.connect(
	"mongodb+srv://qkrehdrb0813:ehdfprl77@cluster0.w9mqdtx.mongodb.net/love_keeper",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error);

db.on("error", handleError);
db.once("open", handleOpen);
