<template>
  <div v-if="roomInfo" class="root">
    <live-player :src="roomInfo.livePushUrl" mode="live" autoplay @statechange="statechange" @error="error" class="live-play" />
    <div class="chart-container">
      <scroll-view :scroll-into-view="toView" enable-flex="true" scroll-y="true" class="chatbox" v-if="isMP">
        <div class="top">欢迎您进入直播间</div>
        <!-- <chatItem v-for="(item,index) in ChatHistory" :key="index" :chatdata="item" :desc="desc_obj" :chatRoomInfo="chatRoomInfo"></chatItem> -->
        <div class="chat-item" v-for="(item,index) in ChatHistory" :key="index" :id="item.mid">
            <div>{{item.ext.nickName}}：</div>
            <!-- <chatMsg :msgData="item"></chatMsg> -->
            <span class="txt_praise" v-if="item.msg.type=='chatroom_praise'">给主播点了{{item.msg.customExts.num}}个赞</span>
            <div v-else>
              <chatMsg v-for="(item,index2) in item.msg.data" :key="index2" :msgdata="item"></chatMsg>
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
          <input placeholder="说点什么...">
        </div>
        <i class="icon exit">&#xe609;</i>
        <i class="icon praise">&#xe619;</i>
        <i class="icon gift">&#xe651;</i>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import WebIM from "@/utils/hx/WebIM";
import msgStorage from "@/pages/service/msgstorage";
import msgType from "@/pages/service/msgtype";
import scrollContainer from '@/pages/service/scrollcontainer'
import utils from "@/utils/index.js";
import chatItem from "@/pages/service/chat-item";
import chatMsg from "@/pages/service/chat-msg";

export default {
  data() {
    return {
      roomInfo: null,
      toView:"",
      ChatHistory:[],
    };
  },
  components:{
      scrollContainer,
      chatItem,
      chatMsg
  },
  computed: {
    ...mapState({
      UserInfo: state => state.User.UserInfo
    }),
    sessionKey(){
      if(this.roomInfo&&this.roomInfo.id)
        return this.roomInfo.id + WebIM.conn.context.userId;
      else
        return "";
    }
  },
  methods: {
    statechange(e) {
      console.log("live-player code:", e);
    },
    error(e) {
      console.error("live-player error:", e);
    },
    readMsg(renderableMsg, type, currentChatMsg, sessionKey, isNew) {
      // console.log(renderableMsg,currentChatMsg)
      if(renderableMsg)
        this.ChatHistory = this.ChatHistory.concat(renderableMsg);
      else if(currentChatMsg)
        this.ChatHistory =  currentChatMsg;
      
      this.toView = this.ChatHistory[this.ChatHistory.length - 1].mid;
    },
  },
  async mounted() {
    var that = this;
    if (this.$route.query.roomId) {
      var res = await this.$ShoppingAPI.AppServer_LiveRoomsDetail(this.$route.query.roomId);
      if (res) {
        this.roomInfo = res.data;

        var chatMsg = utils.getItem(this.sessionKey);
        this.readMsg(null, null, chatMsg, this.sessionKey);
      }
      this.EmojiObj2 = WebIM.EmojiObj2;
      msgStorage.on("newChatMsg", (renderableMsg,type,curChatMsg,sesskey)=> 
      {
        // console.log("newChatMsg:",renderableMsg, curChatMsg)
        // 判断是否属于聊天室消息
        if (this.roomInfo.id && sesskey == that.sessionKey) {
          if (
            renderableMsg.info.from == this.roomInfo.id ||
            renderableMsg.info.to == this.roomInfo.id
          ) {
            //群消息或者群成员发出的消息
            that.readMsg(renderableMsg, type, curChatMsg, sesskey, true);
          } else if (
            renderableMsg.info.from == WebIM.conn.context.userId ||
            renderableMsg.info.to == WebIM.conn.context.userId
          ) {
            //我发的消息或者别人发给我的消息
            that.readMsg(renderableMsg, type, curChatMsg, sesskey);
          }
        }
      });

      msgStorage.on('newCustomMessage',(msg)=>{
            // that.readMsg(renderableMsg, type, curChatMsg, sesskey);
            switch(msg.customEvent)
            {
              case "chatroom_praise":{
                var renderableMsg = {
                  info: {
                    from: msg.from,
                    to: msg.to
                  },
                  username: msg.from == WebIM.conn.context.userId ? msg.to : msg.from,
                  yourname: msg.from,
                  msg: {
                    type: msg.customEvent,
                    customExts:msg.customExts,
                    customEvent:msg.customEvent,
                    ext: msg.ext
                  },
                  ext:msg.ext,
                  time: msg.time,
                  mid: msg.customEvent + msg.id,
                  chatType: msg.contentsType,
                };
                var memberInfo =  this.roomInfo.affiliations.find(item=>{
                  return item.member==msg.from||item.owner==msg.from
                });
                if(memberInfo)
                {
                  renderableMsg.ext.nickName = memberInfo.UserName;
                }
                // this.ChatHistory.push(renderableMsg);
                //我发的消息或者别人发给我的消息
                that.readMsg(renderableMsg, msg.customEvent, null, this.sesskey);
                // console.log(this.ChatHistory)
                break
              }
              case "chatroom_gift":{
                break;
              }
              default : break;
            }

      });

      msgStorage.on('onPresence',(msg)=>{
        switch(msg.type){
          case 'rmChatRoomMute':
            // 解除聊天室一键禁言
            break;
          case 'muteChatRoom':
            // 聊天室一键禁言
            break;
          case 'rmUserFromChatRoomWhiteList':
            // 删除聊天室白名单成员
            break;
          case 'addUserToChatRoomWhiteList':
            // 增加聊天室白名单成员
            break;
          case 'deleteFile':
            // 删除聊天室文件
            break;
          case 'uploadFile':
            // 上传聊天室文件
            break;
          case 'deleteAnnouncement':
            // 删除聊天室公告
            break;
          case 'updateAnnouncement':
            // 更新聊天室公告
            break;
          case 'removeMute':
            // 解除禁言
            break;
          case 'addMute':
            // 禁言
            break;
          case 'removeAdmin':
            // 移除管理员
            break;
          case 'addAdmin':
            // 添加管理员
            break;
          case 'changeOwner':
            // 转让聊天室
            break;
          case 'leaveChatRoom':
            // 退出聊天室
            break;
          case 'memberJoinChatRoomSuccess':
            // 加入聊天室
            {
                var memberInfo =  this.roomInfo.affiliations.find(item=>{
                  return item.member==msg.from||item.owner==msg.from
                });
                if(!memberInfo)
                {
                   this.roomInfo.affiliations.push({
                    Portrait: msg.customExts.avatar,
                    UserName: msg.customExts.nick,
                    member:  msg.from,
                    owner: null,
                   })
                }
              break;
            }
          case 'leave':
            // 退出群
            break;
          case 'join':
            // 加入群
            break;
          default:
            break;
        }
      });

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
    .chatbox{
      // height: 100%;
      height: 80%;
      background: rgba(0, 0, 0, 0.2);
      .chat-item{
        display: flex;
        .txt_praise{
            color:#497fe6;
        }
      }
    }
    .chat-tool{
      display: flex;
      align-items:center;
      font-size: 0.5rem;
      .icon{
        // flex-grow:1
        width: 0.9rem;
        height: 0.9rem;
        line-height: 0.9rem;
        text-align: center;
        border-radius: 50%;
      }
      .exit{
        background-color: rgba(105,16,16,.8);
        margin-right: 2%;
      }
      .praise{
        background: rgba(0, 0, 0, 0.2);
        margin-right: 2%;
      }
      .gift{
        margin-right: 2%;
        background: rgb(240, 85, 34);
      }
      .input-box{
        margin-left: 1%;
        flex-grow:2;
        display: flex;
        align-items:center;
        .icon{
          background: rgba(0, 0, 0, 0.2);
        }
        input{
          margin-left: 1%;
          font-size: 0.4rem;
          width: auto;
        }
      }
    }

  }
}
</style>