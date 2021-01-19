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
      <div class="mask" v-if="!Logined" :class="!Logined" @click="login_dialog=true"></div>
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
            <span>{{item.ext.nickName}}</span>进入直播间
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
        <i class="icon goods" hover-class="goods-hover" @click="showgoods=true;">&#xe639;</i>
        <i class="icon praise" hover-class="goods-hover" @click="giveLike">&#xe619;</i>
        <i class="icon gift" @click="showGift=true">&#xe651;</i>
      </div>
    </div>
    <div class="float-goods" v-if="floatingGoods&&showFloating">
      <div class="top">
        <i class="icon recommend">&#xe655;</i>
        <span class="txt">店铺明星产品</span>
        <i class="icon" @click="showFloating=false">&#xe613;</i>
      </div>
      <div class="body" @click="go({path:'/pages/shop/detail',query:{gId:floatingGoods.gId,sId:floatingGoods.sId,sName:floatingGoods.sName}})">
        <img :src="floatingGoods.Images.length>0?floatingGoods.Images[0].Thumbnail_url:''" />
        <span class="name">{{floatingGoods.gName}}</span>
        <span class="txt">推荐</span>
      </div>
      <div class="bottom" @click="go({path:'/pages/shop/detail',query:{gId:floatingGoods.gId,sId:floatingGoods.sId,sName:floatingGoods.sName}})">
        <div class="price">
          ￥<span class="txt">{{floatingGoods.Price}}</span>
        </div>
        <i class="icon">&#xe601;</i>
      </div>
    </div>
    <div class="modal" v-show="showMember">
      <div class="mask" @click.stop="showMember=false"></div>
      <div class="modal-wrap">
        <span class="title">观众</span>
        <scroll-view scroll-y="true" enable-flex="true" class="member-list">
          <div class="item" v-for="(item,index) in roomInfo.affiliations" :key="index">
            <img :src="item.Portrait" />
            <span>{{item.UserName}}</span>
            <span class="owner" v-if="item.owner">主播</span>
          </div>
        </scroll-view>
      </div>
    </div>
    <div class="modal" v-show="showGift">
      <div class="mask" @click.stop="showGift=false"></div>
      <div class="modal-wrap">
        <span class="title">
          <span class="txt">礼物</span>
          <span class="close icon" @click="showGift=false">&#xe613;</span>
        </span>
        <scroll-view class="gift-list" enable-flex="true" scroll-y="true">
          <div class="item" :class="{action:item.giftId==selectGift.giftId}" v-for="(item,index) in giftList" :key="index" @click="selectGift=item">
            <img :src="item.giftUrl" />
            <div class="giftname">{{item.giftName}}</div>
            <div>{{item.giftPoints}}U币</div>
          </div>
        </scroll-view>
        <div class="bottom-box">
          <span class="txt">
            <img src="../../../static/img/ub.png" />
            <span class="points">{{livePoints}}</span>
            <span class="pay" @click="buy_dialog=true;showGift=false;getBalance();">充值 〉</span>
          </span>
          <button @click="sendGiftMsg(1);showGift=false;">赠送</button>
        </div>
      </div>
    </div>
    <div class="uj_dialog" v-show="dialog">
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
    <div class="uj_dialog" v-show="login_dialog">
      <div class="mask" @click="login_dialog=false"></div>
      <div class="dialog_wrapper bottom" @click="login_dialog=false">
        <div class="dialog bg_grey" @click.stop>
          <div class="dialog_wrapper_body">
            <div class="loginbox">
              <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信一键登录</button>
              <button @click="go({path:'/pages/index/index',query:{redirect:redirect,mode:'PWD'}})">U建账号登录</button>
              <button class="cancel" @click="login_dialog=false">取消</button>
            </div>
          </div>
          <div class="dialog_wrapper_bottom"></div>
        </div>
      </div>
    </div>
    <div class="uj_dialog" v-show="buy_dialog">
      <div class="mask" @click="buy_dialog=false"></div>
      <div class="dialog_wrapper bottom" @click="buy_dialog=false">
        <div class="dialog bg_grey" @click.stop>
          <div class="dialog_wrapper_body">
            <div class="buybox">
              <div class="points_show">
                <span>我的U币：</span>
                <img src="../../../static/img/ub.png" />
                <span class="points">{{livePoints}}</span>
              </div>
              <ul class="buy_package">
                <li class="item" v-for="(item,index) in buyPackage" :key="index" @click="selectPackage=item;">
                  <div class="package_points">
                    <img src="../../../static/img/ub.png" />
                    <span class="txt">{{item.points}}</span>
                  </div>
                  <div class="package_price">￥{{item.price}}</div>
                </li>
              </ul>
              <p class="tip">
                充值代表已阅读并同意
                <span>《用户充值协议》</span>
              </p>
            </div>
          </div>
          <div class="dialog_wrapper_bottom"></div>
        </div>
      </div>
    </div>
    <div class="uj_dialog" v-show="selectPackage">
      <div class="mask" @click="selectPackage=null"></div>
      <div class="dialog_wrapper bottom" @click="selectPackage=null">
        <div class="dialog bg_grey" @click.stop>
          <div class="dialog_wrapper_body">
            <div class="head">
              <span class="close icon" @click="selectPackage=null">&#xe613;</span>
            </div>
            <div class="paybox" v-if="selectPackage">
              <div class="packageInfo">
                <p class="price">
                  <span class="unit">￥</span>
                  <span class="value">{{selectPackage.price}}</span>
                </p>
                <p class="points">{{selectPackage.points}}U币</p>
              </div>
              <div class="select" @click="paymode=1">
                <img src="../../../static/img/logo108.png" />
                <span class="txt">
                  U建钱包支付
                  <small>(钱包余额￥{{Balance}})</small>
                </span>
                <i class="icon" :class="{selected:paymode==1}">&#xe8e7;</i>
              </div>
              <div class="select" @click="paymode=2">
                <img src="../../../static/img/wxpay.png" />
                <span class="txt">微信支付</span>
                <i class="icon" :class="{selected:paymode==2}">&#xe8e7;</i>
              </div>
              <button class="confirm" @click="payPackage">确认付款</button>
            </div>
          </div>
          <div class="dialog_wrapper_bottom"></div>
        </div>
      </div>
    </div>
    <div class="uj_dialog" v-show="showgoods&&shopGoods">
      <div class="mask" @click="showgoods=false"></div>
      <div class="dialog_wrapper bottom" @click="showgoods=false;">
        <div class="dialog bg_grey" @click.stop>
          <div class="dialog_wrapper_body">
            <scroll-view scroll-y="true" class="goodsbox" v-if="isMP">
              <div class="item" v-for="(item,index) in shopGoods" :key="index">
                <img :src="item.Images.length>0?item.Images[0].Thumbnail_url:''"/>
                <div class="info">
                  <span class="name">{{item.gName}}</span>
                  <span class="price">
                    ￥<span class="txt">{{item.Price}}</span>
                  </span>
                  <span class="btn" @click="go({path:'/pages/shop/detail',query:{gId:item.gId,sId:item.sId,sName:item.sName}})">去购买</span>
                </div>
              </div>
            </scroll-view>
          </div>
          <div class="dialog_wrapper_bottom"></div>
        </div>
      </div>
    </div>
    <vaildCodeBox :openModal="openVaildCode" @close="openVaildCode=false" v-if="selectPackage" :price="selectPackage.price" :inputBefore="codeBefore" :inputComplete="codeComplete"></vaildCodeBox>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import WebIM from "@/utils/hx/WebIM";
import msgStorage from "@/pages/service/msgstorage";
import disp from "../../utils/hx/broadcast";
import msgType from "@/pages/service/msgtype";
import scrollContainer from "@/pages/service/scrollcontainer";
import utils from "@/utils/index.js";
import chatItem from "@/pages/service/chat-item";
import chatMsg from "@/pages/service/chat-msg";
import vaildCodeBox from "../../components/validCodeBox";

export default {
  data() {
    return {
      roomId: "",
      roomInfo: null,
      toView: "",
      ChatHistory: [],
      giftList: [],
      textMsg: "",
      selectGift: {},
      livePoints: 0,
      giftCount: 0,
      praiseCount: 0,
      followCount: 0,
      isFollow: false,
      showMember: false,
      showGift: false,
      dialog: false,
      joined: false,
      login_dialog: false,
      buy_dialog: false,
      buyPackage: [
        {
          points: "10",
          price: "1.00"
        },
        {
          points: "20",
          price: "2.00"
        },
        {
          points: "30",
          price: "3.00"
        },
        {
          points: "100",
          price: "10.00"
        },
        {
          points: "200",
          price: "20.00"
        },
        {
          points: "300",
          price: "30.00"
        }
      ],
      selectPackage: null,
      paymode: 2,
      openVaildCode: false,
      Balance: 0,
      shopGoods:null,
      showgoods:false,
      showFloating:true,
    };
  },
  components: {
    scrollContainer,
    chatItem,
    chatMsg,
    vaildCodeBox
  },
  computed: {
    ...mapState({
      UserInfo: state => state.User.UserInfo
    }),
    ...mapGetters(["Logined"]),
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
    },
    redirect() {
      var url = `/pages/live/room`; //当前页面url
      let encodeparms = encodeURIComponent(`?roomId=${this.roomId}`);
      url = url + encodeparms;
      return url;
    },
    floatingGoods(){
      if(this.shopGoods==null||this.shopGoods.length==0)
      {
        return
      }else
      {
        return this.shopGoods.find(item=>{
           return item.liveModel.isFloating
        })
      }
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
        customExts: { num: "1" },
        ext: { nickName: this.UserInfo.UserName },
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
        customExts: { id: self.selectGift.giftId, num: giftNum.toString() },
        params: { id: self.selectGift.giftId, num: giftNum.toString() },
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
                num: giftNum.toString(),
                giftName: self.selectGift.giftName
              }
            },
            ext: msg.body.ext,
            time: msg.body.time,
            mid: msg.body.customEvent + msg.id,
            chatType: msg.body.contentsType
          };
          self.readMsg(renderableMsg, msg.body.customEvent, null, this.sesskey);
          self.giftCount = self.giftCount + giftNum;
          self.$ShoppingAPI.AppServer_GetPoints().then(response => {
            if (response.ret == 0 && response.data) {
              self.livePoints = response.data;
            }
          });
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
          that.praiseCount = that.praiseCount + parseInt(msg.customExts.num);
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
          that.giftCount = that.giftCount + parseInt(msg.customExts.num);

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
          if (msg.from == this.roomInfo.owner) {
            //直播间拥有者用户退出,认为是关闭直播间
            that.modal({
              content: "直播已结束",
              showCancel: false,
              confirm: () => {
                that.$router.back();
              },
              cancel: () => {
                that.$router.back();
              },
              confirmText: "返回"
            });
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
      // that.EmojiObj2 = WebIM.EmojiObj2; //表情包

      if (this.roomId && !this.joined) {
        WebIM.conn.joinChatRoom({
          roomId: that.roomId,
          success: async r => {
            console.log("加入直播间成功", r);

            let id = WebIM.conn.getUniqueId();
            var msg = new WebIM.message("custom", id);
            msg.set({
              to: that.roomId,
              roomType: true,
              customEvent: "chatroom_member_join",
              customExts: { nick: that.UserInfo.UserName, avatar: that.UserInfo.Portrait },
              success: () => {
                console.log("send member join message Success", msg);
              },
              fail: function() {}
            });
            msg.setGroup("groupchat");
            WebIM.conn.send(msg.body);

            var res = await that.$ShoppingAPI.AppServer_LiveRoomsDetail(that.roomId);
            if (res.ret == 0 && res.data) {
              that.roomInfo = res.data;
              that.joined = true;
              that.$ShoppingAPI.AppServer_GetGiftList().then(response => {
                if (response.ret == 0 && response.data) {
                  that.giftList = response.data;
                }
              });
              //当前关注人数
              that.$ShoppingAPI.AppServer_MyFollowCount(that.roomInfo.owner).then(res => {
                if (res.ret == 0 && res.data) {
                  that.followCount = res.data;
                }
              });
              //服务端保存加入人信息
              that.$ShoppingAPI.AppServer_JoinRoom(that.UserInfo.UserName, that.UserInfo.Portrait);
              //积分
              that.$ShoppingAPI.AppServer_GetPoints().then(response => {
                if (response.ret == 0 && response.data) {
                  that.livePoints = response.data;
                }
              });

              //当前用户是否关注
              that.$ShoppingAPI.AppServer_IsFollow(that.roomInfo.owner).then(res => {
                if (res.ret == 0 && res.data) {
                  that.isFollow = res.data;
                }
              });

              that.getGoods();
            }
          },
          error(msg) {
            console.log("加入直播间失败", msg);
            //加入直播间失败,认为是直播间已关闭或已结束
            that.modal({
              content: "直播间不存在",
              showCancel: false,
              confirm: () => {
                that.$router.back();
              },
              cancel: () => {
                that.$router.back();
              },
              confirmText: "返回"
            });
          }
        });
      }
    },
    //环信命令消息处理
    cmdMsgHanderler(msg) {
      var that = this;
      try {
        let msgData = JSON.parse(msg.action);
        if (msgData.action) {
          switch (msgData.action) {
            case "UpdatePraiseAndGiftCount": {
              msgData.data = JSON.parse(msgData.data);
              that.giftCount = parseInt(msgData.data.gift);
              that.praiseCount = parseInt(msgData.data.praise);
              break;
            }
            case "UpdateHangingGoodsState":{
              console.log("cmdMsgHanderler", msg.action);
              that.getGoods();
            }
            default: {
              break;
            }
          }
        }
      } catch (ex) {
        console.log("cmdMsgHanderler error:", ex);
      }
    },
    //取消关注
    unFollow() {
      this.$ShoppingAPI.AppServer_Follow(this.roomInfo.owner).then(res => {
        if (res.ret == 0 && res.data) {
          this.followCount--;
          this.isFollow = false;
        }
      });
    },
    //关注
    follow() {
      this.$ShoppingAPI.AppServer_Follow(this.roomInfo.owner).then(res => {
        if (res.ret == 0 && res.data) {
          this.followCount++;
          this.isFollow = true;
        }
      });
    },
    //获取微信用户手机号
    getPhoneNumber(e) {
      var that = this;
      if (e.mp.detail.errMsg == "getPhoneNumber:ok") {
        that.$ShoppingAPI
          .Account_wxAESDecrypt({
            encryptedData: e.mp.detail.encryptedData,
            iv: e.mp.detail.iv,
            session_key: that.UserInfo.session_key
          })
          .then(res => {
            if (res.ret == 0) {
              var msg = JSON.parse(res.data);
              console.log(msg);
              var _u = { Phone: msg.phoneNumber, ...that.UserInfo };
              that.$store.commit("SetUserInfo", _u);
              this.$router.push({ path: "/pages/index/index", query: { redirect: this.redirect } });
            } else {
              //解密失败
            }
          });
      } else {
        that.toast("拒绝授权访问用户信息,将无法继续下一步");
      }
    },
    //购买U币套餐
    payPackage() {
      var that = this;
      if (this.selectPackage == null) return;
      if (this.paymode == 1) {
        //U建支付
        this.openVaildCode = true;
      } else if (this.paymode == 2) {
        //微信支付
        this.$MoneyAPI.Recharge_RechargeWX_Json(this.UserInfo.UserId, this.selectPackage.price, this.UserInfo.openid).then(rep => {
          if (rep) {
            // var payData = JSON.parse(rep);
            var payData = {
              timeStamp: rep.timeStamp,
              nonceStr: rep.nonceStr,
              package: rep.package,
              signType: rep.signType,
              paySign: rep.paySign,
              success(res) {
                //弹出提示框
                that.toast("支付成功,请稍后查看U币");
                that.selectPackage = null;
                //更新积分
                that.$ShoppingAPI.AppServer_GetPoints().then(response => {
                  if (response.ret == 0 && response.data) {
                    that.livePoints = response.data;
                  }
                });
              },
              fail(res) {
                console.log(res);
                if (res && res.errMsg == "requestPayment:fail cancel") {
                } else {
                  that.toast("支付失败" && res.errMsg && res.err_desc);
                }
              }
            };
            console.log(payData);
            wx.requestPayment(payData);
          } else {
            that.toast("请求支付失败");
          }
        });
      }
    },
    //打开验证码框,发送验证短信请求
    async codeBefore() {
      console.log("codeBefore");
      var res = await this.$ShoppingAPI.Order_ValidationCode();
      if (res.ret == 0) {
        return true;
      }
    },
    //验证码输入完成,发送U币兑换请求
    async codeComplete(code) {
      console.log("codeComplete", code);
      var that = this;
      var rep = await that.$ShoppingAPI.AppServer_BuyPoints({
        money: that.selectPackage.price,
        VerificationCode: code
      });
      if (rep.ret == 0 && rep.data) {
        that.openVaildCode = false;
        that.selectPackage = null;
        //更新积分
        that.$ShoppingAPI.AppServer_GetPoints().then(response => {
          if (response.ret == 0 && response.data) {
            that.livePoints = response.data;
          }
        });
        return true;
      } else {
        that.toast(ret.msg);
        return false;
      }
    },
    //获取U建钱包余额
    getBalance() {
      this.$UJAPI.Balance_Purse().then(rep => {
        this.Balance = rep.data;
      });
    },
    //获取商品列表
    getGoods(){
      var that =  this;
        if(this.roomInfo&&this.roomInfo.sId)
        {
          //获取店铺商品
          this.$ShoppingAPI.AppServer_Follow(this.roomInfo.sId).then(rep3=>{
            if (rep3.ret == 0) {
              that.shopGoods = rep3.data;
              that.showFloating = true;
            }
          })
        }
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
  onShareAppMessage(result) {
    let title = `【${this.roomInfo.name}】正在直播中`;
    let path = `/pages/live/room?roomId=${this.roomId}`;
    let imageUrl = this.roomInfo.cover;
    return {
      title,
      path,
      imageUrl
    };
  },
  mounted() {
    var that = this;
    if (this.$route.query.roomId) {
      this.roomId = this.$route.query.roomId;
    }
    console.log(this.Logined);
    this.wx_login(() => {
      // if (!this.$store.getters.Logined) {
      //   this.modal({
      //     title: "未登录",
      //     content: "请您登录后使用直播功能",
      //     confirm: () => {
      //       that.$router.push({ path: `/pages/index/index`, query: { back: 1 } });
      //     },
      //     confirmText: "去登录"
      //   });
      // }else
      if (WebIM.conn.isOpened()) {
        if (!this.joined) this.initHanderler();
      } else if (!this.Logined) {
        that.$ShoppingAPI.AppServer_LiveRoomsDetail(that.roomId).then(res => {
          if (res.ret == 0 && res.data) {
            that.roomInfo = res.data;
            that.$ShoppingAPI.AppServer_GetGiftList().then(response => {
              if (response.ret == 0 && response.data) {
                that.giftList = response.data;
              }
            });
            //当前关注人数
            that.$ShoppingAPI.AppServer_MyFollowCount(that.roomInfo.owner).then(res => {
              if (res.ret == 0 && res.data) {
                that.followCount = res.data;
              }
            });
          }
        });
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
    z-index: 3;
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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
    background: #fff;
    color: #000;
    z-index: 3;
    .mask {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 4;
    }
    .chatbox {
      // height: 100%;
      height: 80%;
      // background: rgba(0,0,0,0.2);
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
      height: 20%;
      color: #fff;
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
        background: rgba(0, 0, 0, 0.4);
        margin-right: 2%;
      }
      .gift {
        margin-right: 2%;
        background: rgb(240, 85, 34);
      }
      .goods {
        margin-right: 2%;
        color: #fff;
        background: #ff74af;
      }
      .goods-hover{
        color: #e60000;
        background: rgba(0, 0, 0, 0.4);
      }
      .input-box {
        margin-left: 1%;
        flex-grow: 2;
        display: flex;
        align-items: center;
        .icon {
          background: rgba(0, 0, 0, 0.4);
        }
        input {
          margin-left: 1%;
          font-size: 0.4rem;
          width: auto;
          color:#000;
        }
      }
    }
  }
  .float-goods{
    padding: 0.24rem;
    background-color: #f7f0fa;
    position: fixed;
    right: 0.31rem;
    bottom: 2rem;
    z-index: 4;
    border-radius: 0.13rem;
    .top{
      display: flex;
      align-items: center;
      margin-bottom: 0.29rem;
      font-size: 0.29rem;
      .icon{
        width:0.36rem;
        height: 0.36rem;
        line-height: 0.36rem;
        text-align: center;
        flex-shrink:0;
        color: #a49baf;
      }
      .icon.recommend{
        background-color:#7b33dd ;
        color: #fcfaff;
        font-size: 0.19rem;
        border-radius: 50%;
      }
      .txt{
        color: #7b33dd;
        width: 100%;
        flex-grow:1;
        font-size: 0.29rem;
        margin-left: 0.06rem;
      }
    }
    .body{
      position: relative;
      margin-bottom: 0.22rem;
      img{
        width: 2.9rem;
        height: 2.63rem;
        border-radius: 0.1rem;
      }
      .txt{
        width: 1rem;
        height: 0.54rem;
        border-radius: 0.2rem 0 0.2rem 0;
        text-align: center;
        background-color: #c519f1;
        color: #fff;
        position:absolute;
        top: -0.16rem;
        left: 0;
        font-size: 0.33rem;
      }
      .name{
        width: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        color: #fff;
        font-size: 0.34rem;
        position: absolute;
        bottom: 0;
        left: 0;
        line-height: 0.64rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-indent:0.14rem;
        border-radius:0 0 0.1rem 0.1rem;
      }
    }
    .bottom{
      color: #fe2b54;
      display: flex;
      align-items: center;
      .price{
        flex-grow:1;
        font-size: 0.33rem;
        .txt{
          font-size: 0.43rem;
        }
      }
      .icon{
        width: 0.56rem;
        height: 0.55rem;
        line-height: 0.55rem;
        text-align: center;
        font-size: 0.3;
        flex-shrink:0;
        border-radius: 50%;
        color: #fff;
        background-color: #fe2b54;
      }
    }
  }
  .modal {
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9;
      background: rgba(0, 0, 0, 0.6);
    }
    .modal-wrap {
      // display: flex;
      // align-items: center;
      // flex-direction: column;
      // justify-content: center;
      width: 100%;
      height: 50%;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 10;
      background: rgba(22, 24, 36, 1);
      color: #ffffff;
      overflow: hidden;
    }
    .title {
      width: 100%;
      margin: 0.2rem 0.51rem;
      display: block;
      .txt {
        margin-left: 0.3rem;
      }
      .close {
        float: right;
        position: absolute;
        right: 0.51rem;
      }
    }
    .member-list {
      height: 89%;
      display: flex;
      flex-direction: column;

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
        span {
          margin-right: 0.5rem;
        }
        span.owner {
          background-color: #2cacfc;
          border-radius: 0.4rem;
          padding: 0 0.4rem;
          height: 0.8rem;
          line-height: 0.8rem;
        }
      }
    }
    .gift-list {
      flex-grow: 1;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-left: 0.3rem;
      height: 71%;
      .item {
        // margin: 0.1rem 0.36rem;
        padding: 0.2rem 0.42rem 0.2rem 0.42rem;
        text-align: center;
        border: solid 0.04rem transparent;
        border-radius: 0.4rem;
        font-size: 0.28rem;
        .giftname {
          font-size: 0.36rem;
        }
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
      padding: 0.21rem 0;
      width: 100%;
      .txt {
        margin-left: 0.5rem;
        img {
          width: 0.55rem;
          height: 0.55rem;
          display: inline-block;
          margin-right: 0.3rem;
        }
        .points {
          margin-right: 0.5rem;
        }
        .pay {
          font-size: 0.4rem;
          color: #ffd215;
        }
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
  .uj_dialog {
    .mask {
      position: fixed;
      z-index: 10;
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
      z-index: 10;
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
      .dialog {
        background-color: #fff;
        text-align: center;
        border-radius: 5%;
        overflow: hidden;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-flex-direction: column;
        flex-direction: column;
        max-height: 12.49rem;
        .dialog_wrapper_head {
          padding: 0.3rem;
        }
        .dialog_wrapper_body {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          font-size: 0.4rem;
          overflow-wrap: break-word;
          -webkit-hyphens: auto;
          hyphens: auto;
          color: rgba(0, 0, 0, 0.5);
        }
      }
    }
    .dialog_wrapper.bottom {
      align-items: flex-end;
      .dialog {
        width: 100%;
        border-radius: 0.24rem 0.24rem 0 0;
      }
    }
  }
  .dialog {
    .userinfo {
      margin: 0 0.4rem;
      img.logo {
        width: 2.3rem;
        height: 2.3rem;
        border-radius: 50%;
      }
      .txt_name {
        font-size: 0.6rem;
      }
      .txt_statistics {
        padding-left: 0.3rem;
        span {
          margin-right: 0.3rem;
        }
      }
      button {
        margin-top: 0.3rem;
        font-size: 0.4rem;
        width: 3rem;
        border-radius: 0.4rem;
        line-height: 0.8rem;
        color: #fff;
        background-color: #717070;
        margin-bottom: 0.5rem;
      }
      button.action {
        background-color: #12b7f5;
      }
    }
    .loginbox {
      font-size: 0.6rem;
      button {
        padding: 0.5rem 0;
        width: 100%;
        text-align: center;
      }
      button.cancel {
        border-top: 0.3rem solid #dddddd;
      }
    }
    .buybox {
      .points_show {
        color: #000;
        font-size: 0.42rem;
        margin: 0.56rem 0 0.53rem 0.62rem;
        text-align: left;
        display: flex;
        align-items: center;
        > span,
        > img {
          line-height: 0.55rem;
        }
        img {
          width: 0.55rem;
          height: 0.55rem;
          display: inline-block;
          margin: 0 0.18rem;
        }
      }
      .buy_package {
        border-top: 0.02rem solid #dddddd;
        padding: 0.48rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: space-around;
        height: 5.55rem;
        .item {
          width: 3.11rem;
          height: 1.91rem;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          background-color: #f8f8f8;
          border-radius: 0.2rem;
          .package_points {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 0.22rem;
            img {
              width: 0.42rem;
              height: 0.42rem;
              display: inline-block;
              margin: 0 0.18rem;
            }
            .txt {
              font-size: 0.5rem;
              color: #000;
            }
          }
          .package_price {
            font-size: 0.31rem;
            color: #808080;
          }
        }
      }
      .tip {
        margin-bottom: 1.06rem;
        font-size: 0.3rem;
        color: #808080;
        span {
          color: #15aaff;
        }
      }
    }
    .head {
      width: 100%;
      text-align: right;
      display: block;
      .close {
        padding: 0.27rem 0.56rem 0 0;
        display: inline-block;
        color: #000;
        font-size: 0.5rem;
      }
    }

    .paybox {
      .packageInfo {
        margin: 0.8rem 0.51rem 0.51rem;
        padding-bottom: 0.91rem;
        border-bottom: 0.03rem solid #e3e3e3;
        .price {
          color: #000;
          .unit {
            font-size: 0.55rem;
          }
          .value {
            font-size: 1rem;
          }
        }
        .points {
          margin-top: 0.34rem;
          font-size: 0.38rem;
          color: #808080;
        }
      }
      .select {
        display: flex;
        align-items: center;
        padding: 0.64rem 0.5rem;
        img {
          width: 0.62rem;
          height: 0.62rem;
        }
        .txt {
          font-size: 0.38rem;
          color: #1a1a1a;
          flex-grow: 1;
          display: flex;
          align-items: center;
          margin-left: 0.41rem;
          small {
            font-size: 0.35rem;
            color: #666666;
          }
        }
        i {
          font-size: 0.62rem;
          color: #e2e2e2;
        }
        .selected {
          color: #00a8ec;
        }
      }
      .confirm {
        margin: 0 auto;
        margin-top: 0.7rem;
        margin-bottom: 0.6rem;
        font-size: 0.6rem;
        width: 9.85rem;
        height: 1.3rem;
        line-height: 1.3rem;
        color: #fff;
        background-color: #00a8ec;
        border-radius: 0.65rem;
      }
    }
    .goodsbox{
      padding-bottom: 0.47rem;
      .item{
        display: flex;
        margin: 0.47rem 0.38rem 0 0.36rem;
        img{
          width: 2.64rem;
          height: 2.65rem;
          flex-shrink:0;
          border-radius: 0.13rem;
        }
        .info{
          margin-top: 0.11rem;
          margin-left: 0.51rem;
          position: relative;
          flex-grow:1;
          text-align: left;
          .name{
            font-size: 0.41rem;
            color: #1a1a1a;
            display: block;
            margin-bottom: 1.2rem;
          }
          .price{
            font-size: 0.5rem;
            color: #ff2120;
            .txt{
              font-size: 0.63rem;
            }
          }
          .btn{
            position: absolute;
            top:1.6rem;
            right: 0;
            background-color: #3fbefe;
            color: #fff;
            width: 2.13rem;
            height: 0.94rem;
            line-height:  0.94rem;
            border-radius: 0.47rem;
            text-align: center;
          }
        }
      }

    }
  }
}
</style>