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
        timer:0,
        minduration:0,
        maxduration:0,
        duration:0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.duration=this.minduration+cc.random0To1()*(this.maxduration-this.minduration);
    },

    start () {

    },

    update (dt) {
        let opacityRatio=1-this.timer/this.duration;
        let minopacity=50;
        this.node.opacity=minopacity+Math.floor(opacityRatio*(255-minopacity));
        this.timer+=dt;
    },
});
