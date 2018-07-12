const utils = require('utility');//md5加密
const multer = require('koa-multer')
const fs = require('fs')

/**
 * @method md5Pwd  md5加密
 * @param {String} pwd 要加密的密码
 * @return 返回加密后的密码
 */
exports.md5Pwd=(pwd)=>{
    const salt = 'cms_web19941003!@#SUWenHao~~';
    return utils.md5(utils.md5(pwd+salt))
}
/**
 * 
 * @method cateToList 组合树结构分类
 * @param {Array} data 分类数组
 * @return 返回树结构分类数组
 */
exports.cateToList=(data)=>{

    var temp_parent={"_id":'0',"list":[]};//新建id为null的对象做为森林的根
    var result=[];
    var allMenu = data;
    result.push(temp_parent);

    var output = getAllChild(result);
    //返回系列化后的分类数组
    if(output.length==0){
        return []
    }else {
        return output;
    }

    //find some item all child   //方便阅读依然放上此方法
    function findItemChild(item){
        var arrayList=[];
        for(var i in allMenu){
            if(allMenu[i].pid == item._id){
                arrayList.push(allMenu[i]);
            }
        }
        return arrayList;
    }
    //get all child          //方便阅读依然放上此方法
    function getAllChild(array){
        var childList=findItemChild(array[0]);
        if(childList == null){
            return [];
        }else{
            for(var j in childList){
                childList[j].id=childList[j]._id
                childList[j].list=[];
                childList[j].list=getAllChild([childList[j]]);
            }
            array[0].list=childList;
        }
        return childList;
    }
}
function mkdir(){
    let root='statics/uploads/';
    let date = new Date();  
    let Year = date.getFullYear()+'';   //获取完整的年份
    let Month = date.getMonth()+1+'';      //获取当前月份
    let Day = date.getDate()+'';       //获取当前日
    let year=fs.existsSync(root+Year+'/');
    let month=fs.existsSync(root+Year+'/'+Month+'/');
    let day=fs.existsSync(root+Year+'/'+Month+'/'+Day+'/');
    if(!year){
        fs.mkdirSync(root+Year+'/')
    }
    if(!month){
        fs.mkdirSync(root+Year+'/'+Month+'/')
    }
    if(!day){
        fs.mkdirSync(root+Year+'/'+Month+'/'+Day+'/')
    }
    return root+Year+'/'+Month+'/'+Day+'/';
}
exports.upload=()=>{
    
    let storage = multer.diskStorage({
        //文件保存路径
        destination: function (req, file, cb) {
            let path = mkdir()
            cb(null, path) //注意路径必须存在
        },
        //修改文件名称
        filename: function (req, file, cb) {
            //获取后缀名
            var fileFormat = (file.originalname).split(".");
            cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
        }
    })
    return multer({ storage: storage })
}