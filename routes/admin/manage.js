/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
const router = require('koa-router')();
const Manage = require('../../model/Manage.js');
const util = require('../../model/util.js')


router.get('/', async (ctx)=>{
    let result = await Manage.find({});
    await ctx.render('admin/manage/list',{
        list:result||[]
    })
})

router.get('/add', async (ctx)=>{
    await ctx.render('admin/manage/add')
})
router.post('/doadd',async(ctx)=>{
    let {username,password} = ctx.request.body
    let json={
        username,
        password:util.md5Pwd(password),
        add_time:new Date().getTime(),
        login_time:new Date().getTime(),
        status:1
    }
    let data=await Manage.findOne({username});
    if(data){
        ctx.body={msg:'已存在此管理员',code:1}
    }else{
        let result=await Manage.create(json);
        if(result){
            ctx.body={msg:'增加管理员成功',code:0,result}
        }else{
            ctx.body={msg:'增加管理员失败',code:2}
        }
    }
})
router.get('/edit/:id', async (ctx)=>{
    let id=ctx.params.id;
    try {
        let data=await Manage.findOne({'_id':id})
        await ctx.render('admin/manage/edit',{
            data:{
             '_id':data._id,
             'username':data.username
            }
         })
    } catch (error) {
        await ctx.render('404')    
    }
})
router.post('/doedit', async(ctx)=>{
    let {id,password} = ctx.request.body;
    let result=await Manage.update({'_id':id},{$set:{password:util.md5Pwd(password)}});
    if(result){
        ctx.body={msg:'修改管理员成功',code:0,result}
    }else{
        ctx.body={msg:'修改管理员失败',code:1}
    }
})

module.exports = router.routes()