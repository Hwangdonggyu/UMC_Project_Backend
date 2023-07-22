const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name : { type: String, required : true},
    nickname : { type : String, required : true},
    email : { type : String, required : true, unique : true},
    password : { type : String, required : true},
    phone_num : { type : Number, required : true, unique : true},
    age : { type : Number, required : true},
    blood_type : { type : String, required : true },
    img_url : { type : String },
    birthday : { type : Date, required : true},
    partner_id : { type : String, required : true},
    createdAt : { type : Date , default : Date.now }
});

