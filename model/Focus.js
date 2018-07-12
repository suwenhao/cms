var mongoose = require('mongoose')
var db = require('./db.js')

var schema = new mongoose.Schema({
    pic:{type:String},
    title:{type:String},
    url:{type:String},
    sort:{type:Number},
    add_time:{type:Number,default:new Date().getTime()},
    status:{type:Number}
})

var Focus = mongoose.model('Focus', schema);

module.exports=Focus;