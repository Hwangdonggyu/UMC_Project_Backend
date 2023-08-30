const express = require("express");
const userRouter = express.Router();
const userController = require("./userController1");


userRouter.route('/')
    .get(userController.getUsers);
userRouter.route('/detail/:email')
    .get(userController.getUser);
userRouter.route('/:emails')
    .put(userController.updateUser);
userRouter.route('/check/:code')
    .get(userController.checkCouple);
userRouter.route('/deletecouple/:connectCode')
    .put(userController.deleteCouple);

module.exports = userRouter;