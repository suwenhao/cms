/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
var mongoose = require('mongoose')
var db = require('./db.js')

var schema = new mongoose.Schema({
    cid:{type:String},
    catename:{type:String},
    title:{type:String},
    author:{type:String},
    status:{type:Number,default:1},
    is_best:{type:Number},
    is_hot:{type:Number},
    is_new:{type:Number},
    keywords:{type:String},
    description:{type:String},
    content:{type:String},
    add_time:{type:Number,default:new Date().getTime()},
    img_url:{type:String},
    sort:{type:Number},
    count:{type:Number,default:0}
})

var Article = mongoose.model('Article', schema);

module.exports=Article;