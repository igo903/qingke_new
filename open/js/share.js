function onBridgeReady() {
        var mainTitle="腾讯移动互联网设计中心",
            mainDesc="专注移动互联网用户体验，招聘用研、交互、视觉、重构。",
            mainURL="http://mxd.tencent.com/hr/index.html",
            mainImgUrl= "http://3gimg.qq.com/mig-web/2014/141114-hr/img/141119-MIG.png";

        //转发朋友圈
        WeixinJSBridge.on("menu:share:timeline", function(e) {
            var data = {
                img_url:mainImgUrl,
                img_width: "120",
                img_height: "120",
                link: mainURL,
                //desc这个属性要加上，虽然不会显示，但是不加暂时会导致无法转发至朋友圈，
                desc: mainDesc,
                title: mainTitle
            };
            WeixinJSBridge.invoke("shareTimeline", data, function(res) {
                WeixinJSBridge.log(res.err_msg)
            });
        });
        //同步到微博
        WeixinJSBridge.on("menu:share:weibo", function() {
            WeixinJSBridge.invoke("shareWeibo", {
                "content": mainDesc,
                "url": mainURL
            }, function(res) {
                WeixinJSBridge.log(res.err_msg);
            });
        });
        //分享给朋友
        WeixinJSBridge.on('menu:share:appmessage', function(argv) {
            WeixinJSBridge.invoke("sendAppMessage", {
                img_url: mainImgUrl,
                img_width: "120",
                img_height: "120",
                link: mainURL,
                desc: mainDesc,
                title: mainTitle
            }, function(res) {
                WeixinJSBridge.log(res.err_msg)
            });
        });
    };
    //执行
    document.addEventListener('WeixinJSBridgeReady', function() {
        onBridgeReady();
    });