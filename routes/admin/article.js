/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
const router = require('koa-router')()
const Article = require('../../model/Article.js')
const Articlecate = require('../../model/Articlecate.js')
const sd = require('silly-datetime')
const util = require('../../model/util.js')

router.get('/', async (ctx)=>{
    await ctx.render('admin/article/list')
})
router.get('/getdata', async (ctx)=>{
    let {cid,title,status,is_best,sort,is_hot,is_new,page,pagesize} = ctx.query
    if(!page){
        page=1;
    }
    if(!pagesize){
        pagesize=5;
    }
    var skip=(page-1)*pagesize;
    var limit=parseInt(pagesize);

    var searchJSON = {};

    if(cid){
        searchJSON["cid"] = cid;
    }
    if(title){
        searchJSON["title"] = new RegExp(title);
    }
    if(sort){
        searchJSON["sort"] = sort;
    }
    if(status==1||status===0){
        searchJSON["status"] = status;
    }
    if(is_best==1||is_best===0){
        searchJSON["is_best"] = is_best;
    }
    if(is_hot==1||is_hot===0){
        searchJSON["is_hot"] = is_hot;
    }
    if(is_new==1||is_new===0){
        searchJSON["is_new"] = is_new;
    }
    let alldata=await Article.find(searchJSON);
    let catearr=await Articlecate.find({}).lean();
    let cateobj={}
    catearr.forEach(v=>{
        cateobj[v._id]=v
    })
    let data=await Article.find(searchJSON).sort({'add_time':-1}).skip(skip).limit(limit).lean();
    ctx.body={
        msg:'获取数据成功',
        code:0,
        list:data.map(v=>{
            return {
                ...v,
                add_time:sd.format(new Date(v.add_time), 'YYYY-MM-DD HH:mm')
            }
        }),
        cid,
        title,
        status,
        is_best,
        is_new,
        sort,
        is_hot,
        page,
        pagesize,
        cateobj:cateobj,
        totalSize:alldata.length
    }
})

router.get('/add', async (ctx)=>{
    await ctx.render('admin/article/add')
})

router.post('/doadd',util.upload().single('pic'),async (ctx)=>{
    let file = ctx.req.file;
    let {recommend,title,author,status,cid,catename,ueditor,keywords,description} = ctx.req.body;
    let data = await Article.findOne({cid:cid}).sort({sort:-1}).lean()
    let sort=0;
    if(data){
        sort=data.sort+1;
    }
    var obj={
        is_best:0,
        is_new:0,
        is_hot:0,
        add_time:new Date().getTime(),
        count:0,
        img_url:file?file.path.replace(/statics\\/,'').replace(/\\/g,'/'):'uploads/default/cover.jpg',
        sort:sort,
        content:ueditor,
        title,author,status,cid,catename,keywords,description
    }
    recommend.split(',').forEach(v=>{
        if(v=='best'){
            obj.is_best=1
        }else if(v=='hot'){
            obj.is_hot=1
        }else if(v=='new'){
            obj.is_new=1
        }
    })
    let result = await Article.create(obj);
    if(result){
        ctx.body={
            code:0,
            msg:'提交内容成功'
        }
    }else{
        ctx.body={
            code:1,
            msg:'提交内容失败'
        }
    }
    
})

router.get('/edit/:id', async (ctx)=>{
    let id=ctx.params.id;
    try {
        let data = await Article.findOne({_id:id}).lean()
        await ctx.render('admin/article/edit',{
            data:{
                ...data,
                img_url:data.img_url.replace(/statics\//,'')
            }
        })
    } catch (error) {
        await ctx.render('404')
    }
})

router.post('/doedit',util.upload().single('pic'), async (ctx)=>{
    let file = ctx.req.file;
    let {recommend,title,author,status,cid,catename,ueditor,keywords,description,img_url,id} = ctx.req.body;
    var obj={
        is_best:0,
        is_new:0,
        is_hot:0,
        img_url:file?file.path.replace(/statics\\/,'').replace(/\\/g,'/'):img_url,
        content:ueditor,
        title,author,status,cid,catename,keywords,description
    }
    recommend.split(',').forEach(v=>{
        if(v=='best'){
            obj.is_best=1
        }else if(v=='hot'){
            obj.is_hot=1
        }else if(v=='new'){
            obj.is_new=1
        }
    })
    let data = await Article.update({_id:id},{$set:obj});
    if(data){
        ctx.body={
            code:0,
            msg:'修改内容成功'
        }
    }else{
        ctx.body={
            code:1,
            msg:'修改内容失败'
        }
    }
})
router.post('/changeSort',async(ctx)=>{
    let {id,sort} = ctx.request.body
    let data = await Article.update({_id:id},{$set:{sort}});
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