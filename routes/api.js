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
   ctx.body='api'
})
router.get('/4', async (ctx)=>{
    ctx.body='api'
 })

module.exports = router.routes()