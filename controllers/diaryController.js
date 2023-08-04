const Diary = require("../models/Diary");
const Comment = require("../models/Comment");
const User = require("../models/User");
const { ObjectId } = require("mongodb");
const date = require("../config/moment");

const diaryController = {

    /**
     * [GET] /diary/board
     */
    getDiaries: async(req, res) => {

        const userId = new ObjectId(req.body.userId);
        const view = 'writer content img.filename comment createdAt'
        let diaries = await Diary.find({writer: userId}).populate('writer', 'nickname').select(view);

        const partner = await User.findById(userId, 'partnerId');
        
        //파트너가 작성한 diary들 반환
        
        if (partner){
            const partnerId = new ObjectId(partner.partnerId);
            const diariesByPartner = await Diary.find({writer: partnerId});
            diaries = diaries.concat(diariesByPartner);
        }

        //result 형식
        const resultArr = [];
        const url = "http://localhost:4000/img/uploads/"
        for (const val of diaries) {
            resultArr.push({
                _id: val._id,
                writer: val.writer.nickname,
                content: val.content,
                img: val.img.map((item) => { return url + item.filename }),
                comment: val.comment.length,
                createdAt: val.createdAt
            })
        }
        //생성된 날짜순으로 정렬(최신순)
        const result = resultArr.sort((a,b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }).reverse();

        return res.status(200).send({result});
        
    },
    /**
     * [POST] /diary/board
     */
    postDiary: async(req, res) => {
        const userId = new ObjectId(req.body.userId);
        const content = req.body.content;
        const images = req.files;

        const diary = new Diary({
            writer: userId,
            content: content,
            img: images,
        })
        
        const result = await diary.save();
        id = result._id;
        console.log(result);
        return res.status(200).send({result: {"_id" : id}});
    },
    /**
     * [GET] /diary/board/:diaryId
     */
    getDiaryById: async(req, res) => {
        const userId = new ObjectId(req.body.userId);

    },
    /**
     * [PATCH] /diary/board/:diaryId
     */
    patchDiary: async(req, res) => {

    },
    /**
     * [DELETE] /diary/board/:diaryId
     */
    deleteDiary: async(req, res) => {

    },
    /**
     * [POST] /diary/board/:diaryId/comments
     */
    postComment: async(req, res) => {

    },
    /**
     * [DELETE] /diary/board/:diaryId/:commentId
     */
    deleteComment: async(req, res) => {

    }
}

module.exports = diaryController;