/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
const Koa = require('koa'),
      Router = require('koa-router'),
      ArtTemplate = require('koa-art-template'),
      Static = require('koa-static'),
      Session = require('koa-session'),
      BodyParser = require('koa-bodyparser'),
      path = require('path'),
      url = require('url'),
      sd = require('silly-datetime'),
      compress = require('koa-compress'),
      jsonp = require('koa-jsonp');

const app = new Koa();
const router = new Router();

/*
*配置中间件
*/
//配置模板
ArtTemplate(app,{
    root: path.join(__dirname, 'views'),
    extname: '.art',
    debug: process.env.NODE_ENV !== 'production',
    dateFormat:dateFormat=function(value){
        return sd.format(new Date(value), 'YYYY-MM-DD HH:mm')
    }
})
//配置session
app.keys = ['some secret hurr'];
app.use(Session({
    key: 'koa:sess',
    maxAge: 8640000,
    overwrite: true,
    httpOnly: true,
    signed: true, 
    rolling: true, 
    renew: false
},app))
//配置静态资源
app.use(Static(path.join(__dirname,'public')))
app.use(Static(path.join(__dirname,'statics')))
//配置post请求数据接收
app.use(BodyParser());
//jsonp
app.use(jsonp());

//gzip
app.use(compress({
    filter: function (content_type) {
        return true
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}));
//拦截404页面
app.use(async(ctx,next)=>{
    ctx.compress = true
    await next();
    if(ctx.status===404){
        await ctx.render('404')
    }
})

//全局属性
router.use(async(ctx,next)=>{
    var pathname=url.parse(ctx.url).pathname.substring(1);
    ctx.state={
        __HOST__:'http://'+ctx.request.header.host,
        G:{
            userinfo:ctx.session.userinfo,
            url:pathname.split('/')
        }
    }
    await next()
})

//引入路由模块routes
const index = require('./routes/index.js');
const admin = require('./routes/admin/index.js');
const api = require('./routes/api.js');

router.use('/admin',admin);
router.use('/api',api);
router.use(index);

//启动路由
app.use(router.routes());
app.use(router.allowedMethods());
//启动服务器
app.listen(3000,(err)=>console.log('http://localhost:3000'));