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
    site_name:{type:String},
    site_logo:{type:String},
    site_keywords:{type:String},
    site_description:{type:String},
    site_icp:{type:String},
    site_about:{type:String},
    site_qq:{type:String},
    site_phone:{type:String},
    site_address:{type:String},
    site_time:{type:Number,default:new Date().getTime()},
    site_frist_time:{type:Number,default:new Date().getTime()},
    site_status:{type:Number},
    site_companyName:{type:String},
    site_postalCode:{type:String},
    site_fax:{type:String}
})

var Setting = mongoose.model('Setting', schema);

module.exports=Setting;