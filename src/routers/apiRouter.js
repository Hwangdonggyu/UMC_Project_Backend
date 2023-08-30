const express = require("express");

const { postAlarm } = require("../controllers/apiController");

const apiRouter = express.Router();

apiRouter.post("/", postAlarm);

module.exports = apiRouter;
