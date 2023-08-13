const Rule = require("../models/Rule");
const User = require("../models/User");
const { ObjectId } = require("mongodb");
const date = require("../config/moment");

const ruleController = {
    
    /**
     * [GET] /diary/rules
     */
    getRules: async (req, res) => {
        try{
            const {_id} = req.session;  // 로그인 된 회원의 _id

            let rules = await Rule.find({writer: _id}, {content: 1, createdAt: 1});
            const user = await User.findById(_id, 'connectCode');
            const connectCode = user.connectCode;
            
            //파트너가 작성한 규칙들 반환
            const partner = await User.findOne({connectCode : connectCode, _id : {$ne : _id}});

            if (partner){
                const rulesByPartner = await Rule.find({writer: partner._id}, {content:1 , createdAt: 1});
                rules = rules.concat(rulesByPartner);
            }

            //생성된 날짜순으로 정렬(최신순)
            const result = rules.sort((a,b) => {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }).reverse();

            return res.status(200).send({result});
        } catch(err){
            console.log(err);
            res.status(500).end();
        }
        
    },

    /**
     * [POST] /diary/rules
     */
    postRule: async (req, res) => {
        try{
            const {_id} = req.session;  // 로그인 된 회원의 _id
            const content = req.body.content;
    
            const rule = new Rule({
                writer: _id,
                content: content
            })
            
            const result = await rule.save();
            id = result._id;
            return res.status(200).send({result: {"_id" : id}});
        }catch(err){
            console.log(err);
            res.status(500).end();
        } 
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
    }
}

module.exports = ruleController;