/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
const router = require('koa-router')();
const util = require('../../model/util.js');
const Manage = require('../../model/Manage.js')
const svgCaptcha = require('svg-captcha');

router.get('/', async (ctx)=>{
   await ctx.render('admin/login')
})
router.get('/code', async (ctx)=>{
    var captcha = svgCaptcha.create({
        size:4,
        fontSize:50,
        width:100,
        height:34
    });
    //存储验证码
    ctx.session.captcha = captcha.text.toLowerCase();
    //返回格式为svg
    ctx.response.type='image/svg+xml';
    //返回验证码
    ctx.body=captcha.data;
});
router.post('/dologin', async (ctx,next)=>{
    //获取session的验证码
    let sessionCaptcha=ctx.session.captcha;
    //获取post过来的数据
    let {username,password,code} = ctx.request.body;
    //转小写
    code=code.toLowerCase()
    //比较验证码
    if(code!==sessionCaptcha){
        ctx.body={code:2,msg:'验证码出错'}
    }else{
        //比较用户名和密码
        var result=await Manage.findOne({username,password:util.md5Pwd(password)});
        if(result){
            await Manage.update({'_id':result._id},{'login_time':new Date().getTime()})
            ctx.session.userinfo=result
            ctx.body={code:0,msg:'登录成功'}
        }else{
            ctx.body={code:1,msg:'账号或密码出错'}
        }
    }
 })
 router.get('/logout', async (ctx,next)=>{
    ctx.session.userinfo=null;
    ctx.redirect('/admin/login')
 })



module.exports = router.routes()