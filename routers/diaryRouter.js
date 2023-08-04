const express = require("express");
const diaryController = require("../controllers/diaryController");
const diaryRouter = express.Router();
const uploadMiddleware = require('../config/multer');

diaryRouter.route('/rules')
    .get(diaryController.getRules)
    .post(diaryController.postRule);
diaryRouter.route('/rules/:ruleId')
    .patch(diaryController.patchRule)
    .delete(diaryController.deleteRule);

/**
diaryRouter.route('/board')
    .get(diaryController.getDiaries)
    .post(diaryController.postDiary);
diaryRouter.route('/board/:diaryId')
    .patch(diaryController.patchDiary)
    .delete(diaryController.deleteDiary);

//댓글
diaryRouter.route('/board/:diaryId/comments')
    .post(diaryController.postCommet)
    .delete(diaryController.deleteComment);
*/
diaryRouter.post('/upload', uploadMiddleware, (req, res) => {
    console.log(req.files);
})
module.exports = diaryRouter;