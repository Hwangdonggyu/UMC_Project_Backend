const express = require("express");
const diaryController = require("../controllers/diaryController");
const diaryRouter = express.Router();

diaryRouter.route('/rules')
    .get(diaryController.getRules)
    .post(diaryController.postRule);
diaryRouter.route('/rules/:ruleId')
    .patch(diaryController.patchRule)
    .delete(diaryController.deleteRule);
/**
diaryRouter.route('/board')
    .get(diaryController.getDiaries)
    .post(diaryController.postDiary)
    .patch(diaryController.patchDiary)
    .delete(diaryController.deleteDiary)
 */
module.exports = diaryRouter;