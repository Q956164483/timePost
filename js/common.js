/**
 * 链接后面的参数
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
/**
 *加载页面资源,图片,音频
 */
function loadResource(urlObj,callback){
    var call = callback;
    var len = urlObj.length,Aresource = [],hasLoadNum = 0;
    for(var i = 0; i < len; i++){
        var type = urlObj[i].split('.')[1];
        if(type == 'mp3'||type == 'wav'){
            Aresource[i] = new Audio();
            Aresource[i].src = 'music/' + urlObj[i];
            Aresource[i].load();
            saveResourse(i,'audio');
        }else{
            Aresource[i] = new Image();
            Aresource[i].src = 'css/image/'+urlObj[i];
            saveResourse(i,'img');
        }
    }
    function saveResourse(index,type){
        if(type == 'img'){
            Aresource[index].onload = function(){
                hasLoadNum ++ ;
                var percent = Math.floor(hasLoadNum/len*100);
                //console.log(percent)
                call(percent);
            }
        }else{
            Aresource[index].onloadeddata = function(){
                hasLoadNum ++ ;
                var percent = Math.floor(hasLoadNum/len*100);
                call(percent);
            }
        }
    }
}
//设置cookie
function setCookie(c_name,value,expiredays){
    var exdate=new Date()
    exdate.setDate(exdate.getDate()+expiredays)
    document.cookie=c_name+ "=" +escape(value)+
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}
//取回cookie
function getCookie(c_name){
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1
            c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            return unescape(document.cookie.substring(c_start,c_end))
        }
    }
    return ""
}
//打开toast
function openToast(msg,time){
    $('.toast').html(msg).removeClass('hide');
    if(time){
        setTimeout(function(){
            closeToast();
        },time)
    }
}
function closeToast(){
    $('.toast').addClass('hide');
}