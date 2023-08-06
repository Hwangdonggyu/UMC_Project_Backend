const express = require("express");

const { profilePage, pweditPage, passwordEdit, deleteUser } = require("../controllers/profileController");
const { protectorMiddleware, publicOnlyMiddleware } = require("../middlewares");

const profileRouter = express.Router();

profileRouter
	.route('/')
	.get(protectorMiddleware, profilePage);
profileRouter
	.route('/pwedit')
	.get(protectorMiddleware, pweditPage);

profileRouter
	.route('/pwedit')
	.post(protectorMiddleware, passwordEdit)
profileRouter
	.route('/delete')
	.delete(protectorMiddleware, deleteUser)

module.exports = profileRouter;