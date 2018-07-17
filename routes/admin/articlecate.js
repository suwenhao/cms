/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
const router = require('koa-router')();
const Articlecate = require('../../model/Articlecate.js')
const util = require('../../model/util.js')

router.get('/', async (ctx)=>{
    let data=await Articlecate.find({}).lean();
    await ctx.render('admin/articlecate/list',{
        list:util.cateToList(data)
    })
})

router.get('/add', async (ctx)=>{
    await ctx.render('admin/articlecate/add')
})

router.post('/doadd', async (ctx)=>{
    let {title,pid,status,keywords,description} = ctx.request.body
    let data=await Articlecate.create({
        title,
        pid,
        status,
        keywords,
        description,
        add_time:new Date().getTime()
    });
    if(data){
        ctx.body={msg:'增加分类成功',code:0,data}
    }else{
        ctx.body={msg:'增加分类失败',code:1}
    }
})

router.post('/getcate', async(ctx)=>{
    let data=await Articlecate.find({}).lean();
    if(data.length>0){
        ctx.body={msg:'获取成功',code:0,data:data.map(v=>{
            return {
                ...v,
                id:v._id,
                name:v.title
            }
        })}
    }else{
        ctx.body={msg:'获取失败',code:1,data:[]}
    }
})

router.get('/edit/:id', async (ctx)=>{
    let id=ctx.params.id;
    let result=await Articlecate.find({}).lean();
    let cateobj={}
    result.forEach(v=>{
        cateobj[v._id]=v
    })
    try {
        let data=await Articlecate.findOne({_id:id}).lean();
        await ctx.render('admin/articlecate/edit',{
            list:data,
            cateobj:cateobj
        })
    } catch (error) {
        await ctx.render('404')    
    }
})

router.post('/doedit', async (ctx)=>{
    let {id,title,pid,status,keywords,description} = ctx.request.body
    let data=await Articlecate.update({_id:id},{$set:
        {
            title,
            pid,
            status,
            keywords,
            description
        }
    });
    if(data){
        ctx.body={msg:'修改分类成功',code:0,data}
    }else{
        ctx.body={msg:'修改分类失败',code:1}
    }
})


module.exports = router.routes()