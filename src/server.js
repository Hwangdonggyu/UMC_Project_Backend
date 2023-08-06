require("./db");
const express = require("express");
const session = require("express-session"); // express-session 미들웨어로 사용자 세션을 관리
const MongoStore = require("connect-mongo"); // connect-mongo으로 MongoDB에 세션 데이터를 저장
const morgan = require("morgan"); //  Express용 로깅 미들웨어인 morgan

// Routers
const userRouter = require("./routers/userRouter.js");
const profileRouter = require("./routers/profileRouter.js");

const app = express();

app.use(morgan("dev"));
app.set('view engine', 'ejs');
app.set("views", "src/views");

app.use(express.json()); // 클라이언트가 본문에 JSON 데이터가 포함된 HTTP POST 또는 PUT 요청을 보낼 때(예: axios, fetch 또는 기타 도구를 통해) 이 미들웨어는 JSON 데이터 읽기, 구문 분석 및 결과 첨부를 처리합니다. JavaScript 개체를 request.body 속성에 추가합니다.
app.use(express.urlencoded({ extended: true })); // 요청 본문에서 들어오는 URL 인코딩 데이터를 구문 분석합니다.

// 세션 미들웨어 설정: express-session 미들웨어를 사용하려면 먼저 앱에 세션 미들웨어를 추가해야 합니다.
app.use(
	// session middleware 를추가. router 앞에 설정해야함!
	session({
		secret: process.env.COOKIE_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: null }, // 24 hours 쿠키 유지시간
		MongoStore: MongoStore.create({
			mongoUrl: process.env.DB_URL,
		}),
	})
);

// 세션 정보 조회
app.get('/session', (req, res) => {
    console.log('Session Info:', req.session);
    res.json({ loggedIn: req.session.loggedIn, user: req.session.user });
});

app.use('/', userRouter);
app.use('/profile', profileRouter);

module.exports = app;