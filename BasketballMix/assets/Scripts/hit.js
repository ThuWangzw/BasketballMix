cc.Class({
    extends: cc.Component,

    properties: {
        eatstarAudio:{
            default:null,
            url:cc.AudioClip
        },
        ballinAudio:{
            default:null,
            url:cc.AudioClip
        },
        boxAudio:{
            default:null,
            url:cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    //0:线 1:篮球 2:球网 3:失败边界 4:星星(传感器)5:游戏边框
    onBeginContact: function (contact, selfCollider, otherCollider) {
        
        if((selfCollider.tag===2)&&(otherCollider.tag===1)){
            if(otherCollider.checked==false) {
                return;
            }
            otherCollider.checked=false;
            cc.audioEngine.playEffect(this.ballinAudio,false);
            otherCollider.node.destroy();
            Global.score++;
            return;
        }
        if((selfCollider.tag===3)&&(otherCollider.tag===1))
        {
            otherCollider.node._parent._components[1].loseGame();
            return;
        }
        if((selfCollider.tag===4)&&(otherCollider.tag===1)){
            cc.audioEngine.playEffect(this.eatstarAudio,false);
            Global.score += 2;
            selfCollider.node.destroy();
        }
        if((selfCollider.tag===5)&&(otherCollider.tag===1)){
            cc.audioEngine.playEffect(this.boxAudio,false);
        }
    },
    // update (dt) {},
});
