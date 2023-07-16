require("./db");
const express = require("express");
const morgan = require("morgan");
const Post = require("./models/Post");

const app = express();

app.use(morgan("dev"));

app.use(express.static("public"));

app.get("/", (req, res) => {
	return res.send("Hello World!");
});

app.listen(3000, () => {
	console.log(`Server listening on port http://localhost:3000`);
});
