const express = require("express");
const bannedWordRouter = express.Router();
const bannedWordController = require("../controllers/bannedWordController");

bannedWordRouter.post("/", bannedWordController.saveBannedWord);
bannedWordRouter.get("/:bannedWordTxt", bannedWordController.getBannedWord);
bannedWordRouter.put("/:bannedWordTxt", bannedWordController.updateBannedWord);
bannedWordRouter.delete(
	"/:bannedWordTxt",
	bannedWordController.deleteBannedWord
);

module.exports = bannedWordRouter;
