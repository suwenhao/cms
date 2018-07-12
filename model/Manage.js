var mongoose = require('mongoose')
var db = require('./db.js')

var schema = new mongoose.Schema({
    username:{type:String},
    password:{type:String},
    status:{type:Number,default:false},
    add_time:{type:Number,default:new Date().getTime()},
    login_time:{type:Number,default:new Date().getTime()}
})

var Manage = mongoose.model('Manage', schema);

module.exports=Manage;