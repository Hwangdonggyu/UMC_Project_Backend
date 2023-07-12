require("./db");

const express = require("express");
const morgan = require("morgan");

const PORT = 3000;

const app = express();
const logger = morgan("dev");

app.use(logger);

app.get("/", (req, res) => {});

app.listen(PORT, () => {
	console.log(`Server started on http://localhost:${PORT}`);
});
