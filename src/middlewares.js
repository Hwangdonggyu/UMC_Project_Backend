// 로그인 안되어있으면 로그인 페이지로
exports.protectorMiddleware = (req, res, next) => {
	if (req.session.loggedIn) {
		return next();
	} else {
		return res.redirect("/user/login");
	}
};

// 로그인 되어있으면 홈으로
exports.publicOnlyMiddleware = (req, res, next) => {
	if (!req.session.loggedIn) {
		return next();
	} else {
		return res.redirect("/main");
	}
};