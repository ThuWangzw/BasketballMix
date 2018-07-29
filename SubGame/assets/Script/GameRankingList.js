cc.Class({
    extends: cc.Component,

    properties: {
        rankingScrollView: cc.ScrollView,
        scrollViewContent: cc.Node,
        prefabRankItem: cc.Prefab,
        prefabGameOverRank: cc.Prefab,
        gameOverRankLabel: cc.Node,
        loadingLabel: cc.Node
    },


    onLoad(){
        Global.maxScore = 0;
    },


    start() {
        this.removeChild();
        if (CC_WECHATGAME) {
            window.wx.onMessage(data => {
                if (data.messageType === 0) {//移除排行榜
                    this.removeChild();
                } else if (data.messageType === 1) {//获取好友排行榜
                    this.fetchFriendData(data.MAIN_MENU_NUM);
                } else if (data.messageType === 2) {//提交得分
                    this.submitScore(data.MAIN_MENU_NUM, data.score);
                }else if (data.messageType === 3){//获取用户得分
                    this.gameOverRank(data.score);            
                }else if (data.messageType === 4){//获取用户历史最高分
                    this.getScore(data.MAIN_MENU_NUM);
                }
            });
        } else {
            this.fetchFriendData(1000);
        }
    },


    submitScore(MAIN_MENU_NUM, score) { //提交得分
        if (CC_WECHATGAME) {
            window.wx.getUserCloudStorage({
                // 以key/value形式存储
                keyList: [MAIN_MENU_NUM],
                success: function (getres) {
                    console.log('getUserCloudStorage', 'success', getres)
                    if (getres.KVDataList.length != 0) {
                        if (getres.KVDataList[0].value > score) {
                            return;
                        }
                    }
                    // 对用户托管数据进行写数据操作
                    window.wx.setUserCloudStorage({
                        KVDataList: [{key: MAIN_MENU_NUM, value: "" + score}],
                        success: function (res) {
                            console.log('setUserCloudStorage', 'success', res)
                        },
                        fail: function (res) {
                            console.log('setUserCloudStorage', 'fail')
                        },
                        complete: function (res) {
                            console.log('setUserCloudStorage', 'ok')
                        }
                    });
                },
                fail: function (res) {
                    console.log('getUserCloudStorage', 'fail')
                },
                complete: function (res) {
                    console.log('getUserCloudStorage', 'ok')
                }
            });
        } else {
            cc.log("提交得分:" + MAIN_MENU_NUM + " : " + score)
        }
    },


    removeChild() {
        this.node.removeChildByTag(1000);
        this.rankingScrollView.node.active = false;
        this.scrollViewContent.removeAllChildren();     
        this.gameOverRankLabel.getComponent(cc.Label).string = "";
        this.gameOverRankLabel.active = false;
        this.loadingLabel.getComponent(cc.Label).string = "加载中...";
        this.loadingLabel.active = true;
    },


    fetchFriendData(MAIN_MENU_NUM) {
        this.removeChild();
        this.rankingScrollView.node.active = true;
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    this.loadingLabel.active = false;
                    console.log('success', userRes.data)
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getFriendCloudStorage({
                        keyList: [MAIN_MENU_NUM],
                        success: res => {
                            console.log("wx.getFriendCloudStorage success", res);
                            let data = res.data;
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                return b.KVDataList[0].value - a.KVDataList[0].value;
                            });
                            for (let i = 0; i < data.length; i++) {
                                let playerInfo = data[i];
                                let item = cc.instantiate(this.prefabRankItem);
                                item.getComponent('RankItem').init(i, playerInfo);
                                this.scrollViewContent.addChild(item);
                                if (data[i].avatarUrl == userData.avatarUrl) {
                                    let userItem = cc.instantiate(this.prefabRankItem);
                                    userItem.getComponent('RankItem').init(i, playerInfo);
                                    userItem.y = -354;
                                    this.node.addChild(userItem, 1, 1000);
                                }
                            }
                            if (data.length <= 8) {
                                let layout = this.scrollViewContent.getComponent(cc.Layout);
                                layout.resizeMode = cc.Layout.ResizeMode.NONE;
                            }
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail", res);
                            this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                        },
                    });
                },
                fail: (res) => {
                    this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                }
            });
        }
    },


    getScore(MAIN_MENU_NUM){
        if (CC_WECHATGAME) {
            window.wx.getUserCloudStorage({
                // 以key/value形式存储
                keyList: [MAIN_MENU_NUM],
                success: function (getres) {
                    Global.maxScore = getres.KVDataList[0].value;
                },
                fail: function (res) {
                    console.log('getUserCloudStorage', 'fail')
                },
                complete: function (res) {
                    console.log('getUserCloudStorage', 'ok')
                }
            });
        } else {
            cc.log("提交得分:" + MAIN_MENU_NUM + " : " + score)
        }
    },


    gameOverRank(score) {
        this.node.removeChildByTag(1000);
        this.rankingScrollView.node.active = false;
        this.scrollViewContent.removeAllChildren();    
        this.loadingLabel.getComponent(cc.Label).string = "本次分数:" + score;
        this.loadingLabel.active = true;
        this.gameOverRankLabel.getComponent(cc.Label).string = "历史最高分:" + Global.maxScore;
        this.gameOverRankLabel.active = true;
    }
})