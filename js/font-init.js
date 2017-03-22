function initFont(){
    var winW = window.screen.availWidth;
    var winH = window.screen.availHeight;
    var W;
    if(winW > winH){
        W = Math.floor(winH*9/16);
        window.onload = function(){
            document.body.style.cssText = 'width:'+W+'px;margin:0 auto';
        }
    }else{
        W = winW;

    }
    document.getElementsByTagName('html')[0].style.fontSize = Math.floor((W*32/1080))+'px';
}
initFont();
window.onresize = function(){initFont();}
