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

    },

    // LIFE-CYCLE CALLBACKS:
    start () {

    },
    clickStartButton:function(){
        cc.director.loadScene('game');
    },
    clickRestartButton:function(){
        cc.director.loadScene('game');
    },
    clickBacktomenuButton:function(){
        cc.director.loadScene('main');
    },
    clickRankviewButton:function(){
        cc.director.loadScene('rankview');
    }
    // update (dt) {},
});
