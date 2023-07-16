require("./db");
const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));

app.use(express.static("public"));

app.get("/", (req, res) => {
	return res.send("Hello World!");
});

module.exports = app;
