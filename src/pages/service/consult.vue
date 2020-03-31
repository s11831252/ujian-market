<template>
  <div class="wai">
    <scroll-view :scroll-into-view="toView" enable-flex="true" scroll-y="true" class="chatbox">
      <div class="top">欢迎您光临本店，请问有什么能帮助您？</div>
      <!-- <div class="msgbox"> -->
      <chatItem  v-for="(item,index) in ChatHistory" :key="index" :chatdata="item" :chatRoomInfo="chatRoomInfo"></chatItem>
      <div id="end"></div>
    </scroll-view>
    <!-- </div> -->
    <!-- 输入框 -->
    <div class="input-chat-box">
      <div class="input">
        <!-- 引用图标，需要引用其样式 -->
        <div class="icon" :class="chattype=='audio'?'focus':''" @click="pending('audio','语音')">&#xe664;</div>
        <input type="text" @click="pending('chat',null)" maxlength="1000" @confirm="sendMsg" confirm-type="send" v-model="msg" placeholder="输入新消息">
        <div class="icon" :class="chattype=='emoji'?'focus':''" @click="pending('emoji')">&#xe652;</div>
        <div class="icon" :class="chattype=='more'?'focus':''" @click="pending('more','多媒体功能')">&#xe726;</div>
      </div>
      <div v-if="chattype=='emoji'" class="emojibox">
        <swiper class="swiper">
          <swiper-item v-for="(item,index) in EmojiObj2.map" :key="index">
            <img v-for="(value,key) in item" :key="key" :src="EmojiObj2.path+value" @click="emojiInput(key)">
          </swiper-item>
        </swiper>
        <div class="toolbox">
          <span class="btn_send">发送</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import utils from "@/utils/index.js";
import chatItem from "@/pages/service/chat-item";
import WebIM from "@/utils/hx/WebIM";
import msgStorage from "./msgstorage";
import msgType from "./msgtype";
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
function calcUnReadSpot(message){
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
export default {
  data() {
    return {
      msg: "",
      sId: null,
      ChatHistory: [],
      chatRoomInfo: {},
      toView:"",
      chattype:"chat",
      EmojiObj2:{}
    };
  },
  components: {
    chatItem
  },
  computed: {
    ...mapState({
      Ticket: state => state.User.SingleTicket,
      UserInfo: state => state.User.UserInfo
    }),
    to() {
      if (this.chatRoomInfo) return this.chatRoomInfo.roomId;
      else return null;
    }
  },
  methods: {
    sendMsg() {
      var that = this;
      if (!this.to) {
      } else {
        let id = WebIM.conn.getUniqueId();
        let msg = new WebIM.message("txt", id);
        msg.set({
          msg: this.msg,
          from: WebIM.conn.context.userId,
          to: this.to,
          roomType: false,
          chatType: "groupchat",
          success(id, serverMsgId) {
            // disp.fire('em.chat.sendSuccess', id, me.data.userMessage);
            console.log(
              `发送消息(id=${id},serverMsgId=${serverMsgId})成功为`,
              msg
            );
          },
          fail(id, serverMsgId) {
            console.log(`发送消息(id=${id},serverMsgId=${serverMsgId})失败`);
          }
        });
        msg.setGroup("groupchat");
        WebIM.conn.send(msg.body);
        msgStorage.saveMsg(msg, "txt");
        that.msg = "";
      }
    },
    readMsg(renderableMsg,type,currentChatMsg,sessionKey,isNew){
      // console.log(renderableMsg,currentChatMsg)
      this.ChatHistory=currentChatMsg;
      
      if(this.ChatHistory.length)
      {
        if(isNew)
        {
          this.toView = currentChatMsg[this.ChatHistory.length-1].mid
        }else
        {
          this.toView = currentChatMsg[this.ChatHistory.length-1].mid
        }
      }
    },
    pending(type,title){
      if(this.chattype==type)
         this.chattype="chat";
      else
      {     
        if(title)
          this.toast(`${title}功能正在开发中`)
        this.chattype=type; 
      }
    },
    emojiInput(emoji){
      // console.log(item,item2)
      this.msg+=emoji
    }
  },
  async mounted() {
    var that = this;
    this.sId = this.$route.query.sId;
    let shopInfo ={}
    var rep = await this.$ShoppingAPI.Shop_GetDetails({ sId: this.sId });
    if (rep.ret == 0) {
      shopInfo = rep.data;
    }
    this.sName = decodeURI(this.$route.query.sName);
    //设置标题
    wx.setNavigationBarTitle({ title: this.sName });

    //查询聊天室列表,并尝试获取与该店铺的聊天室
    var listGroup = utils.getItem("listGroup");
    if (listGroup) {
      this.chatRoomInfo = listGroup.find(item => {
        return item.name == this.UserInfo.Phone + "_" + this.sName;
      });
    }
      var desc_obj = {
        store: {
          sId: this.sId,
          sNm: this.sName,
          sLogo: shopInfo.sLogo
        },
        order: {
          // orderId: "cc3c1767-684b-4eca-87d1-e09f1dea4b16",
          // orderNo: "201906181030089564",
          // state: "交易完成"
        },
        buyer: {
          bId: this.UserInfo.UserId,
          bPhone: this.UserInfo.Phone,
          bLogo: this.UserInfo.Portrait,
          bNm: this.UserInfo.UserName,
          auth: this.IsCertification
        },
        lastTime: Math.round(new Date().getTime() / 1000)
      };
    //没有则创建聊天室
    if (!this.chatRoomInfo||!this.chatRoomInfo.roomId) {
      var groupname, owner, members, desc;
      desc = JSON.stringify(desc_obj);
      desc = desc.replace(/\//g, "#") //格式化url
      groupname = `${this.UserInfo.Phone}_${this.sName}`;
      //店铺Id为创建人
      owner = this.sId.replace(/-/g, "") + "_";
      //把店铺成员一起拉进来
      this.$ShoppingAPI.ShopEmployee_Get(this.sId).then(rep => {
        if (rep.ret == 0) {
          var _menberArr = rep.data.map(item => {
            return item.UserId.replace(/-/g, "");
          });
          _menberArr.push(this.UserInfo.UserId.replace(/-/g, ""));
          members = _menberArr.join();
          // console.log(groupname, owner, members, desc);
          this.$API2
            .groupChat_Create(groupname, owner, members, desc)
            .then(rep2 => {
              // console.log(rep2);
              if (rep2.ret == 0) {
                this.chatRoomInfo = {
                  jid: `888yuezhi-88#ubuild_${
                    rep2.data
                  }@conference.easemob.com`,
                  name: groupname,
                  roomId: rep2.data.groupid,
                  desc:desc_obj
                };
                listGroup.push(this.chatRoomInfo);
                utils.setItem("listGroup", listGroup);
              }
            });
        }
      });
    } else
    {
      // //更新聊天室备注
      WebIM.conn.queryRoomInfo({
        roomId: this.chatRoomInfo.roomId,
        success: function(settings, members, fields) {
          console.log("queryRoomInfo成功",fields);
          var desc_obj = JSON.parse(fields.description);
          // console.log(desc_obj);
          desc_obj.lastTime = Math.round(new Date().getTime()/1000);
          var json_obj = JSON.stringify(desc_obj)
          // json_obj = json_obj.replace(/\//g, "#") //格式化url
          that.$API2.groupChat_ModifyDescription(that.chatRoomInfo.roomId,json_obj)
          // desc_obj.store.sLogo = desc_obj.store.sLogo.replace(/#/g,"/");
          // desc_obj.buyer.bLogo = desc_obj.buyer.bLogo.replace(/#/g,"/");
          // that.chatRoomInfo.desc=desc_obj;
          // console.log(that.chatRoomInfo);
        },
        error: function(msg) {
          console.log(msg);
        }
      });
    }
    that.chatRoomInfo.desc=desc_obj;
    var sessionKey = this.chatRoomInfo.roomId + WebIM.conn.context.userId;
      
    var chatMsg = utils.getItem(sessionKey);
    this.readMsg(null,null,chatMsg,sessionKey)
    this.EmojiObj2 = WebIM.EmojiObj2;

    msgStorage.on("newChatMsg", function(renderableMsg, type, curChatMsg, sesskey){
      // console.log("newChatMsg:",renderableMsg, curChatMsg)
      // 判断是否属于当前会话
      if(that.chatRoomInfo.roomId&&sesskey==sessionKey)
      {
        if(renderableMsg.info.from==that.chatRoomInfo.roomId||renderableMsg.info.to == that.chatRoomInfo.roomId)//群消息或者群成员发出的消息
        {
          that.readMsg(renderableMsg,type,curChatMsg,sesskey,true)
        }else if(renderableMsg.info.from == WebIM.conn.context.userId||renderableMsg.info.to == WebIM.conn.context.userId) //我发的消息或者别人发给我的消息
        {
          that.readMsg(renderableMsg,type,curChatMsg,sesskey)
        }
      }

		});
  },
  created() {
    var that = this;
    WebIM.conn.listen({
      onOpened: function(message) {
        console.log("onOpened",message);

        //连接成功回调
        // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
        // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
        // 则无需调用conn.setPresence();
        wx.hideLoading();
        WebIM.conn.setPresence();
        utils.setItem("myUsername", WebIM.conn.context.userId);
        if(that.isMP)
        {
          that.toast("正在同步聊天记录")
        }
        WebIM.conn.listRooms({
          success: function(resp) {
            utils.setItem("listGroup", resp);
            wx.hideLoading();
          },
          error: function(e) {
            console.log("error:", e);
          }
        });
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
					if(onMessageError(message)){
						msgStorage.saveReceiveMsg(message, msgType.IMAGE);
					}
					// calcUnReadSpot(message);
					ack(message);
      }, //收到图片消息
      onVideoMessage(message){
				console.log("onVideoMessage: ", message);
				if(message){
					if(onMessageError(message)){
						msgStorage.saveReceiveMsg(message, msgType.VIDEO);
					}
					// calcUnReadSpot(message);
					ack(message);
				}
			},//收到视频消息
			onAudioMessage(message){
				console.log("onAudioMessage", message);
				if(message){
					if(onMessageError(message)){
						msgStorage.saveReceiveMsg(message, msgType.AUDIO);
					}
					// calcUnReadSpot(message);
					ack(message);
				}
      },//收到音频消息
			onCmdMessage(message){
				console.log("onCmdMessage", message);
				if(message){
					if(onMessageError(message)){
						msgStorage.saveReceiveMsg(message, msgType.CMD);
					}
					// calcUnReadSpot(message);
					ack(message);
				}
      },//收到命令消息
      onFileMessage: function ( message ) {},    //收到文件消息
      onLocationMessage: function ( message ) {},//收到位置消息
      onRoster: function(message) {}, //处理好友申请
      onInviteMessage: function(message) {}, //处理群组邀请
      onOnline: function() {}, //本机网络连接成功
      onOffline: function() {}, //本机网络掉线
      onError: function(message) {

      }, //失败回调
      onReceivedMessage: function(message) {

      }, //收到消息送达服务器回执
      onDeliveredMessage: function(message) {

      }, //收到消息送达客户端回执
      onReadMessage: function(message) {} //收到消息已读回执
      // ......
    });
    this.hx_login();
  }
};
</script>
<style>
body{
  height: 100%;
  overflow: hidden;
}
</style>
<style lang="scss" scoped>
.wai {
  background-color: #ecf0f1;
  height: 100%;
  width: 100%;
  /* overflow:scroll; */
  /* padding-bottom: 0.4rem;
  margin-bottom: 1.4rem; */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.chatbox{
  height: 90%;
  flex-grow:2;
  padding-bottom: 2%;
  overflow: hidden;
}

.top {
  width: 6.38rem;
  height: 0.68rem;
  background-color: #c9c9c9;
  border-radius: 0.1rem;
  margin-top: 0.49rem;
  font-size: 0.34rem;
  color: #ffffff;
  text-align: center;
  line-height: 0.68rem;
  /* margin-top: 0.49rem; */
  margin-left: 2.21rem;
}
.input-chat-box{
  width: 100%;
  border-top: 0.02rem solid #898989;
  padding-top: 0.2rem;
  background-color: #fdfdfd;
  flex-grow:1;
}
.input {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.2rem;
  /* opacity: 1;
  bottom: 0rem;
  z-index: 99; */
  /* position: fixed; */
}
.input input {
  padding: 0.1rem;
  height: fit-content;
  min-height: 1rem;
  max-height: 2rem;
  width: 8rem;
  font-size: 0.4rem;
  /* 允许长单词换行到下一行 */
  word-wrap: break-word;
  word-break: break-all;
  overflow-y: visible;
  border-radius: 0.15rem;
  border: 0.02rem solid #898989;
  margin-right: 0.2rem;
  background-color: #ffffff;
}
.icon {
  font-size: 0.7rem;
  margin-right: 0.2rem;
}
.icon.focus{
  color:#12b7f5;
}
.emojibox{
  height: auto;
  width: auto;
  // margin-bottom:0.2rem;
  // padding-bottom:0.2rem;
  .swiper{
    background-color: #ecf0f1;
    height: 3rem;
  }
  img{
    width: 0.8rem;
    height: 0.8rem;
    margin-top:0.15rem ;
  }
  img:not(:first-child){
    padding-left:0.7rem;
  }
  img:nth-child(7n+1),img:first-child{
    padding-left:0.5rem;
  }
  .toolbox{
    display: flex;
    justify-content: flex-end;
    .btn_send{
      padding: 0.5rem;
      background-color: #12b7f5;
      color: #ecf0f1;
    }
  }
}
</style>
