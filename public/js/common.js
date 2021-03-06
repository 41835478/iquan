/**
 *
 */
var Util = Util || {};

Util.pageSize = function() {
    var a = document.documentElement;
    var b = ["clientWidth", "clientHeight", "scrollWidth", "scrollHeight"];
    var c = {};
    for (var d in b) c[b[d]] = a[b[d]];
    c.scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
    c.scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    return c;
};

Util.lazyLoad = function(cn){
    var lazyImg = $('.'+cn);

    lazyImg.each(function(){
        var _this = $(this);
        var url = _this.attr('data-original');

        $('<img />').one('load',function(){
            if(_this.is('img')){
                _this.attr('src',url);
            }else{
                _this.css('background-image','url('+url+')');
            }
            setTimeout(function(){
                _this.css('opacity','1');
            },15);
        }).one('error',function(){
            _this.css('opacity','1');
        }).attr('src',url);
    });
}

Util.getQueryString = function(url){
    var res = {};
    url = url.split('?');
    if(url.length > 1){
        url = url[1];
        url = url.split('&');
        for(var i=0,len=url.length;i<len;i++){
            var kv = url[i].split('=');
            if(kv.length > 1){
                res[''+kv[0]] = kv[1];
            }
        }
    }
    return res;
}

Util.timeCount = function(obj,endDesc,type){
    obj = $(obj);
    var endTime = obj.data('endtime');
    var now = Math.floor(new Date().getTime()/1000)*1;
    if(now > endTime){
        obj.html(endDesc);
    }else{
        var gap = endTime - now;
        var dd = Math.floor(gap/(60*60*24));
        var hh = Math.floor((gap-dd*60*60*24)/(60*60));
        var mm = Math.floor((gap-dd*60*60*24-hh*60*60)/60);
        var ss = gap-dd*60*60*24-hh*60*60-mm*60;
        var timeStr = '还剩&nbsp;'
            +(dd>0?'<em>'+dd+'</em>天':'')
            +(hh>0?'<em>'+hh+'</em>时':'')
            +(mm>0?'<em>'+mm+'</em>分':'')
            +(ss>=0?'<em>'+ss+'</em>秒':'')
            +'&nbsp;结束';
        if(type && type == 2 && dd <= 0){
            timeStr = '<span style="color:#FF2220;font-weight: bold;">即将失效：&nbsp;'
                +(dd>0?'<em>'+dd+'</em>天':'')
                +(hh>0?'<em>'+hh+'</em>时':'')
                +(mm>0?'<em>'+mm+'</em>分':'')
                +(ss>=0?'<em>'+ss+'</em>秒':'')
                +'</span>';
        }
        obj.html(timeStr);
    }
}

Util.sideGenderSwitch = function(){
    var currentGender = $.cookie('gender');

    var switcher = '<div class="side-gender-switch">';
    switcher += '<div class="show-switch"></div>';
    switcher += '<div class="main">';
    switcher += '<div class="gender-area">';
    switcher += '<div data-gender="0" class="gender female'+(currentGender == 1?'':' active')+'">';
    switcher += '<div class="pic">';
    switcher += '<div class="mask"><i></i></div>';
    switcher += '</div>';
    switcher += '<p>女生</p>';
    switcher += '</div>';
    switcher += '<div data-gender="1" class="gender male'+(currentGender == 1?' active':'')+'">';
    switcher += '<div class="pic">';
    switcher += '<div class="mask"><i></i></div>';
    switcher += '</div>';
    switcher += '<p>男生</p>';
    switcher += '</div>';
    switcher += '</div>';
    switcher += '<div class="qrcode-area">';
    switcher += '<div class="qrcode"></div>';
    switcher += '<p>扫一扫领取<br>更多专属一折券</p>';
    switcher += '</div>';
    switcher += '<img style="display: none;" src="http://7xlxny.com1.z0.glb.clouddn.com/zhekou/web/gender_switch_expand.png"/>'
    switcher += '</div>';

    switcher = $(switcher);
    switcher.find('.show-switch').on('click',function(){
        switcher.toggleClass('active');
    });

    var queries = Util.getQueryString(window.location.href);
    switcher.find('.gender').on('click',function(){
        var _this = $(this);
        if(!_this.hasClass('active')){
            var gender = _this.data('gender');
            ga('send','event','gender_switch','click','gender_switch_to_'+($.cookie('gender')=='1'?'female':'male'));
            $.cookie('gender',''+gender,{path:'/'});
            window.location.href = '/'+(queries.channel?'?channel='+queries.channel:'');
        }
    });

    $('body').append(switcher);
}

Util.scrollToTop = function(duration){
    var body = $('body,html');
    if(duration < 20){
        body.scrollTop(0);
    }else{
        body.stop(true,true).animate({
            scrollTop:0
        },duration);
    }
}

Util.sideFixedMenu = function(container,st){
    if(!container){
        return;
    }
    if(!st){
        st = 2000;
    }
    var doc = $(document),body = $('body');
    var w = container.width();
    var menuL = Math.floor(w/2)+25;

    var htmlStr = '';
    htmlStr += '<div class="side-fixed-menu" style="margin-left: '+menuL+'px;">';

    htmlStr += '<div class="menu-item" id="backToTop" style="display: none;">';
    htmlStr += '<i class="back-to-top"></i>';
    htmlStr += '<p>返回顶部</p>';
    htmlStr += '</div>';

    htmlStr += '<a href="/9kuai9/"><div class="menu-item" id="toHis">';
    htmlStr += '<i class="history"></i>';
    htmlStr += '<p>十元包邮</p>';
    htmlStr += '</div></a>';

    htmlStr += '</div>';
    var sideMenu = $(htmlStr);
    sideMenu.find('#backToTop').on('click',function(){
        Util.scrollToTop(100);
    });
    sideMenu.appendTo($('body'));
    $(window).on('scroll',function(){
        var scrollTop = doc.scrollTop();
        if(scrollTop > st){
            sideMenu.find('#backToTop').fadeIn(100);
        }else{
            sideMenu.find('#backToTop').fadeOut(100);
        }
    });
}

Util.zkItemTimeCount = function(type){
    var timeCountInter = null;
    $('.zk-item').unbind('mouseenter').unbind('mouseleave');
    $('.zk-item').on('mouseenter',function(){
        clearInterval(timeCountInter);
        timeCountInter = null;

        var tc = $(this).find('.time-count');
        Util.timeCount(tc,'优惠券已过期',type);
        timeCountInter = setInterval(function(){
            Util.timeCount(tc,'优惠券已过期',type);
        },1000);
    }).on('mouseleave',function(){
        clearInterval(timeCountInter);
        timeCountInter = null;
    });
}

Util.createCouponList = function(cl,obj,channel,gaPage){
    gaPage = gaPage || '未知';
    var htmlstr = '<div>';
    for(var i=0,len=cl.length;i<len;i++){
        var z = cl[i];
        var re = /activityId=(\w*)/;
        var buy_url = '/buy/' + z.item_id + '/?activity_id=';
        buy_url += re.exec(z.url)[1];
        var platform = '',platformPic = '';
        switch (z.platform_id*1){
            case 1:
                platform = 1;
                break;
            case 2:
                platform = 2;
                break;
            default:
                break;
        }
        htmlstr += '<div class="zk-item">';
        htmlstr += '<a target="_blank" href="/youhui/'+ z.coupon_id +'/'+(channel && channel!=27?'?channel='+channel:'')+'">';
        htmlstr += '<div class="img-area">';
        htmlstr += '<div class="bottom-info">';
        htmlstr += '<p data-endtime="'+ z.dateline +'" class="time-count"></p>';
        htmlstr += '</div>';
        htmlstr += '<img data-ga-event="商品_图片:点击:'+ gaPage +'" class="lazy new" data-original="'+ z.thumbnail_pic +'" alt="'+z.title +'">';
        htmlstr += '</div>';
        htmlstr += '<p class="title-area elli">';
        if(platform == 1){
            htmlstr += '<i class="i_taobao"></i>';
        }
        else{
            htmlstr += '<i class="i_tmall"></i>';
        }
        if(z.post_free==1){
            htmlstr += '<span class="post-free">包邮</span>';
        }
        htmlstr +=  z.title +'</p>';
        htmlstr += '<div class="raw-price-area">现价：&yen;'+ z.raw_price +'<p class="sold">'+ z.subtitle +'</p></div>';
        htmlstr += '<div class="info">';
        htmlstr += '<div class="price-area">';
        if(z.coupon_price == null)
          z.coupon_price = z.raw_price - z.zk_price;
        htmlstr += '<span class="price">&yen;<em class="number-font">'+ z.coupon_price.toString().split('.')[0] +'</em>';
        htmlstr += '<em class="decimal">'+(z.coupon_price.toString().split('.').length>1?'.'+z.coupon_price.toString().split('.')[1]:'')+'</em><i></i></span>';
        htmlstr += '</div>';
        htmlstr += '<span class="coupon_click">券 ';
        htmlstr += z.gap_price;
        htmlstr += ' 元</span>';
        htmlstr += '</div>';
        htmlstr += '</a>';
        htmlstr += '</div>';
    }
    htmlstr += '</div>';
    htmlstr = $(htmlstr);
    htmlstr.find('[data-ga-event]').on('click',function(){
        var _this = $(this);
        var gaEvent = _this.attr('data-ga-event');
        var gaParmas = gaEvent.split(':');
        if(typeof ga != 'undefined' && gaParmas.length >= 3){
            ga('send','event',gaParmas[0],gaParmas[1],gaParmas[2]);
        }
    });

    obj.append(htmlstr);
    Util.lazyLoad('lazy.new');
    $('.lazy.new').removeClass('new');
    Util.zkItemTimeCount();
}

Util.getK9CouponList = function(couponList,loadingText,channel,type,gaPage){
    var page = 1,pagesize = 20,load = 1;

    $(document).on('scroll',function(){
        if(page%4 > 0){
            var _top = $(document).scrollTop(),
                scroll_height = Util.pageSize()['scrollHeight'],
                client_height = Util.pageSize()['clientHeight'];
            if(_top + client_height >= (scroll_height-800)){
                getCouponList();
            }
        }
    });

    loadingText.on('click',function(){
        getCouponList();
    });

    function getCouponList(){
        if(!load){
            return;
        }
        $.ajax({
            url:'/getK9CouponList',
            type:'GET',
            dataType:'json',
            data:{
                'type':type,
                'channel':channel,
                'page':page,
                'pagesize':pagesize
            },
            beforeSend:function(){
                load = 0;
                loadingText.html('努力加载中...');
            },
            success:function(data){
                if(data.code == 1){
                    Util.createCouponList(data.data,couponList,channel,gaPage);
                    if(data.data.length >= pagesize){
                        page ++;
                        load = 1;
                        loadingText.html('查看更多优惠券');
                    }else{
                        loadingText.html('没有更多了');
                    }
                }
            }
        });
    }
}

Util.getBottomOperElements = function(obj){
    $.ajax({
        url:'/getOperElements',
        type:'GET',
        dataType:'json',
        data:{},
        beforeSend:function(){},
        success:function(data){
            if(data.code == 1){
                createBottomOperElementsHtml(data.data.footer_element);
            }
        }
    });

    var queries = Util.getQueryString(window.location.href);

    function createBottomOperElementsHtml(oes){
        var htmlstr = '<div class="footer-element-area">';
        for(var i=0,len=oes.length;i<len;i++){
            var u = oes[i].extend;
            if(queries.channel && !u.match(/channel=/)){
                if(u.match(/\?/)){
                    u += '&channel='+queries.channel;
                }else{
                    u += '?channel='+queries.channel;
                }
            }
            htmlstr += '<div data-i="'+(i+1)+'" class="footer-element-item">';
            htmlstr += '<a target="_blank" href="'+u+'"><img src="'+oes[i].pic+'"></a>';
            htmlstr += '</div>';
        }
        htmlstr += '</div>';
        htmlstr = $(htmlstr);
        htmlstr.find('.footer-element-item').on('click',function(){
            ga('send','event','底部运营位','点击','底部运营位_'+$(this).data('i'));
        });
        obj.after(htmlstr);
    }
}

$(function(){
    Util.lazyLoad('lazy');
    Util.zkItemTimeCount();
    var toTop = function(){
      Util.scrollToTop(100);
    }
    $('#backToTop').click(toTop);
    $(window).on('scroll',function(){
        var scrollTop = document.body.scrollTop;
        if(scrollTop > 1500){
            $('#backToTop').fadeIn(100);
        }else{
            $('#backToTop').fadeOut(100);
        }
    });
});
