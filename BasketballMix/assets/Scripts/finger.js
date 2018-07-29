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
        moveDuration:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.moveAction = this.fingerMove();
        this.node.runAction(this.moveAction);
    },

    fingerMove(){
        let moveRight = cc.moveBy(this.moveDuration,cc.p(500,0)).easing(cc.easeQuadraticActionOut());
        let moveLeft = cc.moveBy(this.moveDuration,cc.p(-500,0)).easing(cc.easeQuadraticActionOut());
        return cc.repeatForever(cc.sequence(moveRight,moveLeft));
    }

    // update (dt) {},
});
