<template>
  <div v-if="roomInfo" class="root">
    <live-player :src="roomInfo.livePushUrl" mode="live" autoplay @statechange="statechange" @error="error" class="live-play" />
    <div class="top-tool">
      <div @click="showMember=true" class="people_num">{{roomInfo.affiliations.length}}人</div>
    </div>
    <div class="chart-container">
      <scroll-view :scroll-into-view="toView" enable-flex="true" scroll-y="true" class="chatbox" v-if="isMP">
        <div class="top">欢迎您进入直播间</div>
        <!-- <chatItem v-for="(item,index) in ChatHistory" :key="index" :chatdata="item" :desc="desc_obj" :chatRoomInfo="chatRoomInfo"></chatItem> -->
        <div class="chat-item" v-for="(item,index) in ChatHistory" :key="index" :id="item.mid">
          <div>{{item.ext.nickName}} </div>
          <!-- <chatMsg :msgData="item"></chatMsg> -->
          <span class="txt_praise" v-if="item.msg.type=='chatroom_praise'"> 给主播点了{{item.msg.customExts.num}}个赞</span>
          <span class="txt_joinRoom" v-else-if="item.msg.type=='chatroom_member_join'">加入直播间</span>
          <div v-else>
            ：<chatMsg v-for="(item,index2) in item.msg.data" :key="index2" :msgdata="item"></chatMsg>
          </div>
        </div>
        <div id="end"></div>
      </scroll-view>
      <scrollContainer :scroll-to-id="toView" v-else>
        <div class="top">欢迎您进入直播间</div>
        <chatItem v-for="(item,index) in ChatHistory" :key="index" :chatdata="item" :desc="desc_obj" :chatRoomInfo="chatRoomInfo"></chatItem>
        <div id="end"></div>
      </scrollContainer>
      <div class="chat-tool">
        <div class="input-box">
          <i class="icon">&#xe637;</i>
          <input placeholder="说点什么..." type="text" v-model="textMsg" maxlength="200" @confirm="sendMsg" confirm-type="send" fixed="true" />
        </div>
        <i class="icon exit" @click="exitLiveRoom">&#xe609;</i>
        <i class="icon praise" @click="giveLike">&#xe619;</i>
        <i class="icon gift">&#xe651;</i>
      </div>
    </div>
    <div class="modal" v-if="showMember">
      <div class="mask" @click.stop="showMember=false"></div>
      <span class="title">观众</span>

      <div class="member-list">
        <scroll-view scroll-into-view enable-flex="true" scroll-y="true">
          <div class="item" v-for="(item,index) in roomInfo.affiliations" :key="index">
            <img :src="item.Portrait" />
            <span>{{item.UserName}}</span>
          </div>
        </scroll-view>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import WebIM from "@/utils/hx/WebIM";
import msgStorage from "@/pages/service/msgstorage";
import disp from "../../utils/hx/broadcast";
import msgType from "@/pages/service/msgtype";
import scrollContainer from "@/pages/service/scrollcontainer";
import utils from "@/utils/index.js";
import chatItem from "@/pages/service/chat-item";
import chatMsg from "@/pages/service/chat-msg";

export default {
  data() {
    return {
      roomInfo: null,
      toView: "",
      ChatHistory: [],
      showMember: false,
      textMsg:""
    };
  },
  components: {
    scrollContainer,
    chatItem,
    chatMsg
  },
  computed: {
    ...mapState({
      UserInfo: state => state.User.UserInfo
    }),
    sessionKey() {
      if (this.roomInfo && this.roomInfo.id) return this.roomInfo.id + WebIM.conn.context.userId;
      else return "";
    }
  },
  methods: {
    statechange(e) {
      console.log("live-player code:", e);
    },
    error(e) {
      console.error("live-player error:", e);
    },
    //读取消息
    readMsg(renderableMsg, type, currentChatMsg, sessionKey,msg) {
      // console.log(renderableMsg, type, currentChatMsg, sessionKey,msg)
      if(msg)
      {
        var memberInfo = this.roomInfo.affiliations.find(item => {
            return item.member == msg.from || item.owner == msg.from;
        });
        if(memberInfo)
        {
          if(renderableMsg)renderableMsg.ext.nickName=memberInfo.UserName
        }
      }

      if (renderableMsg) 
       this.ChatHistory.push(renderableMsg);
      // else if (currentChatMsg) 
      //  this.ChatHistory = currentChatMsg;
      if(this.ChatHistory&&this.ChatHistory.length>0)
        this.toView = this.ChatHistory[this.ChatHistory.length - 1].mid;
    },

  //发送普通消息
  sendMsg() {
    let self = this;
    if(this.textMsg)
    {
      let roomId = this.roomInfo.id
      let from = WebIM.conn.context.userId;
      let id = WebIM.conn.getUniqueId();                 // 生成本地消息id
      let msg = new WebIM.message('txt', id);      // 创建文本消息
      msg.set({
        msg: this.textMsg,                            // 消息内容
        to: roomId,
        from,
        roomType: true,
        ext: { nickName: this.UserInfo.UserName },                                 //扩展消息
        success: function (id, serverMsgId) {
          console.log('send private text Success',msg);
          msgStorage.saveMsg(msg, "txt");
          self.textMsg="";
        },
        fail: function (e) {
          console.log("Send private text error");
        }
      });
      msg.setGroup('groupchat');
      WebIM.conn.send(msg.body);
    }

  },
    // 发点赞消息
    giveLike() {
      let self = this;
      let roomId = this.roomInfo.id;
      let from = WebIM.conn.context.userId;
      let id = WebIM.conn.getUniqueId();
      let msg = new WebIM.message("custom", id);
      msg.set({
        to: roomId,
        roomType: true,
        customEvent: "chatroom_praise",
        customExts: { note: "点赞" },
        params: { num: 1 },
        success: ()=> {
            console.log("send private text Success",msg);
            var renderableMsg = {
              info: {
                from: from,
                to: msg.body.to
              },
              username: from == WebIM.conn.context.userId ? msg.body.to : from,
              yourname: from,
              msg: {
                type: msg.body.customEvent,
                customExts: msg.body.customExts,
                ext: msg.body.ext
              },
              ext: msg.body.ext,
              time: msg.body.time,
              mid: msg.body.customEvent + msg.body.id,
              chatType: msg.body.contentsType
            };
            self.readMsg(renderableMsg,msg.body.customEvent, null, this.sesskey);
        },
        fail: function() {},
        ext: { nickName: this.UserInfo.UserName },
        nickName: this.UserInfo.UserName
      });
      msg.setGroup("groupchat");
      WebIM.conn.send(msg.body);
    },

    // 退出直播间
    exitLiveRoom() {
      WebIM.conn.quitChatRoom({
        roomId: this.roomInfo.id,
        success: res => {
          this.$router.replace({ path: "/pages/live/index" });
        },
        error: e => {
          console.log("退出失败", e);
        }
      });
    },
    customMsgHanderler(msg){
      var that = this;
              var renderableMsg = {
                info: {
                  from: msg.from,
                  to: msg.to
                },
                username: msg.from == WebIM.conn.context.userId ? msg.to : msg.from,
                yourname: msg.from,
                msg: {
                  type: msg.customEvent,
                  customExts: msg.customExts,
                },
                ext: msg.ext,
                time: msg.time,
                mid: msg.customEvent + msg.id,
                chatType: msg.contentsType
              };
        switch (msg.customEvent) {
          case "chatroom_praise": {
            console.log("chatroom_praise", msg);
            renderableMsg.msg ={
                type: msg.customEvent,
                customExts: msg.customExts,
                ext: msg.ext
            };
            var memberInfo = this.roomInfo.affiliations.find(item => {
              return item.member == msg.from || item.owner == msg.from;
            });
            if (memberInfo) {
              renderableMsg.ext.nickName = memberInfo.UserName;
            }
            that.readMsg(renderableMsg, msg.customEvent, null, this.sesskey,msg);
            break;
          }
          case "chatroom_gift": {
            break;
          }
          case "chatroom_member_join": {
            console.log("chatroom_member_join", that.roomInfo.affiliations);
            var memberInfo = this.roomInfo.affiliations.find(item => {
              return item.member == msg.from || item.owner == msg.from;
            });

            if (!memberInfo) {
              that.roomInfo.affiliations.push({
                Portrait: msg.customExts.avatar,
                UserName: msg.customExts.nick,
                member: msg.from,
                owner: null
              });

              that.readMsg(renderableMsg, msg.customEvent, null, this.sesskey,msg);
              console.log("chatroom_member_join", that.roomInfo.affiliations);
            }
            break;
          }
          case "chatroom_member_video_call": {
            //                 customExts:
            // video_call: "rtmp://pullStreamUrl"
            // video_call_status: "start"
          }
          default:
            break;
        }
    },
    presenceHanderler(msg){
      var that = this;
      switch (msg.type) {
          case "rmChatRoomMute":
            // 解除聊天室一键禁言
            break;
          case "muteChatRoom":
            // 聊天室一键禁言
            break;
          case "rmUserFromChatRoomWhiteList":
            // 删除聊天室白名单成员
            break;
          case "addUserToChatRoomWhiteList":
            // 增加聊天室白名单成员
            break;
          case "deleteFile":
            // 删除聊天室文件
            break;
          case "uploadFile":
            // 上传聊天室文件
            break;
          case "deleteAnnouncement":
            // 删除聊天室公告
            break;
          case "updateAnnouncement":
            // 更新聊天室公告
            break;
          case "removeMute":
            // 解除禁言
            break;
          case "addMute":
            // 禁言
            break;
          case "removeAdmin":
            // 移除管理员
            break;
          case "addAdmin":
            // 添加管理员
            break;
          case "changeOwner":
            // 转让聊天室
            break;
          case "leaveChatRoom": // 退出聊天室
          {
            console.log("leaveChatRoom", that.roomInfo.affiliations);
            var memberInfo = this.roomInfo.affiliations.find(item => {
              return item.member == msg.from || item.owner == msg.from;
            });
            if (memberInfo) {
              var _index = that.roomInfo.affiliations.indexOf(memberInfo);
              that.roomInfo.affiliations.splice(_index, 1);
              console.log("leaveChatRoom", that.roomInfo.affiliations);
            }
            break;
          }
          case "memberJoinChatRoomSuccess": // 加入聊天室
          {
            break;
          }
          case "leave":
            // 退出群
            break;
          case "join":
            // 加入群
            break;
          default:
            break;
        }
    }
  },
  onUnload() {
    msgStorage.off("newChatMsg", this.readMsg);
    disp.off("newCustomMessage", this.customMsgHanderler);
    disp.off("onPresence", this.presenceHanderler);

  },
  async mounted() {
    var that = this;
    if (this.$route.query.roomId) {
      var res = await this.$ShoppingAPI.AppServer_LiveRoomsDetail(this.$route.query.roomId);
      if (res) {
        this.roomInfo = res.data;
        
        var res =  await this.$ShoppingAPI.AppServer_GetGiftList();
        
        // var chatMsg = utils.getItem(this.sessionKey);
        // this.readMsg(null, null, chatMsg, this.sessionKey);
      }
      this.EmojiObj2 = WebIM.EmojiObj2;
      msgStorage.on("newChatMsg", this.readMsg);
      disp.on("newCustomMessage", this.customMsgHanderler);
      disp.on("onPresence",this.presenceHanderler);
    }
  }
};
</script>
<style>
body {
  height: 100%;
}
</style>
<style lang="scss" scoped>
.root {
  height: 100%;
  overflow: hidden;
  .live-play {
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .top-tool {
    position: fixed;
    top: 0.3rem;
    right: 0.3rem;
    background-color: transparent;
    z-index: 9;
    color: #fff;
    display: flex;
    .people_num {
      background-color: rgba(255, 255, 255, 0.6);
      border-radius: 0.5rem;
      // border: 0.02rem solid #fff;
      height: 0.8rem;
      line-height: 0.8rem;
      padding: 0 0.4rem;
      letter-spacing: 0.02rem;
    }
  }
  .chart-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background: transparent;
    color: #fff;
    z-index: 9;
    .chatbox {
      // height: 100%;
      height: 80%;
      background: rgba(0, 0, 0, 0.2);
      .chat-item {
        display: flex;
        .txt_praise {
          color: #497fe6;
        }
      }
    }
    .chat-tool {
      display: flex;
      align-items: center;
      font-size: 0.5rem;
      .icon {
        // flex-grow:1
        width: 0.9rem;
        height: 0.9rem;
        line-height: 0.9rem;
        text-align: center;
        border-radius: 50%;
      }
      .exit {
        background-color: rgba(105, 16, 16, 0.8);
        margin-right: 2%;
      }
      .praise {
        background: rgba(0, 0, 0, 0.2);
        margin-right: 2%;
      }
      .gift {
        margin-right: 2%;
        background: rgb(240, 85, 34);
      }
      .input-box {
        margin-left: 1%;
        flex-grow: 2;
        display: flex;
        align-items: center;
        .icon {
          background: rgba(0, 0, 0, 0.2);
        }
        input {
          margin-left: 1%;
          font-size: 0.4rem;
          width: auto;
        }
      }
    }
  }
  .modal {
    position: absolute;
    bottom: 0;
    // display: flex;
    width: 100%;
    height: 50%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 888;
    color: #ffffff;
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 50%;
    }
    .title {
      width: 100%;
      padding-left: 0.4rem 0 0 0.4rem;
    }
    .member-list {
      .item {
        display: flex;
        align-items: center;
        margin: 0.2rem 0;
        img {
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 50%;
          margin-right: 0.3rem;
        }
      }
    }
  }
  .modal.show {
    display: block;
  }
}
</style>