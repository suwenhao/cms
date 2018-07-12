const router = require('koa-router')();
const Setting = require('../../model/Setting.js')
const sd = require('silly-datetime')
const util = require('../../model/util.js')

router.get('/', async (ctx)=>{
    await ctx.render('admin/setting/setting')
})

router.post('/doedit',util.upload().single('pic'), async (ctx)=>{
    let file = ctx.req.file;
    let {title,status,url,sort,newpic,id} = ctx.req.body;
    let newsort=sort||0;
    var obj={
        url,
        pic:file?file.path.replace(/statics\\/,'').replace(/\\/g,'/'):newpic,
        title,
        status,
        sort:newsort
    }
    let data = await Setting.update({_id:id},{$set:obj});
    if(data){
        ctx.body={
            code:0,
            msg:'修改系统设置成功'
        }
    }else{
        ctx.body={
            code:1,
            msg:'修改系统设置失败'
        }
    }
})
module.exports = router.routes()