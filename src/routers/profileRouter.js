const express = require("express");

const { profilePage, pweditPage, passwordEdit, deleteUser } = require("../controllers/profileController");
const { protectorMiddleware, publicOnlyMiddleware } = require("../middlewares");

const profileRouter = express.Router();

profileRouter
	.route('/')
	.all(protectorMiddleware)
	.get(profilePage);
profileRouter
	.route('/pwedit')
	.all(protectorMiddleware)
	.get(pweditPage)
	.put(passwordEdit);
profileRouter
	.route('/delete')
	.all(protectorMiddleware)
	.delete(deleteUser)

module.exports = profileRouter;