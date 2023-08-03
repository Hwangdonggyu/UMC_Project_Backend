require("dotenv").config();
require("./db");

// Databases
const Comment = require("./models/Comment");
const Diary = require("./models/Diary");
const User = require("./models/User");
const Letter = require("./models/Letter");
const Rule = require("./models/Rule");
const Chat = require("./models/Chat");
const BannedWord = require("./models/BannedWord");

const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
global.KR_TIME_DIFF = KR_TIME_DIFF;

const app = require("./server");

const PORT = 4000;

const onListening = () => console.log(`Listening on: http://localhost:${PORT}`);

const onError = (error) => console.log(`Error: ${error}`);
const server = app.listen(PORT);

server.on("error", onError);
server.on("listening", onListening);
