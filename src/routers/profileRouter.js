const express = require("express");

const { profilePage, pwEditPage } = require("../controllers/profileController");
const { protectorMiddleware, publicOnlyMiddleware } = require("../middlewares");

const profileRouter = express.Router();

profileRouter
	.route('/')
	.get(protectorMiddleware, profilePage);
profileRouter
	.route('/pwEdit')
	.get(protectorMiddleware, pwEditPage);


module.exports = profileRouter;