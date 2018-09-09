/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
const router = require('koa-router')();
const Nav = require('../../model/Nav.js')
const sd = require('silly-datetime')
const util = require('../../model/util.js')

router.get('/', async (ctx)=>{
    await ctx.render('admin/nav/list')
})

router.get('/add', async (ctx)=>{
    await ctx.render('admin/nav/add')
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
    let alldata=await Nav.find({});
    let data=await Nav.find({}).sort({'add_time':1}).skip(skip).limit(limit).lean();
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

router.post('/doadd', async (ctx)=>{
    let {title,status,url,sort} = ctx.request.body;
    let newsort=sort||0;
    var obj={
        title,
        status,
        url,
        add_time:new Date().getTime(),
        sort:newsort
    }
    let result = await Nav.create(obj);
    if(result){
        ctx.body={
            code:0,
            msg:'增加导航成功'
        }
    }else{
        ctx.body={
            code:1,
            msg:'增加导航失败'
        }
    }
})

router.get('/edit/:id', async (ctx)=>{
    let id = ctx.params.id;
    try {
        let data = await Nav.findOne({_id:id}).lean()
        await ctx.render('admin/nav/edit',{
            data:data
        })
    } catch (error) {
        await ctx.render('404')
    }
})
router.post('/doedit', async (ctx)=>{
    let {title,status,url,sort,id} = ctx.request.body;
    var obj={
        url,
        title,
        status,
        sort
    }
    let data = await Nav.update({_id:id},{$set:obj});
    if(data){
        ctx.body={
            code:0,
            msg:'修改导航成功'
        }
    }else{
        ctx.body={
            code:1,
            msg:'修改导航失败'
        }
    }
})
router.post('/changeSort',async(ctx)=>{
    let {id,sort} = ctx.request.body
    let data = await Nav.update({_id:id},{$set:{sort}});
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