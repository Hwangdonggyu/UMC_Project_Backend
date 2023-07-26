require("./db");
const express = require("express");
const morgan = require("morgan");

// Routers

const app = express();

app.use(morgan("dev"));

app.get("/", (req, res) => {
	return res.send("Hello World!");
});

module.exports = app;
