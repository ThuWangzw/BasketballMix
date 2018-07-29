// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        score:{
            default:null,
            type:cc.Sprite,
        },
    },

    onLoad () {
        this.tex = new cc.Texture2D();
        window.sharedCanvas.width = 720;
        window.sharedCanvas.height = 1280;
        console.log("发送个人信息请求")
        if (CC_WECHATGAME) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "x1",
                score:Global.score
            });
        } else {
            cc.log("发送个人数据。x1");
        }
        console.log("发送个人信息请求成功")
        Global.score=0;
    },


    _updateSubDomainCanvas() {
        if (window.sharedCanvas !== undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.score.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },

    update:function (dt) {
        this._updateSubDomainCanvas();
    },
});
