const Diary = require("../models/Diary");
const Comment = require("../models/Comment");
const User = require("../models/User");
const { ObjectId } = require("mongodb");
const date = require("../config/moment");
const fs = require('fs');

const diaryController = {

    /**
     * [GET] /diary/board
     */
    getDiaries: async(req, res) => {
        try{
            const {_id} = req.session;  // 로그인 된 회원의 _id
            const getValue = 'writer content img.filename comment createdAt'
            let diaries = await Diary.find({writer: _id}).populate('writer', 'nickname').select(getValue);

            const user = await User.findById(_id, 'connectCode');
            const connectCode = user.connectCode;
            
            //파트너가 작성한 diary들 반환
            const partner = await User.findOne({connectCode : connectCode, _id : {$ne : _id}});

            if (partner){
                const diariesByPartner = await Diary.find({writer: partner._id}).populate('writer', 'nickname').select(getValue);
                console.log(diariesByPartner);
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
        } catch (err){
            console.log(err);
            return res.status(500).end();
        }
    },
    /**
     * [POST] /diary/board
     */
    postDiary: async(req, res) => {
        try{
            const {_id} = req.session;  // 로그인 된 회원의 _id
            const content = req.body.content;
            const images = req.files;

            const diary = new Diary({
                writer: _id,
                content: content,
                img: images,
            })
            
            const result = await diary.save();
            id = result._id;
            console.log(result);
            return res.status(200).send({result: {"_id" : id}});
        } catch(err){
            console.log(err);
            return res.status(500).end();
        }
        
    },
    /**
     * [GET] /diary/board/:diaryId
     */
    getDiaryById: async(req, res) => {
        try{
            const {diaryId} = req.params
            const view = 'writer content img.filename comment createdAt'
            const diary = await Diary.findById(diaryId).populate('writer', 'nickname').select(view);
            if (!diary) {return res.status(404).send({msg: "존재하지 않는 일기"})};
            
            const comments = await Comment.find({diary: diaryId}, {diary: 0, __v: 0}).populate('writer', {nickname: 1});
            const parentComments = [];
            const childComments = {};


            for (const val of comments) {
            
                //parentComment가 존재하면 childComment에 값 추가
                if(val.parentComment){
                    pId = String(val.parentComment);
                    if (pId in childComments) {
                        childComments[pId].push(val);
                    } else {
                        childComments[pId] = [];
                        childComments[pId].push(val);
                    }
                } else {    //parentComment가 존재하지 않으면 parentComment에 값 추가
                    parentComments.push(val);
                }
            }

            //result 형식  
            const result = [];
            const url = "http://localhost:4000/img/uploads/"

            result.push({
                _id: diary._id,
                writer: diary.writer.nickname,
                content: diary.content,
                img: diary.img.map((item) => { return url + item.filename }),
                commentsNumber: diary.comment.length,
                parentComments: parentComments,
                childComments: childComments,
                createdAt: diary.createdAt
            })

            return res.status(200).send({result});
        } catch(err){
            console.log(err);
            return res.status(500).end();
        }
    
    },
    /**
     * [PATCH] /diary/board/:diaryId
     */
    patchDiary: async(req, res) => {
        try{
            const {diaryId} = req.params
            const content = req.body.content;   // 수정된 내용
            const addImgs = req.files;   // 추가한 이미지 - file 정보
            const deleteImgs = req.body.deleteImg; // 삭제한 이미지 - url 정보
            let deleteImgArr = [];
            let deleteImgName;
            const diary = await Diary.findById(diaryId, 'img content');

            //삭제한 이미지가 존재하면 Diary에서 해당 이미지를 찾아서 삭제
            if (deleteImgs){
                deleteImgArr = deleteImgs.split(';');
                for (const val of deleteImgArr){
                    deleteImgName = val.split('/').pop();
                    
                    diary.img.forEach((v, idx, arr) => {
                        if (v.filename == deleteImgName){
                            diary.img.splice(idx, 1);
                        }
                    })
       
                    if(fs.existsSync(`./uploads/${deleteImgName}`)){ // 파일이 존재한다면 true 그렇지 않은 경우 false 반환
                        fs.unlinkSync(`./uploads/${deleteImgName}`) // unlinkSync 파일 삭제
                        console.log("file 삭제 완료")
                    }
                }
            }
            //추가한 이미지가 존재하면 Diary에 해당 이미지 추가
            if(addImgs) {
                for (const val of addImgs){
                    diary.img.push(val);
                }
            }
            //수정된 내용이 존재하면 내용 수정
            if (content) diary.content = content; 
    
            const result = await diary.save();

            const id = result._id;

            return res.status(200).end();

        } catch(err) {
            console.log(err);
            return res.status(500).end();
        }
    },
    /**
     * [DELETE] /diary/board/:diaryId
     */
    deleteDiary: async(req, res) => {
        try{
            const {diaryId} = req.params;
            const diary = await Diary.findById(diaryId, 'comment');
            
            //comment 삭제
            for (const val of diary.comment){
                await Comment.findByIdAndDelete(val);
            }
            
            //diary 삭제
            const result = await Diary.findByIdAndDelete(diaryId);
            
            return res.status(200).end();
        } catch(err){
            console.log(err);
            return res.status(500).end();
        }
    },
    /**
     * [POST] /diary/board/:diaryId/comments
     */
    postComment: async(req, res) => {
    
        const {_id} = req.session;  // 로그인 된 회원의 _id
        const {diaryId} = req.params;
        let {parentComment, content} = req.body;

        if (parentComment){
            parentComment = new ObjectId(parentComment);
        }

        const comment = new Comment({
            diary: diaryId,
            parentComment: parentComment,
            writer: _id,
            content: content
        })
        
        const result = await comment.save();
        id = result._id;

        //diaryId에 해당하는 Diary에 comment 추가
        const diary = await Diary.findById(diaryId, 'comment');
        diary.comment.push(id);
        await diary.save();

        return res.status(200).send({result: {"_id" : id}});
    },
    /**
     * [DELETE] /diary/board/:diaryId/:commentId
     */
    deleteComment: async(req, res) => {
        try{
            const {diaryId, commentId} = req.params;
            
            const result = await Comment.findByIdAndUpdate(commentId, {
                isDeleted: true
            });
            
            //Diary에서 해당 comment 삭제
            const diary = await Diary.findById(diaryId, 'comment');
            const idx = diary.comment.indexOf(commentId);
            diary.comment.splice(idx, 1);
            await diary.save();

            return res.status(200).end();
        } catch(err){
            console.log(err);
            return res.status(500).end();
        }
    }
}

module.exports = diaryController;