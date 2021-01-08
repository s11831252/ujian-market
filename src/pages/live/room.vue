<template>
  <div v-if="roomInfo" class="root">
    <live-player :src="roomInfo.livePushUrl[0]" mode="live" autoplay @statechange="statechange" @error="error" class="live-play" />
    <ul class="otherPush">
      <li v-for="(iten,index) in otherPush" :key="index">
        <live-player :src="iten" mode="live" autoplay @statechange="statechange" @error="error" class="other-play" />
      </li>
    </ul>
    <div class="top-tool">
      <div class="room_name" @click="dialog=true">{{roomInfo.name}}</div>
      <div @click="showMember=true" class="people_num">{{roomInfo.affiliations.length}}人</div>
    </div>
    <div class="chart-container">
      <scroll-view :scroll-into-view="toView" enable-flex="true" scroll-y="true" class="chatbox" v-if="isMP">
        <div class="top">欢迎您进入直播间</div>
        <!-- <chatItem v-for="(item,index) in ChatHistory" :key="index" :chatdata="item" :desc="desc_obj" :chatRoomInfo="chatRoomInfo"></chatItem> -->
        <div class="chat-item" v-for="(item,index) in ChatHistory" :key="index" :id="item.mid">
          <!-- <chatMsg :msgData="item"></chatMsg> -->
          <span class="txt_praise" v-if="item.msg.type=='chatroom_praise'">
            <span>{{item.ext.nickName}}</span>
            给主播点了{{item.msg.customExts.num}}个赞
          </span>
          <span class="txt_joinRoom" v-else-if="item.msg.type=='chatroom_member_join'">
            <span>{{item.ext.nickName}}</span>加入直播间
          </span>
          <span class="txt_joinRoom" v-else-if="item.msg.type=='chatroom_gift'">
            收到
            <span>{{item.ext.nickName}}送出的{{item.msg.customExts.giftName}}×{{item.msg.customExts.num}}个</span>
          </span>
          <div v-else>
            <span>{{item.ext.nickName}} ：</span>
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
          <input placeholder="说点什么..." type="text" v-model="textMsg" maxlength="200" @confirm="sendMsg" confirm-type="send" fixed="true" />
        </div>
        <i class="icon exit" @click="exitLiveRoom">&#xe609;</i>
        <i class="icon praise" @click="giveLike">&#xe619;</i>
        <i class="icon gift" @click="showGift=true">&#xe651;</i>
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
    <div class="modal" v-if="showGift">
      <div class="mask" @click.stop="showGift=false"></div>
      <div class="modal-wrap">
        <span class="title">
          <span class="txt">礼物</span>
          <span class="close icon" @click="showGift=false">&#xe613;</span>
        </span>
        <scroll-view class="gift-list" scroll-into-view enable-flex="true" scroll-y="true">
          <div class="item" :class="{action:item.giftId==selectGift.giftId}" v-for="(item,index) in giftList" :key="index" @click="selectGift=item">
            <img :src="item.giftUrl" />
            <div>{{item.giftName}}</div>
            <div>{{item.giftPoints}}煎饼</div>
          </div>
        </scroll-view>
        <div class="bottom-box">
          <span class="txt">{{livePoints}}煎饼</span>
          <button @click="sendGiftMsg(1);showGift=false;">赠送</button>
        </div>
      </div>
    </div>
    <div class="uj_dialog" v-if="dialog">
      <div class="mask" @click="dialog=false"></div>
      <div class="dialog_wrapper" @click="dialog=false">
        <div class="dialog" @click.stop>
          <div class="dialog_wrapper_head"></div>
          <div class="dialog_wrapper_body">
            <div class="userinfo">
              <img class="logo" :src="roomInfo.cover" />
              <div class="txt_name">{{roomInfo.name}}</div>
              <div class="txt_statistics">
                <span>礼物{{giftCount}}</span>
                <span>粉丝{{followCount}}</span>
                <span>被赞{{praiseCount}}</span>
              </div>
              <button v-if="isFollow" @click="unFollow">取消关注</button>
              <button v-else class="action" @click="follow">关注</button>
            </div>
          </div>
          <div class="dialog_wrapper_bottom"></div>
        </div>
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
      roomId:"",
      roomInfo: null,
      toView: "",
      ChatHistory: [],
      showMember: false,
      giftList: [],
      showGift: false,
      textMsg: "",
      selectGift: {},
      livePoints: 0,
      dialog:false,
      joined:false,
      giftCount:0,
      praiseCount:0,
      followCount:0,
      isFollow:false,
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
    },
    mainPush() {
      if (this.roomInfo && this.roomInfo.livePushUrl && this.roomInfo.livePushUrl.length > 0) return this.roomInfo.livePushUrl[0];
      else return null;
    },
    otherPush() {
      if (this.roomInfo && this.roomInfo.livePushUrl && this.roomInfo.livePushUrl.length > 0) return this.roomInfo.livePushUrl.slice(1);
      // return [this.roomInfo.livePushUrl[0],this.roomInfo.livePushUrl[0]]
      else return [];
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
    readMsg(renderableMsg, type, currentChatMsg, sessionKey, msg) {
      // console.log(renderableMsg, type, currentChatMsg, sessionKey,msg)
      if (msg) {
        var memberInfo = this.roomInfo.affiliations.find(item => {
          return item.member == msg.from || item.owner == msg.from;
        });
        if (memberInfo) {
          if (renderableMsg) renderableMsg.ext.nickName = memberInfo.UserName;
        }
      }

      if (renderableMsg) this.ChatHistory.push(renderableMsg);
      // else if (currentChatMsg)
      //  this.ChatHistory = currentChatMsg;
      if (this.ChatHistory && this.ChatHistory.length > 0) this.toView = this.ChatHistory[this.ChatHistory.length - 1].mid;
    },

    //发送普通消息
    sendMsg() {
      let self = this;
      if (this.textMsg) {
        let roomId = this.roomInfo.id;
        let from = WebIM.conn.context.userId;
        let id = WebIM.conn.getUniqueId(); // 生成本地消息id
        let msg = new WebIM.message("txt", id); // 创建文本消息
        msg.set({
          msg: this.textMsg, // 消息内容
          to: roomId,
          from,
          roomType: true,
          ext: { nickName: this.UserInfo.UserName }, //扩展消息
          success: function(id, serverMsgId) {
            console.log("send private text Success", msg);
            msgStorage.saveMsg(msg, "txt");
            self.textMsg = "";
          },
          fail: function(e) {
            console.log("Send private text error", e);
          }
        });
        msg.setGroup("groupchat");
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
        customExts: { note: "点赞", num: 1 },
        params: { num: 1 },
        success: () => {
          console.log("send private text Success", msg);
          var renderableMsg = {
            info: {
              from: from,
              to: msg.body.to
            },
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
          self.readMsg(renderableMsg, msg.body.customEvent, null, this.sesskey);
          self.praiseCount++;
        },
        fail: function() {},
        ext: { nickName: this.UserInfo.UserName,num: 1  },
        nickName: this.UserInfo.UserName
      });
      msg.setGroup("groupchat");
      WebIM.conn.send(msg.body);
    },
    //发礼物消息
    async sendGiftMsg(giftNum) {
      let self = this;
      let roomId = this.roomInfo.id;
      let from = WebIM.conn.context.userId;
      let id = WebIM.conn.getUniqueId();
      let msg = new WebIM.message("custom", id);
      msg.set({
        to: roomId,
        roomType: true,
        customEvent: "chatroom_gift",
        customExts: { id: self.selectGift.giftId, num: giftNum },
        params: { id: self.selectGift.giftId, num: giftNum },
        success: function() {
          console.log("send private text Success", msg);
          var renderableMsg = {
            info: {
              from: msg.body.from,
              to: msg.body.to
            },
            msg: {
              type: msg.body.customEvent,
              customExts: {
                giftUrl: self.selectGift.giftUrl,
                giftId: self.selectGift.giftId,
                num: giftNum,
                giftName: self.selectGift.giftName
              }
            },
            ext: msg.body.ext,
            time: msg.body.time,
            mid: msg.body.customEvent + msg.id,
            chatType: msg.body.contentsType
          };
          self.readMsg(renderableMsg, msg.body.customEvent, null, this.sesskey);
          self.giftCount= self.giftCount+giftNum;
        },
        fail: function() {},
        ext: { nickName: self.UserInfo.UserName }
      });
      msg.setGroup("groupchat");
      var res = await this.$ShoppingAPI.AppServer_SendGift(self.roomInfo.owner, self.selectGift.giftId, giftNum);
      if (res.ret == 0 && res.data) {
        WebIM.conn.send(msg.body);
      }
    },
    // 退出直播间
    exitLiveRoom() {
      WebIM.conn.quitChatRoom({
        roomId: this.roomInfo.id,
        success: res => {
          this.$router.back();
        },
        error: e => {
          console.log("退出失败", e);
        }
      });
    },
    //处理自定义消息回调
    customMsgHanderler(msg) {
      var that = this;
      var renderableMsg = {
        info: {
          from: msg.from,
          to: msg.to
        },
        msg: {
          type: msg.customEvent,
          customExts: msg.customExts
        },
        ext: msg.ext,
        time: msg.time,
        mid: msg.customEvent + msg.id,
        chatType: msg.contentsType
      };
      switch (msg.customEvent) {
        case "chatroom_praise": {
          renderableMsg.msg = {
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
          that.praiseCount =  that.praiseCount + parseInt(msg.customExts.num);
          that.readMsg(renderableMsg, msg.customEvent, null, this.sesskey, msg);
          break;
        }
        case "chatroom_gift": {
          renderableMsg.msg = {
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
          var gift = this.giftList.find(item => {
            return item.giftId == msg.customExts.id;
          });
          if (gift) {
            renderableMsg.msg.customExts.giftUrl = gift.giftUrl;
            renderableMsg.msg.customExts.giftId = msg.customExts.id;
            renderableMsg.msg.customExts.num = msg.customExts.num;
            renderableMsg.msg.customExts.giftName = gift.giftName;
          } else {
            //todo...
          }
          that.giftCount =  that.giftCount + parseInt(msg.customExts.num);

          that.readMsg(renderableMsg, msg.customEvent, null, this.sesskey, msg);
          break;
        }
        case "chatroom_member_join": {
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

            that.readMsg(renderableMsg, msg.customEvent, null, this.sesskey, msg);
            // console.log("chatroom_member_join", that.roomInfo.affiliations);
          }
          break;
        }
        case "chatroom_member_video_call": {
          // customExts:chatroom_member_video_call
          // video_call: "rtmp://pullStreamUrl"
          // video_call_status: "start"
          //video_call_status: "end"
          if (msg.customExts.video_call_status == "start") {
            that.$ShoppingAPI.AppServer_LiveRoomsDetail(that.$route.query.roomId).then(res => {
              if (res.ret == 0 && res.data) {
                for (let index = 0; index < res.data.livePushUrl.length; index++) {
                  const element = res.data.livePushUrl[index];
                  if (!~that.roomInfo.livePushUrl.indexOf(element)) {
                    that.roomInfo.livePushUrl.push(element);
                  }
                }
              }
            });
          } else if (msg.customExts.video_call_status == "end") {
            that.$ShoppingAPI.AppServer_LiveRoomsDetail(that.$route.query.roomId).then(res => {
              if (res.ret == 0 && res.data) {
                for (let index = 0; index < that.roomInfo.livePushUrl.length; index++) {
                  const element = that.roomInfo.livePushUrl[index];
                  let curTypeCbIdx = res.data.livePushUrl.indexOf(element);
                  if (!~curTypeCbIdx) {
                    that.roomInfo.livePushUrl.splice(curTypeCbIdx, 1);
                  }
                }
              }
            });
          }
        }
        default:
          break;
      }
    },
    //处理onPresence指令
    presenceHanderler(msg) {
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
        case "leaveChatRoom": {
          // 退出聊天室
          console.log("leaveChatRoom", that.roomInfo.affiliations);
          if(msg.from==this.roomInfo.owner)//直播间拥有者用户退出,认为是关闭直播间
          {
            that.modal({
              content:"直播已结束",
              showCancel:false,
              confirm:()=>{
                that.$router.back()
              },
              cancel:()=>{
                that.$router.back()
              },
              confirmText:"返回"
            })
          }
          var memberInfo = this.roomInfo.affiliations.find(item => {
            return item.member == msg.from;
          });
          if (memberInfo) {
            var _index = that.roomInfo.affiliations.indexOf(memberInfo);
            that.roomInfo.affiliations.splice(_index, 1);
            console.log("leaveChatRoom", that.roomInfo.affiliations);
          }
          break;
        }
        case "memberJoinChatRoomSuccess": {
          // 加入聊天室
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
    },
    //该页面特殊处理,环信连接初始化之后开始调用api
    initHanderler(msg) {
      var that = this;
      msgStorage.on("newChatMsg", that.readMsg);
      disp.on("newCustomMessage", that.customMsgHanderler);
      disp.on("onPresence", that.presenceHanderler);
      disp.on("onCmdMessage", that.cmdMsgHanderler);
      if(this.roomId&&!this.joined)
      {
        WebIM.conn.joinChatRoom({
          roomId: that.roomId,
          success: async msg => {
            console.log("加入直播间成功", msg);

            //服务端保存加入人信息
            that.$ShoppingAPI.AppServer_JoinRoom(that.UserInfo.UserName, that.UserInfo.Portrait);

            var res = await that.$ShoppingAPI.AppServer_LiveRoomsDetail(that.roomId);
            if (res.ret == 0 && res.data) {
              that.roomInfo = res.data;
              that.joined=true;
              that.$ShoppingAPI.AppServer_GetGiftList().then(response => {
                if (response.ret == 0 && response.data) {
                  that.giftList = response.data;
                }
              });

              that.$ShoppingAPI.AppServer_GetPoints().then(response => {
                if (response.ret == 0 && response.data) {
                  that.livePoints = response.data;
                }
              });

              that.$ShoppingAPI.AppServer_MyFollowCount(that.roomInfo.owner).then(res=>{
                if (res.ret == 0 && res.data) {
                  that.followCount = res.data;
                }
              })
              that.$ShoppingAPI.AppServer_IsFollow(that.roomInfo.owner).then(res=>{
                if (res.ret == 0 && res.data) {
                  that.isFollow = res.data;
                }
              })
              // var chatMsg = utils.getItem(that.sessionKey);
              // that.readMsg(null, null, chatMsg, that.sessionKey);
            }
            that.EmojiObj2 = WebIM.EmojiObj2;

          },
          error(msg) {
            console.log("加入直播间失败", msg);
          }
        });
      }

    },
    //环信命令消息处理
    cmdMsgHanderler(msg){
      var that = this;
      try{
        console.log("cmdMsgHanderler",msg.action)
        let msgData =  JSON.parse(msg.action)
        if(msgData.action)
        {
          msgData.data = JSON.parse(msgData.data)
          switch(msgData.action)
          {
            case "UpdatePraiseAndGiftCount":{
              that.giftCount =  that.giftCount + parseInt(msgData.data.gift);
              that.praiseCount = that.praiseCount + parseInt(msgData.data.praise);
              break
            }
            default:{
              break;
            }
          }
        }

      }catch(ex)
      {
        console.log("cmdMsgHanderler error:",ex)
      }
    },
    //取消关注
    unFollow(){
      this.$ShoppingAPI.AppServer_Follow(this.roomInfo.owner).then(res=>{
        if(res.ret==0&&res.data)
        {
          this.followCount--;
          this.isFollow=false;
        }
      })
    },
    //关注
    follow(){
      this.$ShoppingAPI.AppServer_Follow(this.roomInfo.owner).then(res=>{
        if(res.ret==0&&res.data)
        {
          this.followCount++;
          this.isFollow=true;
        }
      })
    }
  },
  onLoad(query) {
    // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    if (query.scene) this.roomId = decodeURIComponent(query.scene);
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  onUnload() {
    msgStorage.off("newChatMsg", this.readMsg);
    disp.off("newCustomMessage", this.customMsgHanderler);
    disp.off("onPresence", this.presenceHanderler);
    disp.off("onOpened", this.initHanderler);
    disp.off("onCmdMessage", this.cmdMsgHanderler);
    WebIM.conn.quitChatRoom({
      roomId: this.$route.query.roomId
    });
  },
  mounted() {
    var that = this;
    if (this.$route.query.roomId) {
      this.roomId=this.$route.query.roomId;
    }
      this.wx_login(() => {
        if (!this.$store.getters.Logined) {
          this.modal({
            title: "未登录",
            content: "请您登录后使用直播功能",
            confirm: () => {
              that.$router.push({ path: `/pages/index/index`, query: { back: 1 } });
            },
            confirmText: "去登录"
          });
        }else if(WebIM.conn.isOpened())
        {
          if(!this.joined)
            this.initHanderler();
        }
      });
      disp.on("onOpened", this.initHanderler);
    
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
  .otherPush {
    position: absolute;
    top: 1.4rem;
    right: 0.3rem;
    .other-play {
      width: 2.3rem;
      height: 2.5rem;
      margin-bottom: 0.4rem;
      z-index: 2;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
  .top-tool {
    position: fixed;
    top: 0.3rem;
    background-color: transparent;
    z-index: 9;
    color: #fff;
    display: flex;
    width: 100%;
    justify-content: space-between;
    .room_name {
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 0.5rem;
      height: 0.8rem;
      line-height: 0.8rem;
      padding: 0 0.4rem;
      letter-spacing: 0.02rem;
      margin-left: 0.3rem;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }
    .people_num {
      margin-right: 0.3rem;
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
    background: rgba(22, 24, 36, 1);
    z-index: 888;
    color: #ffffff;
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 50%;
    }
    .modal-wrap{
      display: flex;
      align-items: center;
      flex-direction:column;
      justify-content: center;
      height: 100%;
    }
    .title {
      width: 100%;
      margin: 0.2rem 0.51rem;
      display: block;
      .txt{
        margin-left: 0.3rem;
      }
      .close {
        float: right;
        position: absolute;
        right: 0.51rem;
      }
    }
    .member-list {
      .item {
        display: flex;
        align-items: center;
        margin: 0.2rem 0;
        margin-left: 0.3rem;
        img {
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 50%;
          margin-right: 0.3rem;
        }
      }
    }
    .gift-list {
      flex-grow:1;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-left: 0.3rem;
      .item {
        // margin: 0.1rem 0.36rem;
        padding: 0.2rem 0.42rem 0.2rem 0.42rem;
        text-align: center;
        border: solid 0.04rem transparent;
        border-radius: 0.4rem;
        img {
          width: 1.68rem;
          height: 1.65rem;
          display: block;
        }
      }
      .item.action {
        background-color: #2d1d29;
        border-color: #362536;
      }
    }
    .bottom-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.4rem;
      padding: .21rem 0;
      width:100%;
      .txt {
        margin-left: 0.5rem;
      }
      button {
        color: #fff;
        background-color: #2cacfc;
        margin: 0;
        line-height: auto;
        padding: 0.32rem 0.56rem;
        border-radius: 0.5rem;
        font-size: 0.4rem;
        margin-right: 0.34rem;
      }
    }
  }
  .modal.show {
    display: block;
  }
  .uj_dialog {
    .mask {
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
    }
    .mask {
      opacity: 1;
      transform: scale3d(1, 1, 1);
      transition: all 0.3s ease-in;
    }
    .mask.mask_hidden {
      opacity: 0;
      transform: scale3d(1, 1, 0);
    }
    .dialog_wrapper {
      position: fixed;
      z-index: 5000;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      text-align: center;
      font-size: 0;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      align-items: center;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      .dialog{
      background-color: #fff;
      text-align: center;
      border-radius: 12px;
      overflow: hidden;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-flex-direction: column;
      flex-direction: column;
      max-height: 90%;
        .dialog_wrapper_head{
          padding: 0.3rem;
        }
        .dialog_wrapper_body {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 0 0.4rem;
          font-size: 0.4rem;
          margin-bottom: 0.5rem;
          overflow-wrap: break-word;
          -webkit-hyphens: auto;
          hyphens: auto;
          color: rgba(0, 0, 0, 0.5);
        }
      }

    }
  }
  .dialog {
    .userinfo{
      img.logo{
        width: 2.3rem;
        height: 2.3rem;
        border-radius: 50%;
      }
        .txt_name{
          font-size: 0.6rem;
        }
        .txt_statistics{
          padding-left: 0.3rem;
          span{
            margin-right: 0.3rem;
          }
        }
      button{
        margin-top: 0.3rem;
        font-size: 0.4rem;
        width: 3rem;
        border-radius: 0.4rem;
        line-height: .8rem;
        color: #fff;
        background-color: #717070;
      }
      button.action{
        background-color: #12b7f5;
      }
    }
  }
}
</style>