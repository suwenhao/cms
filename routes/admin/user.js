/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
const router = require('koa-router')();

router.get('/', async (ctx)=>{
    await ctx.render('admin/user/list')
})
router.get('/add', async (ctx)=>{
    await ctx.render('admin/user/add')
})
router.get('/edit', async (ctx)=>{
   ctx.body='修改列表'
})
router.get('/delete', async (ctx)=>{
   ctx.body='删除用户'
})

module.exports = router.routes()