<template>
    <div id="app">
        <router-view></router-view>
        <mynav v-if="Enable"></mynav>
    </div>
</template>

<script>
import mynav from '@/components/mynav.vue'
import { mapActions  } from "vuex";
import utils from "./utils/index";
import WebIM from "@/utils/hx/WebIM";
import disp from "./utils/hx/broadcast";
import msgStorage from "./pages/service/msgstorage";
import msgType from "./pages/service/msgtype";
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
function getGroupInfo(_groupids, count,index=0) {
  let arr = [];
  let _pageIndex = index,_pageSize = count>100?100:count;
  let sum_groupids = _groupids.slice(_pageIndex, _pageIndex+_pageSize);
  return new Promise((resolve, reject) => {
    WebIM.conn.getGroupInfo({
      groupId: sum_groupids,
      async success(resOfGroupInfo) {
        console.log(resOfGroupInfo);
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
  computed:{
    Enable(){
      var that =this;
      var nowRouteConfig= this.$router.options.routes.find((item)=>{
        return  item.alias==that.$route.path;
      });//此处判断当前route是否启动导航
      return nowRouteConfig&&nowRouteConfig.config&&nowRouteConfig.config.EnableNav;
    }
  },
  components: {
    mynav,
  },
  methods:{
      ...mapActions(["GetConfig"])
  },
  created(){
    this.getArea();
    var that = this;
    WebIM.conn.listen({
      onOpened: function(message) {
        console.log("onOpened")
        that.showLoading({ title: "正在同步聊天记录" });
        
        WebIM.conn.getGroup({
          success: async function(resp){
            var _shopChatGroups = resp.data.filter(item => {
              return item.groupname.indexOf("_") > -1;
            });
            utils.setItem("myUsername", WebIM.conn.context.userId);
            utils.setItem("listGroup", []);
            var _groupids = _shopChatGroups.map(item => item.groupid);
            await getGroupInfo(_groupids,_groupids.length)
            that.hideLoading();
          },
          error: function(){
            that.hideLoading();
          }
        });
        disp.fire('onOpened');
      },
      onClosed: function(message) {
        console.log("环信onClosed", message);
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
        disp.fire("onCmdMessage", message);

        // if (message) {
        //   if (onMessageError(message)) {
        //     msgStorage.saveReceiveMsg(message, msgType.CMD);
        //   }
        //   // calcUnReadSpot(message);
        //   ack(message);
        // }
      }, //收到命令消息
      onCustomMessage: function(msg) {
        console.log("onCustomMessage", msg);
        // if (msg.from == WebIM.conn.context.userId) {
        //   return;
        // }
        disp.fire("newCustomMessage", msg);
      }, // 自定义消息
      onFileMessage: function(message) {
        console.log("onFileMessage", message);
      }, //收到文件消息
      onLocationMessage: function(message) {
        console.log("onLocationMessage", message);
        if (onMessageError(message)) {
          msgStorage.saveReceiveMsg(message, msgType.LOCATION);
        }
        // calcUnReadSpot(message);
        ack(message);
      }, //收到位置消息
      onRoster: function(message) {
        console.log("onRoster", message);
      }, //处理好友申请
      onInviteMessage: function(message) {
        console.log("onInviteMessage", message);
      }, //处理群组邀请
      onOnline: function(message) {
        console.log("onOnline", message);
      }, //本机网络连接成功
      onOffline: function(message) {
        console.log("onOffline", message);
      }, //本机网络掉线
      onError: function(message) {
        console.log("onError", message);
      }, //失败回调
      onReceivedMessage: function(message) {
        console.log("onReceivedMessage", message);
        //如果是自己发送的消息则更新发送中状态sendOK=false
        msgStorage.sendOk(message.id, message.to + WebIM.conn.context.userId)

      }, //收到消息送达服务器回执
      onPresence: function(msg) {
        console.log("onPresence", msg);
        disp.fire("onPresence", msg);
      },
      onDeliveredMessage: function(message) {
        console.log("onDeliveredMessage", message);
      }, //收到消息送达客户端回执
      onReadMessage: function(message) {
        console.log("onReadMessage", message);
      } //收到消息已读回执
      
      // ......
    });
    this.hx_login();
    //   wx.ready(() => {
    //     console.log('wx.ready');
    //     that.$store.commit("wx_jssdk_config_result",true)
    //   });

    //   wx.error(function (res) {
    //     that.$store.commit("wx_jssdk_config_result",false)
    //     console.log('wx err', res);
    //     //可以更新签名
    //   });
    // var timestamp = new Date().getTime(),
    // nonceStr = utils.Guid.NewGuid().toString('N');
    // this.$UJAPI.BusinessCard_GetJSapi_ticket(encodeURIComponent(document.URL),timestamp,nonceStr).then(res=>{
    //   wx.config({
    //     debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
    //     appId: 'wx94cd3f526b2cf2c5', // 必填，公众号的唯一标识
    //     timestamp, // 必填，生成签名的时间戳
    //     nonceStr, // 必填，生成签名的随机串
    //     signature: res.data,// 必填，签名
    //     jsApiList: [], // 必填，需要使用的JS接口列表
    //     openTagList: ['wx-open-launch-weapp'] // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
    //   });
    // })
  }
};
</script>
<style>
/* @import url('./assets/global.css');
@import url('./assets/iconfont.less');
@import url('./assets/style.less');
@import url('./components/Toast/toast.css'); */
/* #app{
  margin-bottom: 45px;
} */
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
body{
  height: 100%;
  padding: 0;
  margin: auto 0;
}
#app,html{
  height: 100%;
}
</style>
}

</style>