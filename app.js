require('dotenv').config();
const express = require('express');
const Controllers = require("./src/models")
const mongoose = require('mongoose');
require("./db");

const app = express();

const { PORT, MONGO_URI } = process.env;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Databases
const Comment = require("./models/Comment");
const Diary = require("./models/Diary");
const User = require("./models/User");
const Letter = require("./models/Letter");
const Rule = require("./models/Rule");
const Chat = require("./models/Chat");
const BannedWord = require("./models/BannedWord");

Controllers.forEach((controller) => {
  app.use(controller.path, controller.router);
});


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));