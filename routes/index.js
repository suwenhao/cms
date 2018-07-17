/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
const router = require('koa-router')();
const Article = require('../model/Article.js');
const Articlecate = require('../model/Articlecate.js');
const Manage = require('../model/Manage.js');
const Focus = require('../model/Focus.js');
const Link = require('../model/Link.js');
const Setting = require('../model/Setting.js');
const Nav = require('../model/Nav.js');
const url = require('url')


router.use(async(ctx,next)=>{
    var pathname=url.parse(ctx.url).pathname;
    let navResult =await Nav.find({status:1}).sort({sort:1}).lean()
    let SettingResult =await Setting.findOne({}).lean()
    let LinkResult =await Link.find({}).lean()
    ctx.state.nav=navResult
    ctx.state.pathname=pathname
    ctx.state.setting=SettingResult
    ctx.state.links=LinkResult
    await next()
})
router.get('/', async (ctx)=>{
    let focusResult =await Focus.find({status:1}).sort({sort:1}).lean()
    await ctx.render('default/index',{
        focus:focusResult
    })
})
router.get('/service', async (ctx)=>{
    let ArticleResult =await Article.find({cid:'5b414f2e7bbcbfffd43a61e0',status:1}).sort({sort:1}).lean()
    await ctx.render('default/service',{
        article:ArticleResult
    })
})
router.get('/content/:id', async (ctx)=>{
    var id = ctx.params.id;
    var result =await Article.findOne({_id:id}).lean()
    try {
        var res = await Articlecate.findOne({_id:result.cid})
        var res1 = await Articlecate.findOne({_id:res.pid})
    } catch (error) {
        var res1 = await Articlecate.findOne({_id:result.cid})
    }
    await ctx.render('default/content',{
        res:result,
        navobj:res1
    })
})
router.get('/case', async (ctx)=>{
    var {id,page} = ctx.query
    if(!page){
        page=1;
    }
    var pagesize=9;
    var skip=(page-1)*pagesize;
    var limit=parseInt(pagesize);

    var acr =await Articlecate.find({pid:'5b414f2e7bbcbfffd43a61df'}).sort({sort:1}).lean()
    if(id){
        try {
            var acr1 =await Articlecate.findOne({_id:id,status:1}).sort({sort:1}).lean()
            var ar =await Article.find({cid:acr1._id,status:1}).skip(skip).limit(limit).sort({sort:1}).lean()
            var result=await Article.find({cid:acr1._id,status:1});
        } catch (error) {
            await ctx.redirect('/404')
        }
    }else{
        var subCateIds=[]
        acr.forEach(v=>{
            subCateIds.push(v._id)
        })
        var ar =await Article.find({cid:{$in:subCateIds},status:1}).skip(skip).limit(limit).sort({sort:1}).lean()
        var result=await Article.find({cid:{$in:subCateIds},status:1});
    }
    await ctx.render('default/case',{
        res:ar,
        cates:acr,
        current:id,
        totalsize:result.length,
        id,page,pagesize
    })
})
router.get('/news', async (ctx)=>{
    var {id,page} = ctx.query
    if(!page){
        page=1;
    }
    var pagesize=9;
    var skip=(page-1)*pagesize;
    var limit=parseInt(pagesize);

    var acr =await Articlecate.find({pid:'5b414f827bbcbfffd43a61e3'}).sort({sort:1}).lean()
    if(id){
        try {
            var acr1 =await Articlecate.findOne({_id:id,status:1}).sort({sort:1}).lean()
            var ar =await Article.find({cid:acr1._id,status:1}).skip(skip).limit(limit).sort({sort:1}).lean()
            var result=await Article.find({cid:acr1._id,status:1});
        } catch (error) {
            await ctx.redirect('/404')
        }
    }else{
        var subCateIds=[]
        acr.forEach(v=>{
            subCateIds.push(v._id)
        })
        var ar =await Article.find({cid:{$in:subCateIds},status:1}).skip(skip).limit(limit).sort({sort:1}).lean()
        var result=await Article.find({cid:{$in:subCateIds},status:1});
    }
    await ctx.render('default/news',{
        res:ar,
        cates:acr,
        current:id,
        totalsize:result.length,
        id,page,pagesize
    })
})
router.get('/about', async (ctx)=>{
    await ctx.render('default/index')
})
router.get('/connect', async (ctx)=>{
    await ctx.render('default/index')
})

module.exports = router.routes()