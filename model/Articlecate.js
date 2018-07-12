var mongoose = require('mongoose')
var db = require('./db.js')

var schema = new mongoose.Schema({
    title:{type:String},
    description:{type:String},
    keywords:{type:String},
    add_time:{type:Number,default:new Date().getTime()},
    pid:{type:String},
    status:{type:Number,default:1}
})

var Articlecate = mongoose.model('Articlecate', schema);

module.exports=Articlecate;