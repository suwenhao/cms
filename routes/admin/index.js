/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
const router = require('koa-router')();
const Article = require('../../model/Article.js');
const Articlecate = require('../../model/Articlecate.js');
const Manage = require('../../model/Manage.js');
const Focus = require('../../model/Focus.js');
const Link = require('../../model/Link.js');
const Nav = require('../../model/Nav.js');
const Setting = require('../../model/Setting.js');
const ueditor = require('koa2-ueditor')
//引入子路由模块
const mongodbModel={
    'article':Article,
    'articlecate':Articlecate,
    'manage':Manage,
    'focus':Focus,
    'link':Link,
    'nav':Nav,
    'setting':Setting
}

const login = require('./login.js');
const manage = require('./manage.js');
const articlecate = require('./articlecate.js');
const article = require('./article.js');
const focus = require('./focus.js');
const link = require('./link.js');
const nav = require('./nav.js');
const setting = require('./setting.js');
const url = require('url')


router.use('/',async(ctx,next)=>{
    var pathname=url.parse(ctx.url).pathname;
    //登录继续向下匹配路由
    if(ctx.session.userinfo){
        await next();
    }else{
        if(pathname==='/admin/login' 
        || pathname==='/admin/login/dologin' 
        || pathname==='/admin/login/code'){
            await next();
        }else{
            ctx.redirect('/admin/login')
        }
    }
})
router.get('/', async (ctx)=>{
   await ctx.render('admin/index')
})
//改变状态
router.get('/changeStatus', async (ctx)=>{
    let {collectionName,attr,id} = ctx.query;
    let data = await mongodbModel[collectionName].find({'_id':id});
    if(data.length>0){
        if(data[0][attr]===1){
            var obj={
                [attr]:0
            }
        }else{
            var obj={
                [attr]:1
            }
        }
    }
    let result = await mongodbModel[collectionName].update({'_id':id},{$set:obj});
    if(result){
        ctx.body={msg:'修改成功',code:0,data:obj}
    }else{
        ctx.body={msg:'修改失败',code:1,data:obj}
    }
})
//删除
router.get('/delete', async (ctx)=>{
    let {collectionName,id} = ctx.query;
    try {
         let data=await mongodbModel[collectionName].findOne({'_id':id});
         if(data){
             let result=await mongodbModel[collectionName].deleteOne({'_id':id});
             if(result){
                 ctx.body={msg:'删除成功',code:0}  
             }else{
                 ctx.body={msg:'删除失败',code:2}  
             }
         }else{
             ctx.body={msg:'不存在此数据',code:1}  
         }
     } catch (error) {
         ctx.body={msg:'不存在此数据',code:1}   
     }
 })
//引入子路由
router.use('/login',login);
router.use('/manage',manage);
router.use('/articlecate',articlecate);
router.use('/article',article);
router.use('/focus',focus);
router.use('/link',link);
router.use('/nav',nav);
router.use('/setting',setting);

router.all('/editor/controller', ueditor(['statics', {
	"imageAllowFiles": [".png", ".jpg", ".jpeg","gif","ico","svg"],
	"imagePathFormat": "/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))

module.exports = router.routes()