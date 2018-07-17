/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
const router = require('koa-router')();
const Setting = require('../../model/Setting.js')
const sd = require('silly-datetime')
const util = require('../../model/util.js')

router.get('/', async (ctx)=>{
    let data = await Setting.findOne({}).lean();
    await ctx.render('admin/setting/setting',{
        data
    })
})

router.post('/doedit',util.upload().single('pic'), async (ctx)=>{
    let file = ctx.req.file;
    let {id,site_name,site_icp,site_qq,site_phone,site_about,logo,site_address,site_status,site_keywords,site_description} = ctx.req.body;
    var obj={
        site_logo:file?file.path.replace(/statics\\/,'').replace(/\\/g,'/'):logo,
        site_name,site_icp,site_qq,site_phone,site_about,site_address,site_status,site_keywords,site_description
    }
    let data = await Setting.update({_id:id},{$set:obj});
    if(data){
        ctx.body={
            code:0,
            msg:'修改系统设置成功',
            site_logo:file?file.path.replace(/statics\\/,'').replace(/\\/g,'/'):logo
        }
    }else{
        ctx.body={
            code:1,
            msg:'修改系统设置失败'
        }
    }
})
module.exports = router.routes()