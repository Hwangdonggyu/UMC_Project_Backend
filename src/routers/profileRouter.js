const express = require("express");

const { passwordEdit, deleteUser } = require("../controllers/profileController");
const { protectorMiddleware, publicOnlyMiddleware } = require("../middlewares");

const profileRouter = express.Router();

profileRouter
	.route('/pwedit')
	.all(protectorMiddleware)
	.put(passwordEdit);
profileRouter
	.route('/delete')
	.all(protectorMiddleware)
	.delete(deleteUser)

module.exports = profileRouter;