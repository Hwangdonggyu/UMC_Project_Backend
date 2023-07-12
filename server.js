require("./db");
const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));

app.use(express.static("public"));

app.get("/", (request, response) => {
	response.sendFile(__dirname + "/views/index.html");
});

app.listen(3000, () => {
	console.log(`Server listening on port http://localhost:3000`);
});
