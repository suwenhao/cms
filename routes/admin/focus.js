/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
const router = require('koa-router')();
const Focus = require('../../model/Focus.js')
const sd = require('silly-datetime')
const util = require('../../model/util.js')

router.get('/', async (ctx)=>{
    await ctx.render('admin/focus/list')
})

router.get('/add', async (ctx)=>{
    await ctx.render('admin/focus/add')
})

router.get('/getdata', async (ctx)=>{
    let {page,pagesize} = ctx.query
    if(!page){
        page=1;
    }
    if(!pagesize){
        pagesize=5;
    }
    var skip=(page-1)*pagesize;
    var limit=parseInt(pagesize);
    let alldata=await Focus.find({});
    let data=await Focus.find({}).sort({'add_time':1}).skip(skip).limit(limit).lean();
    ctx.body={
        msg:'获取数据成功',
        code:0,
        list:data.map(v=>{
            return {
                ...v,
                add_time:sd.format(new Date(v.add_time), 'YYYY-MM-DD HH:mm:ss')
            }
        }),
        page,
        pagesize,
        totalSize:alldata.length
    }
})

router.post('/doadd',util.upload().single('pic'), async (ctx)=>{
    let file = ctx.req.file;
    let {title,status,url,sort} = ctx.req.body;
    let newsort=sort||0;
    var obj={
        title,
        status,
        url,
        add_time:new Date().getTime(),
        pic:file?file.path.replace(/statics\\/,'').replace(/\\/g,'/'):'uploads/default/focus.jpg',
        sort:newsort
    }
    let result = await Focus.create(obj);
    if(result){
        ctx.body={
            code:0,
            msg:'增加轮播图成功'
        }
    }else{
        ctx.body={
            code:1,
            msg:'增加轮播图失败'
        }
    }
})

router.get('/edit/:id', async (ctx)=>{
    let id = ctx.params.id;
    try {
        let data = await Focus.findOne({_id:id}).lean()
        await ctx.render('admin/focus/edit',{
            data:{
                ...data,
                pic:data.pic.replace(/statics\//,'')
            }
        })
    } catch (error) {
        await ctx.render('404')
    }
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
    let data = await Focus.update({_id:id},{$set:obj});
    if(data){
        ctx.body={
            code:0,
            msg:'修改轮播图成功'
        }
    }else{
        ctx.body={
            code:1,
            msg:'修改轮播图失败'
        }
    }
})
router.post('/changeSort',async(ctx)=>{
    let {id,sort} = ctx.request.body
    let data = await Focus.update({_id:id},{$set:{sort}});
    if(data){
        ctx.body={
            code:0,
            msg:'修改sort成功'
        }
    }else{
        ctx.body={
            code:1,
            msg:'修改sort失败'
        }
    }
})
module.exports = router.routes()