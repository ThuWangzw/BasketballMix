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
        linePrefab: {
            default: null,
            type: cc.Prefab
        },
        rigidPrefab:{
            default: null,
            type: cc.Prefab
        },
        ballPrefab:{
            default:null,
            type:cc.Prefab
        },
        netPrefab:{
            default:null,
            type:cc.Prefab,
        },
        penPrefab:{
            default:null,
            type:cc.Prefab,
        },
        starPrefab:{
            default:null,
            type:cc.Prefab,
        },
        framebox:{
            default:null,
            type:cc.Node,
        },
        scoreLabel:{
            default:null,
            type:cc.Node,
        },
        failAudio:{
            default:null,
            url:cc.AudioClip,
        },
        barrierPrefab:{
            default:null,
            type:cc.Prefab  
          },
        linenum:0,
        nowline:null,
        nowrigid:null,
        line:[],
        rigid:[],
        ball:[],
        net:[],
        levelNum:0,
        netnum:0,
        ballnum:0,
        loseTimer:null,
        lose:0,
        pen:[],
        pennum:0,
        starnum:0,
        star:[],
        gamestart:0,
        barriernum:0,
        barrier:[]
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        if (CC_WECHATGAME) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 4,
                MAIN_MENU_NUM: "x1",
            });
        } else {
            cc.log("获取个人数据。x1");
        }
        this.initBox();
        //this.setTouchCtrl();
        cc.director.getPhysicsManager().enabled = true;
        //cc.director.getPhysicsManager().debugDrawFlags =cc.PhysicsManager.DrawBits.e_jointBit | cc.PhysicsManager.DrawBits.e_shapeBit;
        
        this.loseGame=once(this.loseGame);
		this.successGame=once(this.successGame);
        let size = cc.view.getFrameSize();
        this.isIphoneX = (size.width == 375 && size.height == 812) ||(size.width == 375 && size.height == 812);
		this.newLevel();
    },
	initLabel:function(){
        if(this.isIphoneX){
            let pos = this.scoreLabel.getPosition();
            pos.y=270;
            this.scoreLabel.setPosition(pos);
        }
    },
    initBox:function(){
        //console.log(this.framebox);
        let framesize = cc.view.getVisibleSize();
        let points=[]
        points.push(this.node.convertToNodeSpaceAR(new cc.Vec2(0,0)));
        points.push(this.node.convertToNodeSpaceAR(new cc.Vec2(0,1500)));
        points.push(this.node.convertToNodeSpaceAR(new cc.Vec2(framesize.width,1500)));
        points.push(this.node.convertToNodeSpaceAR(new cc.Vec2(framesize.width,0)));
        this.framebox._components[1].points=points;
        this.framebox._components[1].apply();
    },
    initBarrier:function(){
        let newbarrier=cc.instantiate(this.barrierPrefab);
        let cx=cc.randomMinus1To1()*50;
        let cy=cc.random0To1()*150;
        this.node.addChild(newbarrier);
        this.barrier.push(newbarrier);
        newbarrier.setPosition(new cc.Vec2(cx,cy));
        this.barriernum++;
    },
    initPen:function(){
        this.pennum=3;
        var penx=[-50,0,50];
        for(let i=0;i<3;i++){
            let newpen=cc.instantiate(this.penPrefab);
            this.node.addChild(newpen);
            this.pen.push(newpen);
            newpen.setPosition(new cc.Vec2(penx[i],240));
			if(this.isIphoneX) newpen.setPosition(new cc.Vec2(penx[i],220));
        }
    },
    initStar:function(pos){
         let newstar=cc.instantiate(this.starPrefab);
         this.starnum++;
         this.star.push(newstar);
         this.node.addChild(newstar);
         let starx=((parseInt(cc.random0To1()*3))-1)*20+pos.x;
         let stary=(parseInt(cc.random0To1()*3))*50+pos.y+45;
         newstar.setPosition(new cc.Vec2(starx,stary));
    },
    initLine:function(){
        this.nowline=cc.instantiate(this.linePrefab);
        this.node.addChild(this.nowline);
        this.line.push(this.nowline);
        this.nowrigid=cc.instantiate(this.rigidPrefab);
        this.node.addChild(this.nowrigid);
        this.rigid.push(this.nowrigid);
        this.nowrigid._components[1].points=[];
        
        this.nowline._components[0].rigirdChain=this.nowrigid;
        //this.nowrigid._components[1].points=[];

        this.linenum++;
    },
    initBall:function(){
        //确定生成的球的个数
        
        this.ballnum=parseInt(cc.rand())%2+1;
        console.log(this.ballnum);
        //    this.ballnum=1;
        var self=this;
        var genBoxes=[];
        for(let i=0;i<this.netnum;i++){
            let genBox=this.net[i]._components[2].getAABB().clone();
            let vec=new cc.Vec2(genBox.x,genBox.y);
            vec=this.node.convertToNodeSpaceAR(vec);
            genBox.x=vec.x;
            genBox.y=vec.y;
            genBoxes.push(genBox);
        }
        //生成
        console.log(this.ballnum);
        for(let i=0;i<this.ballnum;i++){
            setTimeout(function(){
                let newball=cc.instantiate(self.ballPrefab);
                newball._components[1].checked=true;
                // this.node.addChild(newball);
                // this.ball.push(newball);
                let posy=-(cc.view.getVisibleSize().height/2 + 50);
                //console.log('newball:',newball.getPosition());
                let posx=0;
                let res=null;
                while(res===null){
                        posx=cc.randomMinus1To1()*100;
                        res=self.genBallStatus(new cc.Vec2(posx,posy),genBoxes);
                        }
                    newball._components[1]._linearVelocity.y=1000;

                    newball._components[1]._linearVelocity.x=newball._components[1]._linearVelocity.y/Math.tan(res);
                    newball.setPosition(new cc.Vec2(posx,posy));
                    self.node.addChild(newball);
                    self.ball.push(newball);
                // console.log(res,newball._components[1]._linearVelocity);
                // console.log(newball.getPosition());
            },300*i);
            if(i==this.ballnum-1){
                setTimeout(() => {
                    self.gamestart=1;
                }, 300*i);
            }
        }
    },
    initNet:function(){
        this.netnum=parseInt(cc.random0To1()*Math.min(this.ballnum,2))+1;
        var lastnetx=0;
        for(let i =0;i<this.netnum;i++){
            
            let newnet=cc.instantiate(this.netPrefab);
            //生成随机坐标
            var rx=0
            var ry=0;
            while(((rx>-80)&&(rx<80))||(lastnetx*rx>0)) {
				rx=cc.randomMinus1To1()*150;
				if(this.isIphoneX){rx=cc.randomMinus1To1()*120;}
			}
            if(i===0) lastnetx=rx;
            ry=cc.randomMinus1To1()*150-100;
            newnet.setPosition(new cc.Vec2(rx,ry));
            this.node.addChild(newnet);
            this.net.push(newnet);
            if((parseInt(cc.random0To1()*2))==0)this.initStar(newnet.getPosition());
        }
    },
    point2vec2:function(point){
        return this.node.convertToNodeSpaceAR(new cc.Vec2(point.x,point.y));
        //return new cc.Vec2(point.x,point.y);
    },
    newLevel:function(){
        Global.levelNum=(++this.levelNum);
        //开启画线的触摸功能
        this.node.on('touchend',this.touchEnd,this);
        this.node.on('touchmove',this.touchMove,this);
        this.node.on('touchcancel',this.touchEnd,this);
        this.initPen();
        this.initLine();
        this.initNet();
		this.initLabel();
        if((parseInt(cc.random0To1()*2)==0)){
            this.initBarrier();}
        this.initBall();//initball 始终放在最后执行
    },
    touchMove:function(event){
        // let len=this.nowline._components[0].points.length;
        // if(cc.pDistance(this.nowline._components[0].points[len-1],this.nowline._components[0].points[len-2])<1) return;
        //     this.nowrigid._components[1].points.push(this.point2vec2(this.nowline._components[0].points[len-1]));
        //     if(this.nowrigid._components[1].points.length>=2){
                
        //             this.nowrigid._components[1].apply();
        //     }
    },
    genBallStatus:function(point,nets){
        //找到区间
        let sections=[];
        for(let net of nets){
            let section={};
            if(point.x<net.xMin){
                section.left=Math.atan((net.yMin-point.y)/(net.xMax-point.x));
                section.right=Math.atan((net.yMax-point.y)/(net.xMin-point.x));
            }
            else if(point.x>net.xMax){
                section.left=Math.atan((net.yMax-point.y)/(net.xMax-point.x));
                section.right=Math.atan((net.yMin-point.y)/(net.xMin-point.x));
            }
            else{
                section.left=Math.atan((net.yMin-point.y)/(net.xMin-point.x));
                section.right=Math.atan((net.yMin-point.y)/(net.xMax-point.x));
            }
            sections.push(section);
        }
        //随机选点
        var theta=null;
        for(let i=0;i<6;i++){
            if(i === 5) return null;
            theta=cc.randomMinus1To1()*(Math.PI/2);
            if(aGoodTheta(theta,sections)==true) return theta;
        }
    },
    touchEnd:function(event){
        this.pennum--;
        this.pen[this.pennum].destroy();
        if(this.linenum===3) {
            this.closeTouch();
            var self=this;
            this.loseTimer=setTimeout(function(){
                if(self.checkSuccess()===false){
                    self.loseGame();
                }
            },1000);
            return;
        };
        this.initLine();
    },
    freeLevel:function(){
        cc.director.loadScene('game');
    },
    checkSuccess:function(except){
        for(let i=0;i<this.ballnum;i++){
            if(cc.isValid(this.ball[i])&&(except!=this.ball[i])){
                return false;
            }
        }
        return true;
    },
    successGame:function(){
        this.gamestart=1;
        clearTimeout(this.loseTimer);
        this.freeLevel();
        console.log('success');
    },
    loseGame:function(){
        console.log('lost');
        cc.audioEngine.playEffect(this.failAudio,false);
        let rankClass = require("RankingView");
        let rank = new rankClass();
        rank.summitScore(Global.score);
        cc.director.loadScene('restart');
    },
    closeTouch:function(){
        this.node.off('touchmove',this.touchMove,this);
        this.node.off('touchend',this.touchEnd,this);
        this.node.off('touchcancel',this.touchEnd,this);
    },
    update:function(dt){
        if(this.gamestart==0)return;
        if(this.checkSuccess()===true)
        {
            this.successGame();
        }
        this.scoreLabel._components[0].string="Score:"+Global.score;
        for(let i=0;i<this.starnum;i++){
            if((cc.isValid(this.star[i]))&&(this.star[i]._components[4].timer>=this.star[i]._components[4].duration)){
                this.star[i].destroy();
            }
        }
    },
});
function once(fn, context) { 
	var result;

	return function() { 
		if(fn) {
			result = fn.apply(context || this, arguments);
			fn = null;
		}

		return result;
	};
}
function aGoodTheta(theta,sections){
    var interval=0.5;
    if((theta>-Math.PI/3)&&(theta<Math.PI/3)){
        return false;
    }
    for(let section of sections){
        if((theta-interval<section.left)&&(theta+interval>section.left)){
            return false;
        }
        if((theta-interval<section.right)&&(theta+interval>section.right)){
            return false;
        }
    }
    return true;
};
