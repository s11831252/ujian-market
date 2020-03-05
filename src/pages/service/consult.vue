<template>
  <div class="wai">
    <div class="top">欢迎您光临本店，请问有什么能帮助您？</div>
    <!-- <chatItem  v-for="(item,index) in ChatHistory" :key="index" :chatdata="item" ></chatItem> -->
    <!-- 输入框 -->
    <div class="input">
      <!-- 引用图标，需要引用其样式 -->
      <div class="icon">&#xe664;</div>
      <textarea maxlength="1000" auto-focus="’true’" v-model="msg" placeholder="输入新消息"></textarea>
      <div class="icon">&#xe652;</div>
      <div class="icon" @click="SendMsg">&#xe726;</div>
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
function ack(receiveMsg){
	// 处理未读消息回执
	var bodyId = receiveMsg.id;         // 需要发送已读回执的消息id
	var ackMsg = new WebIM.message("read", WebIM.conn.getUniqueId());
	ackMsg.set({
		id: bodyId,
		to: receiveMsg.from
	});
	WebIM.conn.send(ackMsg.body);
}
function onMessageError(err){
	if(err.type === "error"){
		wx.showToast({
			title: err.errorText
		});
		return false;
	}
	return true;
}
// function calcUnReadSpot(message){
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
// }
export default {
  data() {
    return {
      msg: "",
      to:"",
      sId: null,
      webSocket: null,
      ChatHistory: [],
      chatInfo:null
    };
  },
  components: {
    chatItem
  },
  computed: {
    ...mapState({
      Ticket: state => state.User.SingleTicket,
      UserInfo: state => state.User.UserInfo
    })
  },
  methods: {
    SendMsg(){
      var that = this;
			let id = WebIM.conn.getUniqueId();
			let msg = new WebIM.message("txt", id);
			msg.set({
				msg: this.msg,
				from: WebIM.conn.context.userId,
				to:this.to,
				roomType: false,
				chatType: "chat",
				success(id, serverMsgId){
          // disp.fire('em.chat.sendSuccess', id, me.data.userMessage);
          msgStorage.saveMsg(msg,"txt")
          console.log(`发送消息(id=${id},serverMsgId=${serverMsgId})成功为`,msg)
          that.msg="";
				},
				fail(id, serverMsgId){
					console.log('发送消息失败')
				}
      });
			msg.setGroup("groupchat");
      WebIM.conn.send(msg.body);
      
    }
  },
  mounted() {
    this.sId = this.$route.query.sId;
    this.sName= decodeURI(this.$route.query.sName);
    //设置标题
    wx.setNavigationBarTitle({ title: this.sName });

    //查询聊天室列表,并仓尝试获取与该店铺的聊天室
    var listGroup = utils.getItem("listGroup")
    if(listGroup)
    {
      this.chatInfo = listGroup.find(item=>{
        return item.name==this.UserInfo.Phone+"_"+this.sName
      })
    }
    //有聊天室
    if(!this.chatInfo){
      //没有则创建聊天室
      var groupname,owner,members,desc="备注"

      groupname=`${this.UserInfo.Phone}_${this.sName}`;
      //店铺Id为创建人
      owner=this.sId.replace(/-/g, "")+"_";
      //把店铺成员一起拉进来
      this.$ShoppingAPI.ShopEmployee_Get(this.sId).then((rep)=>{
        if(rep.ret==0)
        {
          var _menberArr = rep.data.map(item=>{
            return item.UserId.replace(/-/g, "");
          });
          _menberArr.push(this.UserInfo.UserId.replace(/-/g, ""))
          members = _menberArr.join();
          console.log(groupname,owner,members,desc)
          this.$API2.groupChat_Create(groupname,owner,members,desc).then(rep2=>{
            console.log(rep2)
            if(rep2.ret==0)
            {
              this.chatInfo={jid: `888yuezhi-88#ubuild_${rep2.data}@conference.easemob.com`, name: groupname, roomId:  rep2.data};
              listGroup.push(this.chatInfo)
              utils.setItem("listGroup",listGroup);
            }
          });
        }
      });
    }
    console.log(this.chatInfo)
    this.to = this.chatInfo.roomId
  },
  created() {
    var that = this;
    WebIM.conn.listen({
      onOpened: function(message) {
        //连接成功回调
        // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
        // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
        // 则无需调用conn.setPresence();
        console.log(message)
        WebIM.conn.setPresence();
        utils.setItem("myUsername",WebIM.conn.context.userId)
        
            WebIM.conn.listRooms({
                success: function(resp) {
                    utils.setItem("listGroup",resp)
                },
                error: function(e) {
                    console.log("error:", e);
                }
            });
      },
      onClosed: function(message) {

        console.log("环信onClosed",message)
      }, //连接关闭回调
      onTextMessage: function(message) {
				console.log("onTextMessage", message);
				if(message){
					if(onMessageError(message)){
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
      onEmojiMessage: function(message) {}, //收到表情消息
      onPictureMessage: function(message) {}, //收到图片消息
      onRoster: function(message) {}, //处理好友申请
      onInviteMessage: function(message) {}, //处理群组邀请
      onOnline: function() {}, //本机网络连f接成功
      onOffline: function() {}, //本机网络掉线
      onError: function(message) {}, //失败回调
      onReceivedMessage: function(message) {}, //收到消息送达服务器回执
      onDeliveredMessage: function(message) {}, //收到消息送达客户端回执
      onReadMessage: function(message) {} //收到消息已读回执
      // ......
    });
    this.hx_login();
  }
};
</script>

<style scoped>
.wai {
  background-color: #ecf0f1;
  height: 100%;
  padding-top: 0.49rem;
}
.top {
  width: 6.38rem;
  height: 0.68rem;
  background-color: #c9c9c9;
  border-radius: 0.1rem;
  font-size: 0.34rem;
  color: #ffffff;
  text-align: center;
  line-height: 0.68rem;
  /* margin-top: 0.49rem; */
  margin-left: 2.21rem;
}

.input {
  width: 100%;
  border-top: 0.02rem solid #898989;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.2rem;
  background-color: #fdfdfd;
  opacity: 1;
  position: fixed;
  bottom: 0rem;
  z-index: 99;
}
.input textarea {
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
</style>
