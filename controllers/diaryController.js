const Diary = require("../models/Diary");
const Rule = require("../models/Rule");
const Comment = require("../models/Comment");
const User = require("../models/User");
const { ObjectId } = require("mongodb");
const date = require("../moment");

const diaryController = {
    
    //Rule
    /**
     * [GET] /diary/rules
     */
    getRules: async (req, res) => {
        const userId = new ObjectId(req.body.userId);

        let rules = await Rule.find({writer: userId}, {content: 1, createdAt: 1});
        
        const partner = await User.findById(userId, 'partnerId');
        
        //파트너가 작성한 규칙들 반환
        if (partner){
            const partnerId = new ObjectId(partner.partnerId);
            const rulesByPartner = await Rule.find({writer: partnerId}, {content:1 , createdAt: 1});
            rules = rules.concat(rulesByPartner);
        }

        //생성된 날짜순으로 정렬(최신순)
        const result = rules.sort((a,b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }).reverse();

        return res.status(200).send({result});
    },

    /**
     * [POST] /diary/rules
     */
    postRule: async (req, res) => {
        const userId = new ObjectId(req.body.userId);
        const content = req.body.content;

        const rule = new Rule({
            writer: userId,
            content: content
        })
        
        const result = await rule.save();

        return res.status(200).send({result});
    },

    /**
     * [PATCH] /diary/rules/:ruleId
     */
    patchRule: async (req, res) => {
        try{
            const ruleId = new ObjectId(req.params.ruleId);
            const content = req.body.content;

            const result = await Rule.findByIdAndUpdate(ruleId, {
                content: content,
                createdAt: date()
            });

            return res.status(200).end();
        } catch(err){
            console.log(err);
            return res.status(500).end();
        }
    },

    /**
     * [DELETE] /diary/rules/:ruleId
     */
    deleteRule: async (req, res) => {
        try{
            const ruleId = new ObjectId(req.params.ruleId);
            const result = await Rule.findByIdAndDelete(ruleId);
    
            return res.status(200).end();
        } catch(err){
            console.log(err);
            return res.status(500).end();
        }
    },

    //Diary
    /**
     * [GET] /diary/board/:diaryId
     */
    getDiaries: async(req, res) => {
        
    }

}

module.exports = diaryController;