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
    pic:{type:String},
    title:{type:String},
    url:{type:String},
    sort:{type:Number},
    add_time:{type:Number,default:new Date().getTime()},
    status:{type:Number}
})

var Focus = mongoose.model('Focus', schema);

module.exports=Focus;