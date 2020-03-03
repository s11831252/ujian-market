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
import md5 from "@/utils/md5";
import msgStorage from "./msgstorage";
import msgType from "./msytype";

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
					console.log('成功了',id,serverMsgId)
          // disp.fire('em.chat.sendSuccess', id, me.data.userMessage);
          msgStorage.saveMsg(msg,msgType.TEXT)
          that.msg="";
				},
				fail(id, serverMsgId){
					console.log('失败了')
				}
      });
			msg.setGroup("groupchat");
			console.log('发送消息', msg)
      WebIM.conn.send(msg.body);
      
    }
  },
  mounted() {
    this.sId = this.$route.query.sId;
    this.sName= decodeURI(this.$route.query.sName);
    wx.setNavigationBarTitle({ title: this.sName });
    var listGroup = utils.getItem("listGroup")
    if(listGroup)
    {
      this.chatInfo = listGroup.find(item=>{
        return item.name==this.UserInfo.Phone+"_"+this.sName
      })
      console.log(this.chatInfo);
      if(this.chatInfo)
      this.to = this.chatInfo.roomId
    }
  },
  created() {
    var that = this;
    console.log(WebIM);
    var _WebIM=WebIM
    WebIM.conn.listen({
      onOpened: function(message) {
        //连接成功回调
        // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
        // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
        // 则无需调用conn.setPresence();
        console.log(message)
        _WebIM.conn.setPresence();
        utils.setItem("myUsername",_WebIM.conn.context.userId)
        
            _WebIM.conn.listRooms({
                success: function(resp) {
                    console.log("Response: ", resp);
                    // cursor = resp.cursor;
                    utils.setItem("listGroup",resp)
                },
                error: function(e) {
                    console.log("error:", e);
                }
            });
      },
      onClosed: function(message) {}, //连接关闭回调
      onTextMessage: function(message) {

        
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
    if (this.UserInfo && this.UserInfo.UserId) {
      var hx_username = this.UserInfo.UserId.replace(/-/g, "");
      var hx_psw = md5.hex_md5(hx_username);
      console.log(hx_username, hx_psw);

      let options = {
        grant_type: "password",
        apiUrl: WebIM.config.apiURL,
        user: hx_username,
        pwd: hx_psw,
        appKey: WebIM.config.appkey
      };
      WebIM.conn.open(options);
    }
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
