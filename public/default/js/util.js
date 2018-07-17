/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
(function($,__HOST__){
    /**
    *  @method changeStatus  改变状态等事件
    *  @param {String} collectionName 集合的model名字
    *  @param {String} attr 要修改的属性
    *  @param {String} id 要修改的数据的_id
    *  @param {Function} cb(res) 回调函数
    * */
    var changeStatus=window.changeStatus=function(collectionName,attr,id,cb){
        $.get(__HOST__+'/admin/changeStatus',{collectionName:collectionName,attr:attr,id:id},function(res){
            cb&&cb(res)
        })
    }
    /**
    *  @method publicRemove  删除数据
    *  @param {String} collectionName 集合的model名字
    *  @param {String} id 要删除的数据的_id
    *  @param {Function} cb(res) 回调函数
    * */
    var publicRemove=window.publicRemove=function(collectionName,id,cb){
        $.get(__HOST__+'/admin/delete',{collectionName:collectionName,id:id},function(res){
            cb&&cb(res)
        })
    }
    /**
    *  @method postSubmit  post提交
    *  @param {String} url 接口url
    *  @param {Object} data 要提交的data
    *  @param {Function} cb 回调函数
    * */
    var postSubmit = window.postSubmit = function(url,data,cb){
        $.ajax({
            type:'post',
            url:url, 
            data:data,
            success:function(res){
                cb&&cb(res) 
            }
        })
    }
    /**
    *  @method postSubmit  post提交
    *  @param {String} url 接口url
    *  @param {Object} data 要提交的data
    *  @param {Function} cb 回调函数
    * */
    var getSubmit = window.getSubmit = function(url,data,cb){
        $.ajax({
            type:'get',
            url:url, 
            data:data,
            success:function(res){
                cb&&cb(res) 
            }
        })
    }
})(jQuery,__HOST__)