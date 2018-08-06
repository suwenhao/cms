/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
const mongoose = require('mongoose');
const db = mongoose.connect("mongodb://localhost:27017/koacms",{ useNewUrlParser: true });
module.exports=db;