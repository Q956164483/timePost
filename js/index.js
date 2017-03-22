
;(function(){
    //setCookie('localId','',0);
    //setCookie('serverId','',0);
    var url_userid = getQueryString('state'),
        url_name = '',
        url_head = '',
        url_voice = '',
        ua = navigator.userAgent.toLowerCase(),
        winW = window.screen.availWidth,
        AudioOther = document.getElementsByTagName('audio')[0],
        headImg = '',
        nickname = '',
        openid = '',
        localId = getCookie('localId'),
        serverId = getCookie('serverId'),
        //微信是否正在播放声音
        isplaying = false,
        showMsgTot = 5;
    if(url_userid != 'STATE'||url_userid!= null){
        $.ajax({
            type: 'GET',
            url: '/wxjs/userGet?user_id='+url_userid,
            dataType: 'json',
            timeout: 10000,
            success: function(j){
                if(j.user){
                    var data = j.user;
                    if(data.voices){
                        url_head = data.avatars;
                        url_name = data.user_name;
                        $('.my-nickname').html(url_name);
                        $('.my-message-head').css('background-image','url('+url_head+')');
                        var voices = data.voices;
                        setTimeout(function(){
                            wx.downloadVoice({
                                serverId: voices, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
                                isShowProgressTips: 1, // 默认为1，显示进度提示
                                success: function (res) {
                                    //alert(JSON.stringify(res));
                                    url_voice = res.localId;
                                    showMsgTot = 6;
                                }
                            });
                        },3000);
                    }
                }
            },
            error: function(xhr, type){
                openToast('获取音频失败',3000);
            }
        })
    }
    if(ua.match(/MicroMessenger/i) == "micromessenger") {
        document.addEventListener("WeixinJSBridgeReady", function () {
            loadAll();
        }, false);
        getUserInfo();
    } else {
        loadAll();
    };


    function uploadVoice($localId){
        wx.uploadVoice({
            localId: $localId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                serverId = res.serverId; // 返回音频的服务器端ID
                localId = $localId;
                setCookie('localId',localId,3);
                setCookie('serverId',serverId,3);
                $.ajax({
                    type: 'GET',
                    url: '/wxjs/userSet',
                    data:{
                        "user_id":openid,
                        "voices":serverId,
                        "avatars":headImg,
                        "user_name":nickname
                    },
                    dataType: 'json',
                    timeout: 10000,
                    success: function(data){
                        //alert('用户信息>>'+JSON.stringify(data));
                        openToast('上传成功',3000);
                        updateShareLink();
                        $('.share').removeClass('hide');
                        $('.share').off('touchend').on('touchend', function () {
                            $(this).addClass('hide');
                        })
                    },
                    error: function(xhr, type){
                        openToast('保存到服务器失败',3000);
                    }
                })
            }
        });
    }

    function updateShareLink(){
        if(openid){
            var state = openid;//encodeURIComponent(headImg+'STATE'+serverId);
            shareData.link = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxaf8e3c588abce586&redirect_uri=http%3a%2f%2f59bd.cn%2ftimePort%2findex.html&response_type=code&scope=snsapi_userinfo&state='+state+'#wechat_redirect',   // 分享链接
                WXENV._updateShareData(shareData);
        }
    }

    function initSlider(){
        var $slider = $('#slider');
        var $section = $('.section');
        var height = $('body').height();
        $section.css({
            height:height+'px'
        })
        function moveTo(index){
            $section.removeClass('active');
            var transHeight = height*(index-1);
            $slider.css({
                '-webkit-transform':'translateY(-'+transHeight+'px)',
                'transform':'translateY(-'+transHeight+'px)',
            })
            $section.eq(index-1).addClass('active');
        }
        $slider.removeClass('hide');
        $section.on('touchmove',function(e){
            e.preventDefault();
        })
        setTimeout(function(){
            $section.eq(0).addClass('active').on('swipeUp',function(){
                moveTo(2);
            })
        },100);
        //前往未来
        $('.btn1-1').on('touchend',function(){
            moveTo(3);
        })
        //分享遮罩点击
        $('.show-mask').on('touchend',function(){
            var ele = $(this).attr('data-class');
            $(ele).addClass('mask-show');
        })
        $('.mask').on('touchend',function(){
            $(this).removeClass('mask-show');
        })
        $('.section3 .btn-play').on('touchend',function(){
            $('.leaveMsg').parent().addClass('hide');
            if(!isplaying){
                $('.tools1').removeClass('act');
                $('.music-player').trigger('touchend');
            }else{
                openToast('播放中。。。',2000);
            }
            //moveTo(4);
        })

        $('#leaveMsg').on('touchend',function(){
            $('.leaveMsg').parent().removeClass('hide');
            $('.tools1').removeClass('act');
            moveTo(4);
            $('.tools1').addClass('paused');
            $('.tools2').addClass('paused')
            $('.music-player').html('播放');
            isplaying = false;
            AudioOther.pause();
        })

        $section.eq(4).on('swipeDown',function(){
            moveTo(4);
        })
        $('.back-index').on('touchend',function(){
            if(!isplaying){
                moveTo(3);
            }else{
                openToast('播放中,请稍等',2000);
            }
        })
        var startTime = 0;

        $('.leaveMsg').on('touchstart',function () {
            event.preventDefault();
            // if(localId){
            //     openToast('您已经留过言',3000);
            // }else{
                if(new Date().getTime() - startTime < 2000){
                    openToast('留言频率过高。。。',3000);
                }else{
                    openToast('录音中。。。');
                    startTime = new Date().getTime();
                    wx.onVoiceRecordEnd({
                        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                        complete: function (res) {
                            uploadVoice(res.localId);
                        }
                    });
                    wx.startRecord();
                }
            //}
        })
        var showMsgIndex = 0;

        $('.pre').on('touchend',function(){
            if(showMsgIndex>0) showMsgIndex--;
            $('.section3 .container .item').eq(0).css({
                'margin-top':-6*showMsgIndex+'rem'
            });
        })
        $('.next').on('touchend',function(){
            if(showMsgIndex<(showMsgTot-1)) showMsgIndex++;
            $('.section3 .container .item').eq(0).css({
                'margin-top':-6*showMsgIndex+'rem'
            });
        })
        $('.leaveMsg').on('touchend',function () {
            closeToast();
            var timeCut = new Date().getTime() - startTime;
            if(timeCut<2000){
                openToast('留言时间过短。。。',2000);
                if(!localId){
                    setTimeout(function(){
                        wx.stopRecord({
                            success: function (res) {
                            }
                        });
                    },1200)
                }else{

                }
            }else{
                //if(!localId) {
                    wx.stopRecord({
                        success: function (res) {
                            uploadVoice(res.localId);
                        }
                    });
                // }
                // $('.share').removeClass('hide');
                // $('.share').off('touchend').on('touchend', function () {
                //     $(this).addClass('hide');
                // })
            }
        })
        //播放器
        $('.music-player').on('touchend',function(){
            var $tools1 = $('.tools1');
            //var audio = AudioOther;
            if(showMsgIndex!=5){
                AudioOther = document.getElementsByTagName('audio')[showMsgIndex];
                AudioOther.addEventListener("ended", function(){
                    isplaying = false;
                    $('.tools1').addClass('paused');
                    $('.tools2').addClass('paused');
                    $('.music-player').html('播放');
                })
            }
            if($('.leaveMsg').parent().hasClass('hide')){ //如果是播放别人的声音
                $('.tools2').toggleClass('paused');
                if(!$tools1.hasClass('act')){
                    $tools1.addClass('act paused');
                }
                if($tools1.hasClass('paused')){
                    $tools1.removeClass('paused');
                    if(url_voice&&showMsgIndex==5){
                        playLocalVoice(url_voice);
                    }else{
                        $('.music-player').html('暂停');
                        AudioOther.play();
                        isplaying = true;
                    }
                }else{
                    $tools1.addClass('paused');
                    $('.music-player').html('播放');
                    isplaying = false;
                    AudioOther.pause();
                }
            }else{ //如果播放自己的录音
                if(!localId){
                    openToast('请先留言',2000);
                }else{
                    playLocalVoice(localId);
                }
            }
        })
    }
    function playLocalVoice(localId){
        if(!isplaying){
            isplaying = true;
            $('.music-player').html('播放中...');
            $('.tools2').removeClass('paused');
            $('.tools1').removeClass('paused').addClass('act');
            wx.onVoicePlayEnd({
                success: function (res) {
                    $('.tools1').addClass('paused');
                    $('.tools2').addClass('paused');
                    $('.music-player').html('播放');
                    isplaying = false;
                }
            });
            wx.playVoice({
                localId: localId
            });
        }
    }
    //预加载图片
    function loadAll(){
        var roundRadius = Math.floor(winW/8);
        var resourceObj = [
            'bg1.jpg',
            'bg2.jpg',
            'bg3.jpg',
            'bg4.jpg',
            'bg5.jpg',
            'share.png',
            'rule.jpg',
            'coupon.jpg'
        ];
        loadResource(resourceObj,function(percent){
            $('#loading').waterbubble({
                txt: percent+'%',
                data: percent/100,
                lineWidth: 2,
                radius: roundRadius
            })
            if(percent == 100){
                setTimeout(function(){
                    $('#loading').remove();
                    initSlider();
                },800);
            }
        });
    }

    function getUserInfo(){
        var code = getQueryString('code');
        $.ajax({
            type: 'GET',
            url: '/wxjs/codeToToken?code='+code,
            dataType: 'json',
            timeout: 10000,
            success: function(data){
                //alert('用户信息>>'+JSON.stringify(data));
                headImg = data.headimgurl;
                nickname = data.nickname;
                openid = data.openid;
                if(serverId){
                    updateShareLink();
                }
            },
            error: function(xhr, type){
                //alert('获取用户信息失败');
            }
        })
    }
})();