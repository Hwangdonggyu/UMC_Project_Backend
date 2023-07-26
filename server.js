require("./db");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const morgan = require("morgan");

const userRouter = require("./routers/userRouter");

// Routers

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	// session middleware 를추가. router 앞에 설정해야함!
	session({
		secret: process.env.COOKIE_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: null,
		},
		MongoStore: MongoStore.create({
			mongoUrl: process.env.DB_URL,
		}),
	})
);

app.use("/users", userRouter);

module.exports = app;
