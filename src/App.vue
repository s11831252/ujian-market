<script>
import { mapActions } from "vuex";
import utils from "@/utils/index.js";
import WebIM from "@/utils/hx/WebIM";
import msgStorage from "./pages/service/msgstorage";
import disp from "./utils/hx/broadcast";
import msgType from "./pages/service/msgtype";
import "./assets/style.css";
import "./assets/global.css";
import "./assets/iconfont.less";
//异常时的弹框锁,避免重复触发
let lockOnError = false;

function ack(receiveMsg) {
  // 处理未读消息回执
  var bodyId = receiveMsg.id; // 需要发送已读回执的消息id
  var ackMsg = new WebIM.message("read", WebIM.conn.getUniqueId());
  ackMsg.set({
    id: bodyId,
    to: receiveMsg.from
  });
  WebIM.conn.send(ackMsg.body);
}
function onMessageError(err) {
  if (err.type === "error") {
    wx.showToast({
      title: err.errorText
    });
    return false;
  }
  return true;
}
function calcUnReadSpot(message) {
  // 	let myName = wx.getStorageSync("myUsername");
  // 	let members = wx.getStorageSync("member") || []; //好友
  // 	var listGroups = wx.getStorageSync('listGroup')|| []; //群组
  // 	let allMembers = members.concat(listGroups)
  // 	let count = allMembers.reduce(function(result, curMember, idx){
  // 		let chatMsgs;
  // 		if (curMember.roomId) {
  // 			chatMsgs = wx.getStorageSync(curMember.roomId + myName.toLowerCase()) || [];
  // 		}else{
  // 			chatMsgs = wx.getStorageSync(curMember.name.toLowerCase() + myName.toLowerCase()) || [];
  // 		}
  // 		return result + chatMsgs.length;
  // 	}, 0);
  // 	getApp().globalData.unReadMessageNum = count;
  // 	disp.fire("em.xmpp.unreadspot", message);
}
/**
 * @description: '分页递归获取环信获取聊天组详情信息'
 * @param {*} _groupids 需要获取的聊天组id数组
 * @param {*} count 获取的数量
 * @param {*} index 从下标开始获取,默认0
 * @return {*}
 */
function getGroupInfo(_groupids, count,index=0) {
  let arr = [];
  let _pageIndex = index,_pageSize = count>100?100:count;
  let sum_groupids = _groupids.slice(_pageIndex, _pageIndex+_pageSize);
  return new Promise((resolve, reject) => {
    WebIM.conn.getGroupInfo({
      groupId: sum_groupids,
      async success(resOfGroupInfo) {
        // console.log(resOfGroupInfo);
        arr = resOfGroupInfo.data.map(item => {
          var owner = item.affiliations.find(item2 => {
            return item2.owner;
          });
          return { ...item, owner: owner.owner };
        }); //map把owner找出来放到对象中方便后续使用判断
        let sum = count - _pageSize;
        if(sum>0)
        {
         arr = arr.concat(await getGroupInfo(_groupids,sum,_pageIndex+_pageSize))
        }
        utils.setItem("listGroup", arr);
        resolve(arr)
      },
      error(msg) {
        console.log(msg);
        reject(msg)
      }
    });
  })
}
export default {
  methods: {
    ...mapActions(["GetConfig","getArea"]),
  },
  created() {
    //debugger
    // `this` 指向 vm 实例
    var that = this;
    WebIM.conn.listen({
      onOpened: function(message) {
        console.log("onOpened");
        that.showLoading({ title: "正在同步聊天记录" });
        utils.setItem("myUsername", WebIM.conn.context.userId);
        utils.setItem("listGroup", null);
        disp.fire("onOpened");
        WebIM.conn.getGroup({
          success: async function(resp) {
            var _shopChatGroups = resp.data.filter(item => {
              return item.groupname.indexOf("_") > -1;
            });
            if(_shopChatGroups&&_shopChatGroups.length>0)
            {
              var _groupids = _shopChatGroups.map(item => item.groupid);
              await getGroupInfo(_groupids,_groupids.length)
            }else
            {
              utils.setItem("listGroup", []);
            }

            that.hideLoading();
          },
          error: function() {
            that.hideLoading();
          }
        });
      }, //连接打开
      onClosed: function(message) {
        console.log("环信onClosed", message);
        disp.fire("onClosed", message);
      }, //连接关闭回调
      onTextMessage: function(message) {
        console.log("onTextMessage", message);
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.TEXT);
          }
          // calcUnReadSpot(message);
          ack(message);

          // if(message.ext.msg_extension){
          // 	let msgExtension = JSON.parse(message.ext.msg_extension)
          // 	let conferenceId = message.ext.conferenceId
          // 	let password = message.ext.password
          // 	disp.fire("em.xmpp.videoCall", {
          // 		msgExtension: msgExtension,
          // 		conferenceId: conferenceId,
          // 		password: password
          // 	});
          // }
        }
      }, //收到文本消息
      onEmojiMessage: function(message) {
        console.log("onEmojiMessage", message);
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.EMOJI);
          }
          // calcUnReadSpot(message);
          ack(message);
        }
      }, //收到表情消息
      onPictureMessage: function(message) {
        console.log("onPictureMessage", message);
        if (onMessageError(message)) {
          msgStorage.saveReceiveMsg(message, msgType.IMAGE);
        }
        // calcUnReadSpot(message);
        ack(message);
      }, //收到图片消息
      onVideoMessage(message) {
        console.log("onVideoMessage: ", message);
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.VIDEO);
          }
          // calcUnReadSpot(message);
          ack(message);
        }
      }, //收到视频消息
      onAudioMessage(message) {
        console.log("onAudioMessage", message);
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.AUDIO);
          }
          // calcUnReadSpot(message);
          ack(message);
        }
      }, //收到音频消息
      onCmdMessage(message) {
        console.log("onCmdMessage", message);
        // if (message.from == WebIM.conn.context.userId) {
        //   return;
        // }
        disp.fire("onCmdMessage", message);
        // if (message) {
        //   if (onMessageError(message)) {
        //     msgStorage.saveReceiveMsg(message, msgType.CMD);
        //   }
        //   // calcUnReadSpot(message);
        //   ack(message);
        // }
      }, //收到命令消息
      onFileMessage: function(message) {}, //收到文件消息
      onLocationMessage: function(message) {
        console.log("onLocationMessage", message);
        if (onMessageError(message)) {
          msgStorage.saveReceiveMsg(message, msgType.LOCATION);
        }
        // calcUnReadSpot(message);
        ack(message);
      }, //收到位置消息
      onRoster: function(message) {}, //处理好友申请
      onInviteMessage: function(message) {}, //处理群组邀请
      onOnline: function(msg) {
        console.log("onOnline", msg);
      }, //本机网络连接成功
      onOffline: function(msg) {
        console.log("onOffline", msg);
      }, //本机网络掉线
      onError: function(message) {
        console.log("环信Error:", message);

        if (message.type == 16) {
          console.log(`环信 autoReconnectNum:${WebIM.conn.autoReconnectNumTotal} , autoReconnectNumMax:${WebIM.conn.autoReconnectNumMax}`);
          disp.fire("onSocketDisconnected", message);
        }else if (message.type == 206 || message.type == 8) {
          if (!lockOnError) {
            that.modal({
              title: "连接失败",
              content: "账号已在其他设备登录,您可尝试重连",
              confirm: () => {
                WebIM.conn.close(); //环信IM关闭
                that.hx_login();
                lockOnError = false;
              },
              cancel: () => {
                lockOnError = false;
              },
              confirmText: "重连"
            });
          }
          lockOnError = true;
        }
        // that.$UJAPI.Error_upload({
        //   ApplicationName: "U建行业市场小程序",
        //   ErrorThread: "环信ERROR",
        //   ErrorClassName: "App.VUE",
        //   ErrorMsg: JSON.stringify(message),
        //   ErrorType: message.type
        // });

      }, //失败回调
      onReceivedMessage: function(message) {
        console.log("onReceivedMessage", message);
        //如果是自己发送的消息则更新发送中状态sendOK=false
        msgStorage.sendOk(message.id, message.to + WebIM.conn.context.userId)

      }, //收到消息送达服务器回执
      onDeliveredMessage: function(message) {
        console.log("onDeliveredMessage", message);
      }, //收到消息送达客户端回执
      onReadMessage: function(message) {
        console.log("onReadMessage", message);
      }, //收到消息已读回执
      onPresence: function(msg) {
        console.log("onPresence", msg);
        disp.fire("onPresence", msg);
      },
      onCustomMessage: function(msg) {
        console.log("onCustomMessage", msg);
        // if (msg.from == WebIM.conn.context.userId) {
        //   return;
        // }
        disp.fire("newCustomMessage", msg);
      }, // 自定义消息
      onReconnect() {
        console.log("onReconnect 重连中", msg);
      },
      onSocketConnected() {
        console.log("onSocketConnected socket连接成功", msg);
      }
    });
  },
  mounted() {
    //同上
  },
  onLoad() {
    //同上
  },
  onLaunch(opt) {
    // 获取小程序更新机制兼容
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: "更新提示",
              content: "新版本已经准备好，是否重启应用？",
              success: function(res) {
                if (res.confirm) {
                  wx.clearStorageSync(); //清除缓存

                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                }
              }
            });
          });
          updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
            wx.showModal({
              title: "已经有新版本了哟~",
              content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
            });
          });
        }
      });
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: "提示",
        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
      });
    }
    this.GetConfig();
    this.getArea();

    
  }
};
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 50px 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
#app,
html {
  /* height: 100%; */
}
/* page{
  background: #ecf0f1;
  margin-bottom: 45px;
} */
</style>
