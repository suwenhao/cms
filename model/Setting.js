var mongoose = require('mongoose')
var db = require('./db.js')

var schema = new mongoose.Schema({
    site_name:{type:String},
    site_url:{type:String},
    site_logo:{type:String},
    keywords:{type:String},
    description:{type:String},
    icp:{type:String},
    about:{type:String},
    phone:{type:String},
    add_time:{type:Number,default:new Date().getTime()},
    status:{type:Number}
})

var Setting = mongoose.model('Setting', schema);

module.exports=Setting;