cc.Class({
    extends: cc.Component,
    properties:{
        rigirdChain:null,
    },
    // use this for initialization
    onLoad: function () {
        this.path = this.addComponent('R.path');
        this.path.fillColor = 'none';
        this.path.lineWidth = 5;
        this.path.showHandles = false;
        this.paintpath=[];
        this.listener = cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this),
        }, this.node);
        this.lastLoc=null;
    },

    onTouchBegan: function (touch) {
        var touchLoc = touch.getLocation();
        //touchLoc = this.node.parent.convertToNodeSpaceAR(touchLoc);

        this.points = [touchLoc];
        this.lastLoc=touchLoc;
        this.rigirdChain._components[1].points.push(this.node.parent.convertToNodeSpaceAR(touchLoc));
        this.paintpath=[this.node.convertToNodeSpaceAR(touchLoc)];
        return true;
    },

    onTouchMoved: function (touch) {
        var touchLoc = touch.getLocation();
        //touchLoc = this.node.parent.convertToNodeSpaceAR(touchLoc);
        if(cc.pDistance(this.lastLoc,touchLoc)<1) {
            console.log('too close');
            return;
        }
        this.rigirdChain._components[1].points.push(this.node.parent.convertToNodeSpaceAR(touchLoc));
        this.rigirdChain._components[1].apply();
        this.lastLoc=touchLoc;
        this.points.push(touchLoc);
        this.paintpath.push(this.node.convertToNodeSpaceAR(touchLoc))
        this.path.points(this.paintpath);
    },

    onTouchEnded: function (touch) {
        this.path.points(this.paintpath);
        cc.eventManager.removeListener(this.listener);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        
    },
});
