var isLoad = false;
var shareData = {
    title:'长安福特时光邮局',   // 分享标题
    desc: '穿越之前给未来的TA留言！',   // 分享内容                                                                                 // 分享描述
    link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxaf8e3c588abce586&redirect_uri=http%3a%2f%2f59bd.cn%2ftimePort%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',   // 分享链接
    imgUrl: 'http://yh.yuedaxue.com/ford161205/dist/css/image/friend-circle-bg.jpg', // 分享图标
    type: '',
    dataUrl: '',
    success: function (res) {
        openToast('分享成功',3000);
    },
    cancel: function (res) {

    }
};
var WXENV = new (function (ticketUrl) {
    var self = this;

    self.ticketUrl = ticketUrl;
    self.nonceStr = 'XMs9a4PLbmYfooHi';
    self.timestamp = new Date().getTime()+'';

    self.ready = false;
    self.readyHandlers = [];
    self.shareData = shareData;
    self.debug = false;
    self.jsApiList =
        [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'stopRecord',
            'onVoiceRecordEnd',
            'playVoice',
            'onVoicePlayEnd',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'hideOptionMenu',
            'showOptionMenu',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'closeWindow',
            'scanQRCode'
        ];
    self.addReadyHandler = function (callback) {
        if (self.ready) {
            callback();
        }
        else {
            self.readyHandlers.push(callback);
        }
    };

    self.updateShareData = function (data) {
        if (typeof (data) == 'undefined') {
            data = self.shareData;
        }

        if (self.ready) {
            self._updateShareData(data);
        }
        else {
            self.addReadyHandler(function () {
                self._updateShareData(data);
            });
        }
    };

    self._updateShareData = function (data) {
        //alert(JSON.stringify(data));
        wx.onMenuShareTimeline({
            title: data.desc,
            link: data.link,
            imgUrl: data.imgUrl,
            success: data.success,
            cancel: data.cancel
        });

        wx.onMenuShareAppMessage({
            title: data.title,
            desc: data.desc,
            link: data.link,
            imgUrl: data.imgUrl,
            type: data.type,
            dataUrl: data.dataUrl,
            success: data.success,
            cancel: data.cancel
        });

        wx.onMenuShareQQ({
            title: data.title,
            desc: data.desc,
            link: data.link,
            imgUrl: data.imgUrl,
            success: data.success,
            cancel: data.cancel
        });

        wx.onMenuShareWeibo({
            title: data.title,
            desc: data.desc,
            link: data.link,
            imgUrl: data.imgUrl,
            success: data.success,
            cancel: data.cancel
        });

        if (!isLoad) {
            isLoad = true;
            console.log("loading");
        }
    };
    var js = document.getElementsByTagName('script')[0];
    self.onEnvReady = function () {
        var url = self.ticketUrl+'?noncestr='+self.nonceStr+'&timestamp='+self.timestamp+'&requrl='+encodeURIComponent(window.location.href);
        //alert(url);
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            timeout: 10000,
            success: function(data){
                var config = {
                    debug: self.debug,
                    appId: data.appId,
                    timestamp: self.timestamp,
                    nonceStr: self.nonceStr,
                    signature: data.sign,
                    jsApiList: self.jsApiList
                };
                //console.log('config>>>>',config);
                //alert('config>>>>'+JSON.stringify(config));
                wx.config(config);
            },
            error: function(xhr, type){
                //alert('获取coonfig失败');
            }
        })
    };
    var wxjs = document.createElement('script');
    wxjs.addEventListener('load', function () {
        wx.ready(function () {
            //alert('ready is ok');
            self.ready = true;
            self.updateShareData();
            wx.hideMenuItems({
                menuList: ['menuItem:profile', 'menuItem:addContact']
            });
            for (var i = 0; i < self.readyHandlers.length; i++) {
                self.readyHandlers[i]();
            }
            self.readyHandlers = [];
        });
        self.onEnvReady();
    });
    wxjs.src = 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js';
    js.parentNode.insertBefore(wxjs, js.nextSibling);
})('/wxjs/getSign');