const express = require("express");
const ruleController = require("../controllers/ruleController");
const diaryController = require("../controllers/diaryController");
const diaryRouter = express.Router();
const uploadMiddleware = require('../config/multer');

//rule
diaryRouter.route('/rules')
    .get(ruleController.getRules)
    .post(ruleController.postRule);
diaryRouter.route('/rules/:ruleId')
    .patch(ruleController.patchRule)
    .delete(ruleController.deleteRule);

//diary
diaryRouter.route('/board')
    .get(diaryController.getDiaries)
    .post(uploadMiddleware, diaryController.postDiary);
diaryRouter.route('/board/:diaryId')
    .get(diaryController.getDiaryById)
    .put(diaryController.patchDiary)
    .delete(diaryController.deleteDiary);

//comment
diaryRouter.post('/board/:diaryId/comments',diaryController.postComment);
diaryRouter.delete('/board/:diaryId/:commentId',diaryController.deleteComment);

module.exports = diaryRouter;