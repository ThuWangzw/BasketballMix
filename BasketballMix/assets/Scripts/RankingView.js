cc.Class({
    extends: cc.Component,
    name: "RankingView",
    properties: {
        rankingScrollView:{   //显示排行榜
            default:null,
            type:cc.Sprite,
        }
    },


    start() {
        if (CC_WECHATGAME) {
            window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 720;
            window.sharedCanvas.height = 1280;
            console.log("发送初始列表请求")
            this.getFriendRank();
            console.log("发送初始列表请求成功")
        }
        cc.director.preloadScene("main");
    },


    summitScore:function(score){
        console.log("最高分为:" + score);
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 2,
                MAIN_MENU_NUM: "x1",
                score: score,
            });
        } else {
            cc.log("提交得分: x1 : " + score)
        }
    },


    getFriendRank:function() {
        if (CC_WECHATGAME) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "x1"
            });
        } else {
            cc.log("获取好友排行榜数据。x1");
        }
    },


    backToMenu:function(){
        cc.director.loadScene("main");
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },


    update() {
        this._updateSubDomainCanvas();
    },
});