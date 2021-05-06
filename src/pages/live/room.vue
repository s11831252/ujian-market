<template>
  <div v-if="roomInfo" class="root">
    <live-player id="myPlayer" :src="mainPull" mode="live" autoplay @fullscreenchange="fullscreenchange" class="live-play">
      <cover-view class="player-tool" v-if="fullscreen" @click="fullscreenHandler">退出全屏</cover-view>
    </live-player>
    <ul class="otherPull">
      <li v-if="PusherUrl">
        <otherPusher :url="PusherUrl"></otherPusher>
      </li>
      <li v-for="(item,index) in otherPull" :key="index" @click="changeMainPushUrl(item,index)">
        <otherPull :url="item" :members="roomInfo.affiliations"></otherPull>
      </li>
    </ul>
    <div class="top-tool" v-if="roomInfo.id">
      <div class="room_name" @click="dialog=true">{{roomInfo.name}}</div>
      <div @click="showMember=true" class="people_num">{{roomInfo.affiliations.length}}人</div>
    </div>
    <div class="chart-container">
      <div class="mask" v-if="!Logined" :class="!Logined" @click="login_dialog=true"></div>
      <div class="player-tool">
        <i class="icon" @click="fullscreenHandler">&#xe656;</i>
      </div>
      <scroll-view :scroll-into-view="toView" enable-flex="true" scroll-y="true" class="chatbox" v-if="isMP">
        <div class="top chat-item">{{welcomeMsg}}</div>
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
          <span class="txt_gift" v-else-if="item.msg.type=='chatroom_gift'">
            {{item.ext.nickName}}赠送了
            <img :src="item.msg.customExts.giftUrl" />
            {{item.msg.customExts.giftName}}×{{item.msg.customExts.num}}
          </span>
          <span class="txt_joinRoom" v-else-if="item.msg.type=='chatroom_member_video_call'&&item.msg.customExts.video_call_status=='start'">
            <span>{{item.ext.nickName}}</span>进行连麦
          </span>
          <span class="txt_joinRoom" v-else-if="item.msg.type=='chatroom_member_video_call'&&item.msg.customExts.video_call_status=='end'">
            <span>{{item.ext.nickName}}</span>结束连麦
          </span>
          <div v-else>
            <span>{{item.ext.nickName}}:</span>
            <chatMsg v-for="(item,index2) in item.msg.data" :key="index2" :msgdata="item"></chatMsg>
          </div>
        </div>
        <div id="end"></div>
      </scroll-view>
      <scrollContainer :scroll-to-id="toView" v-else>
        <div class="top">{{welcomeMsg}}</div>
        <chatItem v-for="(item,index) in ChatHistory" :key="index" :chatdata="item" :desc="desc_obj" :chatRoomInfo="chatRoomInfo"></chatItem>
        <div id="end"></div>
      </scrollContainer>
      <div class="chat-tool" v-if="roomInfo.id">
        <div class="input-box">
          <i class="icon">&#xe637;</i>
          <input placeholder="说点什么..." type="text" v-model="textMsg" maxlength="200" @confirm="sendMsg" confirm-type="send" fixed="true" />
        </div>
        <i class="icon exit" @click="exitLiveRoom">&#xe609;</i>
        <i class="icon disconnect" v-if="PusherUrl" @click="disconnectRoom">&#xe658;</i>
        <i class="icon connect" v-else @click="connectRoom">&#xe8e8;</i>
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
          ￥
          <span class="txt">{{floatingGoods.Price}}</span>
        </div>
        <i class="icon">&#xe601;</i>
      </div>
    </div>
    <div class="modal" :class="showMember?'open':''">
      <div class="mask" @click.stop="showMember=false"></div>
      <div class="modal-wrap">
        <span class="title">观众</span>
        <scroll-view scroll-y="true" enable-flex="true" class="member-list">
          <div class="item" v-for="(item,index) in roomInfo.affiliations" :key="index">
            <img :src="item.Portrait" />
            <span class="txt">{{item.UserName}}</span>
            <span class="owner" v-if="item.owner">主播</span>
          </div>
        </scroll-view>
      </div>
    </div>
    <div class="modal" :class="showGift?'open':''">
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
            <span class="pay" @click="buy_dialog=true;getBalance();">充值 〉</span>
          </span>
          <button @click="sendGiftMsg(1);" :style="{visibility:selectGift.giftId?'visible':'hidden'}">赠送</button>
        </div>
      </div>
    </div>
    <div class="uj_dialog" :class="dialog?'open':''">
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
    <div class="uj_dialog" :class="closeLiverommMsg?'open':''">
      <div class="mask" @click="closeLiverommMsg=''"></div>
      <div class="dialog_wrapper" @click="closeLiverommMsg=''">
        <div class="dialog" @click.stop>
          <div class="dialog_wrapper_body">
            <div class="closeLiveroom">{{closeLiverommMsg}}</div>
          </div>
          <div class="dialog_wrapper_bottom">
            <div class="buttom-group">
              <button class="confirm" @click="go({path:'/pages/home/index',isTab:true})">进入行业市场</button>
              <navigator class="confirm" v-if="hasBack" open-type="navigateBack">返回</navigator>
              <navigator class="confirm" v-else target="miniProgram" open-type="exit">退出小程序</navigator>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="uj_dialog" :class="login_dialog?'open':''">
      <div class="mask" @click="login_dialog=false"></div>
      <div class="dialog_wrapper bottom" @click="login_dialog=false">
        <div class="dialog bg_grey" @click.stop>
          <div class="dialog_wrapper_body">
            <div class="loginbox">
              <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信一键登录</button>
              <button @click="replace({path:'/pages/index/index',query:{redirect:redirect,mode:'PWD'}})">U建账号登录</button>
              <button class="cancel" @click="login_dialog=false">取消</button>
            </div>
          </div>
          <div class="dialog_wrapper_bottom"></div>
        </div>
      </div>
    </div>
    <div class="uj_dialog" :class="buy_dialog?'open':''">
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
                <span @click="go({path:'/pages/web/webview',query:{webviewUrl:'https://protocol.ujianchina.net/Protocol/live/liveProtocol.html'}})">《用户充值协议》</span>
              </p>
            </div>
          </div>
          <div class="dialog_wrapper_bottom"></div>
        </div>
      </div>
    </div>
    <div class="uj_dialog" :class="selectPackage?'open':''">
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
    <div class="uj_dialog" :class="showgoods&&shopGoods&&shopGoods.length>0?'open':''">
      <div class="mask" @click="showgoods=false"></div>
      <div class="dialog_wrapper bottom" @click="showgoods=false;">
        <div class="dialog bg_grey" @click.stop>
          <div class="dialog_wrapper_body">
            <scroll-view scroll-y="true" class="goodsbox" v-if="isMP">
              <div class="item" v-for="(item,index) in shopGoods" :key="index">
                <img :src="item.Images.length>0?item.Images[0].Thumbnail_url:''" />
                <div class="info">
                  <span class="name">{{item.gName}}</span>
                  <span class="price">
                    ￥
                    <span class="txt">{{item.gType==1?'议价':item.Price}}</span>
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
import otherPull from "./otherPull";
import otherPusher from "./otherPusher";

export default {
  data() {
    return {
      roomId: "",
      roomInfo: {
        name: "",
        cover: "https://image.ujianchina.net/Shopping/ShopImages//7eb046ff17724f5e97da3d2a3c01be91/201808241024127524ZGG.jpg",
        status: "ongoing",
        mute: false,
        id: "",
        affiliations_count: 0,
        chatroomId: "",
        owner: "",
        description: "",
        sId: "",
        livePushUrl: [],
        livePullUrl: [],
        ext: null,
        maxusers: 200,
        affiliations: [],
        persistent: false,
        video_type: "live",
        force: false
      },
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
      // joined: false,
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
      shopGoods: null,
      showgoods: false,
      showFloating: true,
      fullscreen: false,
      welcomeMsg: "",
      PusherUrl: null,
      closeLiverommMsg: "",
      hasBack: true
    };
  },
  components: {
    scrollContainer,
    chatItem,
    chatMsg,
    vaildCodeBox,
    otherPull,
    otherPusher
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
    /**
     * @description: '主屏拉流显示'
     * @param {*}
     * @return {*}
     */
    mainPull() {
      if (this.roomInfo && this.roomInfo.livePullUrl && this.roomInfo.livePullUrl.length > 0) return this.roomInfo.livePullUrl[0];
      else return "";
    },
    otherPull() {
      if (this.roomInfo && this.roomInfo.livePullUrl && this.roomInfo.livePullUrl.length > 0)
        return this.roomInfo.livePullUrl.slice(1).filter(item => {
          return item.indexOf(WebIM.conn.context.userId) < 0;
        });
      // return [this.roomInfo.livePullUrl[0],this.roomInfo.livePullUrl[0]]
      else return [];
    },
    redirect() {
      var url = `/pages/live/room`; //当前页面url
      let encodeparms = encodeURIComponent(`?roomId=${this.roomId}`);
      url = url + encodeparms;
      return url;
    },
    floatingGoods() {
      if (this.shopGoods == null || this.shopGoods.length == 0) {
        return;
      } else {
        return this.shopGoods.find(item => {
          return item.liveModel.isFloating;
        });
      }
    }
  },
  methods: {
    fullscreenchange(e) {
      // console.log("fullscreenchange e:", e);
    },
    //直播全屏/正常切换
    fullscreenHandler() {
      var that = this;
      var _livePlayerContext = wx.createLivePlayerContext("myPlayer");
      console.log("fullscreen by", _livePlayerContext);
      if (that.fullscreen) {
        _livePlayerContext.exitFullScreen({
          success(e) {
            that.fullscreen = false;
            console.log("exitFullScreen success", e);
          },
          fail(e) {
            console.log("exitFullScreen fail", e);
          }
        });
      } else {
        _livePlayerContext.requestFullScreen({
          direction: 90,
          success(e) {
            that.fullscreen = true;
            console.log("fullscreen success", e);
          },
          fail(e) {
            console.log("fullscreen fail", e);
          }
        });
      }
    },
    //读取消息
    readMsg(renderableMsg, type, currentChatMsg, sessionKey, msg) {
      // console.log(renderableMsg, type, currentChatMsg, sessionKey,msg)

      if (sessionKey == this.sessionKey) {
        if (msg) {
          var memberInfo = this.roomInfo.affiliations.find(item => {
            return item.member == msg.from || item.owner == msg.from;
          });
          if (memberInfo) {
            if (renderableMsg) renderableMsg.ext.nickName = memberInfo.UserName;
          }
        }

        if (renderableMsg) this.ChatHistory.push(renderableMsg);

        if (this.ChatHistory && this.ChatHistory.length > 0) this.toView = this.ChatHistory[this.ChatHistory.length - 1].mid;
      }
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
            console.log("send private text Success", id, serverMsgId, msg);
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
          console.log("send praise msg Success", msg);
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
          self.readMsg(renderableMsg, msg.body.customEvent, null, self.sessionKey);
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
      if (!this.selectGift.giftId) {
        return;
      }
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
          console.log("send gift msg success", msg);
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
          self.readMsg(renderableMsg, msg.body.customEvent, null, self.sessionKey);
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
      var res = await this.$ShoppingAPI.AppServer_SendGift(self.roomInfo.owner, self.selectGift.giftId, giftNum).catch(msg => {
        this.toast(msg);
      });
      if (res.ret == 0 && res.data) {
        WebIM.conn.send(msg.body);
        this.showGift = false;
      } else {
        this.toast("发送礼物失败");
      }
    },
    // 退出直播间
    exitLiveRoom() {
      WebIM.conn.quitChatRoom({
        roomId: this.roomInfo.id,
        success: res => {
          if (this.hasBack) this.$router.back();
          else this.closeLiverommMsg = "即将退出直播间";
        },
        error: e => {
          console.log("退出失败", e);
        }
      });
    },

    /**
     * @description: '直播间连麦'
     * @param {*}
     * @return {*}
     */
    connectRoom() {
      var self = this;
      if (this.roomId) {
        if (WebIM.conn.isOpened() && this.roomInfo.status == "ongoing") {
          this.$ShoppingAPI.AppServer_ConnectRoom(this.roomId, "video").then(res => {
            console.log(`connectRoom isOpened :${WebIM.conn.isOpened()}`, res);
            if (res && res.ret == 0 && res.data) {
              let id = WebIM.conn.getUniqueId();
              let msg = new WebIM.message("custom", id);
              msg.set({
                to: self.roomId,
                roomType: true,
                customEvent: "chatroom_member_video_call",
                customExts: { video_call_status: "start", video_call: res.data },
                success: function() {
                  self.PusherUrl = res.data;
                  console.log("send video_call_start msg success", msg);
                },
                fail: function() {}
              });
              msg.setGroup("groupchat");
              WebIM.conn.send(msg.body);
            }
          });
        }
      }
    },
    /**
     * @description: '挂断连麦'
     * @param {*}
     * @return {*}
     */
    disconnectRoom() {
      var self = this;
      if (this.roomId && self.PusherUrl) {
        if (WebIM.conn.isOpened()) {
          this.$ShoppingAPI.AppServer_UnConnectRoom(this.roomId, self.PusherUrl).then(res => {
            console.log(`disconnectRoom isOpened :${WebIM.conn.isOpened()}`, res);
            if (res && res.ret == 0 && res.data) {
              let id = WebIM.conn.getUniqueId();
              let msg = new WebIM.message("custom", id);
              msg.set({
                to: self.roomId,
                roomType: true,
                customEvent: "chatroom_member_video_call",
                customExts: { video_call_status: "end" },
                success: function() {
                  console.log("send video_call_end msg success", msg);
                  self.PusherUrl = null;
                },
                fail: function() {}
              });
              msg.setGroup("groupchat");
              WebIM.conn.send(msg.body);
            } //这种情况断网很久之后主播端主动挂断用户连麦,此时用户请求挂断连麦服务端会返回失败,通过获取直播间详情比较推流是否还有当前用户的连麦,尝试用该方式挂断连
            else {
              self.$ShoppingAPI.AppServer_LiveRoomsDetail(self.roomId).then(res2 => {
                if (res2.ret == 0 && res2.data) {
                  if (res2.data.livePullUrl.indexOf(WebIM.conn.context.userId) < 0) {
                    console.log("断网很久之后用户才发起的挂断连麦操作");
                    let id = WebIM.conn.getUniqueId();
                    let msg = new WebIM.message("custom", id);
                    msg.set({
                      to: self.roomId,
                      roomType: true,
                      customEvent: "chatroom_member_video_call",
                      customExts: { video_call_status: "end" },
                      success: function() {
                        console.log("send video_call_end msg success", msg);
                        self.PusherUrl = null;
                      },
                      fail: function() {}
                    });
                    msg.setGroup("groupchat");
                    WebIM.conn.send(msg.body);
                  }
                }
              });
            }
          });
        }
      }
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
          that.readMsg(renderableMsg, msg.customEvent, null, that.sessionKey, msg);
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

          that.readMsg(renderableMsg, msg.customEvent, null, that.sessionKey, msg);
          break;
        }
        case "chatroom_member_join": {
          // if(msg.to!=that.roomInfo.id)
          //   break;
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

            that.readMsg(renderableMsg, msg.customEvent, null, that.sessionKey, msg);
          }
          break;
        }
        case "chatroom_member_video_call": {
          that.readMsg(renderableMsg, msg.customEvent, null, that.sessionKey, msg);
          if (msg.customExts.video_call_status == "start") {
            that.$ShoppingAPI.AppServer_LiveRoomsDetail(that.roomId).then(res => {
              if (res.ret == 0 && res.data) {
                for (let index = 0; index < res.data.livePullUrl.length; index++) {
                  const _url = res.data.livePullUrl[index];
                  //遍历服务端数据源,本地数据源没有则加入推流地址push(_url)
                  if (!~that.roomInfo.livePullUrl.indexOf(_url)) {
                    that.roomInfo.livePullUrl.push(_url);
                  }
                }
              }
            });
          } else if (msg.customExts.video_call_status == "end") {
            that.$ShoppingAPI.AppServer_LiveRoomsDetail(that.roomId).then(res => {
              if (res.ret == 0 && res.data) {
                for (let index = 0; index < that.roomInfo.livePullUrl.length; index++) {
                  const _url = that.roomInfo.livePullUrl[index];
                  //遍历本地数据,服务端数据源没有推流地址(_url)则本地数据根据下标移除splice(index,1)
                  if (!~res.data.livePullUrl.indexOf(_url)) {
                    that.roomInfo.livePullUrl.splice(index, 1);
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
            // that.modal({
            //   content: "直播已结束",
            //   showCancel: false,
            //   confirm: () => {
            //     that.$router.back();
            //   },
            //   confirmText: "返回"
            // });
            that.closeLiverommMsg = "直播已结束";
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
        case "removedFromGroup": {
          console.log(`${msg.type}== removedFromGroup  gId${msg.gid} ==roomId${that.roomId}`);
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
    async initHanderler() {
      var that = this;
      // that.EmojiObj2 = WebIM.EmojiObj2; //表情包
      if (this.roomId) {
        this.welcomeMsg = "正在加入直播间聊天室";
        var res = await that.$ShoppingAPI.AppServer_LiveRoomsDetail(that.roomId).catch(msg => {
          this.welcomeMsg = msg;
        });
        if (res.ret == 0 && res.data) {
          that.roomInfo = res.data;
          var owner = that.roomInfo.affiliations.find(item => {
            return item.owner;
          });
          if (!owner || that.roomInfo.status == "offline") {
            //直播间拥有者不存在或者status=="offline",认为是还未开启直播间
            that.closeLiverommMsg = that.welcomeMsg = "直播间还未开启";
            that.roomInfo.livePullUrl = [];
            return;
          }
          if (that.isMP) wx.setNavigationBarTitle({ title: `${that.roomInfo.name}直播间` });

          WebIM.conn.joinChatRoom({
            roomId: that.roomId,
            success: r => {
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
                  that.welcomeMsg = "欢迎您进入直播间聊天室";
                  var my = that.roomInfo.affiliations.find(item => {
                    return item.member == that.UserInfo.UserId.replace(/-/g, "");
                  });
                  if (!my)
                    that.roomInfo.affiliations.push({
                      Portrait: that.UserInfo.Portrait,
                      UserName: that.UserInfo.UserName,
                      member: that.UserInfo.UserId
                    });
                },
                fail: function() {}
              });
              msg.setGroup("groupchat");
              WebIM.conn.send(msg.body);
            },
            error(msg) {
              console.log("加入直播间失败", msg);
              this.welcomeMsg = "加入直播间聊天室失败";
              //加入直播间失败,认为是直播间已关闭或已结束
              that.modal({
                content: (msg.errMsg && msg.errMsg.replace("request:fail", "")) || "直播间不存在",
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
          //服务端保存加入人信息
          that.$ShoppingAPI.AppServer_JoinRoom(that.UserInfo.UserName, that.UserInfo.Portrait);
          //礼物列表
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

          //积分
          that.$ShoppingAPI.AppServer_GetPoints().then(response => {
            if (response.ret == 0 && response.data) {
              that.livePoints = response.data;
            }
          });

          //当前用户是否关注直播间
          that.$ShoppingAPI.AppServer_IsFollow(that.roomInfo.owner).then(res => {
            if (res.ret == 0 && res.data) {
              that.isFollow = res.data;
            }
          });
          //直播间关联的店铺商品列表
          that.getGoods();
          if (that.PusherUrl) {
            that.modal({
              title: "网络异常",
              content: "检测到您正在直播连麦是否进行重连?",
              confirm: () => {
                that.connectRoom();
              },
              cancel: () => {
                that.disconnectRoom();
              },
              confirmText: "重新连麦",
              cancelText: "断开连麦"
            });
          }
        } else {
          that.closeLiverommMsg = "直播间不存在";
        }
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
            case "UpdateHangingGoodsState": {
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
    DisconnectedHanderler() {
      if (WebIM.conn.autoReconnectNumTotal > 0 && WebIM.conn.autoReconnectNumTotal <= WebIM.conn.autoReconnectNumMax) {
        //连接已断开,正在连接服务器
        console.log("DisconnectedHanderler: 连接已断开,正在连接服务器");
        this.welcomeMsg = "网络连接已断开,正在尝试重新连接";
      } else if (WebIM.conn.autoReconnectNumTotal > WebIM.conn.autoReconnectNumMax) {
        this.welcomeMsg = "网络连接已断开";
      }
    },
    //取消关注
    unFollow() {
      this.$ShoppingAPI.AppServer_UnFollow(this.roomInfo.owner).then(res => {
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
      wx.checkSession({
        success() {
          console.log("session_key 有效");
          //session_key 未过期，并且在本生命周期一直有效
          if (e.mp.detail.errMsg == "getPhoneNumber:ok") {
            that.$ShoppingAPI
              .Account_wxAESDecrypt({
                encryptedData: e.mp.detail.encryptedData,
                iv: e.mp.detail.iv,
                openid: that.UserInfo.openid
              })
              .then(res => {
                // if (res.ret == 0) {
                  var msg = JSON.parse(res.data);
                  console.log(msg);
                  var _u = { Phone: msg.phoneNumber, ...that.UserInfo };
                  that.$store.commit("SetUserInfo", _u);
                  that.$router.replace({ path: "/pages/index/index", query: { redirect: that.redirect } });
                // } else {
                // }
              }).catch(msg=>{
                  console.log(msg);
                  that.modal({
                    confirmText: "重新登录",
                    title: "获取微信解密数据失败",
                    content: "获取微信解密数据失败,session_key可能已失效,尝试重新登录获取",
                    confirm: () => {
                      that.$store.commit("Login", { Ticket: "" }); //清空Ticket
                      that.$store.commit("SetUserInfo", {}); //清空userinfo
                      var pages = getCurrentPages(); //获取加载的页面
                      var currentPage = pages[pages.length - 1]; //获取当前页面的对象
                      var url = `/${currentPage.route}`; //当前页面url

                      that.$router.replace({ path: `${url}`,query:currentPage.options});
                    }
                  });
              });
          } else {
            that.toast("拒绝授权访问用户信息,将无法继续下一步");
          }
        },
        fail() {
          console.log("session_key 已经失效");
          // session_key 已经失效，需要重新执行登录流程
          that.modal({
            confirmText: "重新登录",
            title: "登录session_key已失效",
            content: "您当前的登录session_key已失效或已过期,需要重新登录",
            confirm: () => {
              that.$store.commit("Login", { Ticket: "" }); //清空Ticket
              that.$store.commit("SetUserInfo", {}); //清空userinfo
              var pages = getCurrentPages(); //获取加载的页面
              var currentPage = pages[pages.length - 1]; //获取当前页面的对象
              var url = `/${currentPage.route}`; //当前页面url
              console.log(url,currentPage.options)
              that.$router.replace({ path: `${url}` ,query:currentPage.options});
            }
          });
        }
      });
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
                  that.toast(res.errMsg || res.err_desc || "支付失败");
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
        //更新U建钱包余额
        that.getBalance();
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
    getGoods() {
      var that = this;
      if (this.roomInfo && this.roomInfo.sId) {
        //获取店铺商品
        this.$ShoppingAPI.Goods_GetLiveGoods(this.roomInfo.sId).then(rep3 => {
          if (rep3.ret == 0) {
            that.shopGoods = rep3.data;
            that.showFloating = true;
          }
        });
      }
    },
    //切换直播推流, 用于切换显示连麦者的直播视频
    changeMainPushUrl(item, index) {
      // var _index =  this.roomInfo.livePullUrl.indexOf(item);
      console.log("changeMainPushUrl :", item, index);
      this.roomInfo.livePullUrl.splice(index + 1, 1); //推流数组下标0是主播视频, 连麦数组是去除主播后的集合,所以此处+1
      this.roomInfo.livePullUrl.unshift(item);
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
    var that = this;
    console.log("onUnload exit liveroom :", that.roomId);
    msgStorage.off("newChatMsg", this.readMsg);
    disp.off("newCustomMessage", this.customMsgHanderler);
    disp.off("onPresence", this.presenceHanderler);
    disp.off("onOpened", this.initHanderler);
    disp.off("onCmdMessage", this.cmdMsgHanderler);
    disp.off("onSocketDisconnected", this.DisconnectedHanderler);
    if (WebIM.conn.isOpened()) {
      that.disconnectRoom();
      WebIM.conn.quitChatRoom({
        roomId: that.roomId
      });
    }
  },
  onShareAppMessage(result) {
    let title = `【${this.roomInfo.name}】正在直播中`;
    let path = `/pages/live/room?roomId=${this.roomId}`;
    let imageUrl = "https://image.ujianchina.net/MiniProgram/liveroomshare.png";
    return {
      title,
      path,
      imageUrl
    };
  },
  onShow() {
    let pages = getCurrentPages();
    // console.log(pages);
    this.hasBack = pages[pages.length - 2] ? true : false;
  },
  mounted() {
    var that = this;
    console.log("mounted", this);
    this.extraDataHandler();
    if (this.$route.query.roomId) {
      this.roomId = this.$route.query.roomId;
      if (this.isMP) {
        wx.setNavigationBarTitle({ title: "直播间" });
      }
    }
    this.welcomeMsg = "正在初始化";
    disp.on("onOpened", that.initHanderler);
    msgStorage.on("newChatMsg", that.readMsg);
    disp.on("newCustomMessage", that.customMsgHanderler);
    disp.on("onPresence", that.presenceHanderler);
    disp.on("onCmdMessage", that.cmdMsgHanderler);
    disp.on("onSocketDisconnected", that.DisconnectedHanderler);
    disp.on("onOpening", () => {
      that.welcomeMsg = "正在连接中";
    });
    disp.on("onClosed", () => {
      that.welcomeMsg = "聊天服务已断开";
    });

    this.wx_login(() => {
      if (WebIM.conn.isOpened()) {
        // if (!this.joined)
        this.initHanderler();
      } else if (!this.Logined) {
        this.welcomeMsg = "点击登录加入直播间聊天室";
        that.$ShoppingAPI.AppServer_LiveRoomsDetail(that.roomId).then(res => {
          if (res.ret == 0 && res.data) {
            that.roomInfo = res.data;
            var owner = that.roomInfo.affiliations.find(item => {
              return item.owner;
            });
            if (!owner || that.roomInfo.status == "offline") {
              //直播间拥有者不存在或者status=="offline",认为是还未开启直播间
              that.closeLiverommMsg = that.welcomeMsg = "直播间还未开启";
              that.roomInfo.livePullUrl = [];
              return;
            }
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
      } else {
        console.log(`环信open:${WebIM.conn.isOpened()},登录状态${this.Logined}`);
      }
    });
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
    height: 35%;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.2);
    .player-tool {
      position: absolute;
      z-index: 4;
      color: #fff;
      bottom: 0.6rem;
      right: 0.4rem;
      .icon {
        color: #fff;
      }
    }
  }
  .otherPull {
    position: absolute;
    top: 0.1rem;
    right: 0.1rem;
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
    .room_name,
    .people_num {
      border-radius: 0.5rem;
      height: 0.8rem;
      padding: 0 0.4rem;
      line-height: 0.8rem;
      letter-spacing: 0.02rem;
    }
    .room_name {
      background-color: rgba(255, 255, 255, 0.3);
      margin-left: 0.3rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 70%;
    }
    .people_num {
      margin-right: 0.3rem;
      background-color: rgba(255, 255, 255, 0.6);
    }
  }
  .chart-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 65%;
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
    .player-tool {
      position: absolute;
      width: 100%;
      top: -0.6rem;
      z-index: 4;
      color: #fff;
      display: flex;
      justify-content: flex-end;
      .icon {
        padding: 0 0.4rem;
      }
    }
    .chatbox {
      // height: 100%;
      height: 90%;
      // background: rgba(0,0,0,0.2);
      .chat-item {
        padding: 0 0.15rem;
        font-size: 0.4rem;
        .txt_praise {
          color: #497fe6;
        }
        .txt_gift {
          img {
            width: 0.55rem;
            height: 0.55rem;
          }
        }
      }
      .chat-item > span {
        line-height: 0.55rem;
        display: flex;
        align-items: center;
      }
    }
    .chat-tool {
      display: flex;
      align-items: center;
      font-size: 0.5rem;
      height: 10%;
      color: #fff;
      .icon {
        // flex-grow:1
        width: 0.9rem;
        height: 0.9rem;
        line-height: 0.9rem;
        text-align: center;
        border-radius: 50%;
        margin-right: 2%;
      }
      .exit {
        background-color: rgba(105, 16, 16, 0.8);
      }
      .connect {
        background-color: rgb(230, 248, 255);
        color: rgb(97, 197, 255);
        font-size: 0.7rem;
      }
      .disconnect {
        background: #ff74af;
        color: #e60000;
      }
      .praise {
        background: rgba(0, 0, 0, 0.4);
      }

      .gift {
        background: rgb(240, 85, 34);
      }
      .goods {
        color: #fff;
        background: #ff74af;
      }
      .goods-hover {
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
          color: #000;
        }
      }
    }
  }
  .float-goods {
    padding: 0.24rem;
    background-color: #f7f0fa;
    position: fixed;
    right: 0.31rem;
    bottom: 2rem;
    z-index: 4;
    border-radius: 0.13rem;
    .top {
      display: flex;
      align-items: center;
      margin-bottom: 0.29rem;
      font-size: 0.29rem;
      .icon {
        width: 0.36rem;
        height: 0.36rem;
        line-height: 0.36rem;
        text-align: center;
        flex-shrink: 0;
        color: #a49baf;
      }
      .icon.recommend {
        background-color: #7b33dd;
        color: #fcfaff;
        font-size: 0.19rem;
        border-radius: 50%;
      }
      .txt {
        color: #7b33dd;
        width: 100%;
        flex-grow: 1;
        font-size: 0.29rem;
        margin-left: 0.06rem;
      }
    }
    .body {
      position: relative;
      margin-bottom: 0.22rem;
      img {
        width: 2.9rem;
        height: 2.63rem;
        border-radius: 0.1rem;
      }
      .txt {
        width: 1rem;
        height: 0.54rem;
        border-radius: 0.2rem 0 0.2rem 0;
        text-align: center;
        background-color: #c519f1;
        color: #fff;
        position: absolute;
        top: -0.16rem;
        left: 0;
        font-size: 0.33rem;
      }
      .name {
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
        text-indent: 0.14rem;
        border-radius: 0 0 0.1rem 0.1rem;
      }
    }
    .bottom {
      color: #fe2b54;
      display: flex;
      align-items: center;
      .price {
        flex-grow: 1;
        font-size: 0.33rem;
        .txt {
          font-size: 0.43rem;
        }
      }
      .icon {
        width: 0.56rem;
        height: 0.55rem;
        line-height: 0.55rem;
        text-align: center;
        font-size: 0.3;
        flex-shrink: 0;
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
      display: none;
    }
    .modal-wrap {
      width: 100%;
      height: 50%;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 10;
      transform: translateY(100%);
      visibility: hidden;
      opacity: 0;
      transition: opacity 700ms ease-out, transform 300ms ease-out, visibility 700ms ease-out;
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
      // display: flex;
      // flex-direction: column;
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
          flex-shrink: 0;
        }
        span.txt {
          margin-right: 0.5rem;
          max-width: 70%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        span.owner {
          background-color: #2cacfc;
          border-radius: 0.4rem;
          padding: 0 0.4rem;
          height: 0.8rem;
          line-height: 0.8rem;
          flex-shrink: 0;
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
      border-top: 0.03rem solid rgba(45, 47, 59, 0.6);
      width: 100%;
      .txt {
        margin-left: 0.5rem;
        display: flex;
        align-items: center;
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
  .modal.open {
    .mask {
      display: block;
    }
    .modal-wrap {
      transform: none;
      visibility: visible;
      opacity: 1;
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
      display: none;
      opacity: 0;
      transform: scale3d(1, 1, 0);
      transition: all 0.3s ease-in;
    }
    // .mask {
    //   opacity: 1;
    //   transform: scale3d(1, 1, 1);
    //   transition: all 0.3s ease-in;
    // }
    // .mask.mask_hidden {
    //   opacity: 0;
    //   transform: scale3d(1, 1, 0);
    // }
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
      transform: translateY(-100%);
      visibility: hidden;
      opacity: 0;
      transition: opacity 700ms ease-out, transform 300ms ease-out, visibility 700ms ease-out;

      .dialog {
        background-color: #fff;
        text-align: center;
        border-radius: 0.4rem;
        overflow: hidden;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-flex-direction: column;
        flex-direction: column;
        max-height: 12.49rem;
        width: 65%;
        max-width: 65%;
        .dialog_wrapper_head {
          padding: 0.3rem;
        }
        .dialog_wrapper_body {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          font-size: 0.45rem;
          overflow-wrap: break-word;
          -webkit-hyphens: auto;
          hyphens: auto;
          color: rgba(0, 0, 0, 0.5);
        }
        .dialog_wrapper_bottom {
          border-top: 0.02rem solid rgba(0, 0, 0, 0.5);
          .buttom-group {
            display: flex;
            justify-items: center;
            align-items: center;
            button,
            navigator {
              flex-grow: 1;
            }
          }
          button,
          navigator {
            font-size: 0.4rem;
            padding: 0.45rem 0;
          }
          button.confirm,
          navigator.confirm {
            color: #2cacfc;
          }
          button.cancel,
          navigator.cancel {
            color: #989898;
          }
        }
      }
      &.bottom {
        align-items: flex-end;
        transform: translateY(100%);
        .dialog {
          width: 100%;
          max-width: 100%;
          border-radius: 0.24rem 0.24rem 0 0;
        }
      }
    }
  }
  .uj_dialog.open {
    .mask {
      display: block;
      opacity: 1;
      transform: scale3d(1, 1, 1);
    }
    // .mask {
    //   opacity: 1;
    //   transform: scale3d(1, 1, 1);
    //   transition: all 0.3s ease-in;
    // }
    .dialog_wrapper {
      transform: none;
      visibility: visible;
      opacity: 1;
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
        font-size: 0.55rem;
        width: 9.85rem;
        height: 1.3rem;
        line-height: 1.3rem;
        color: #fff;
        background-color: #00a8ec;
        border-radius: 0.65rem;
      }
    }
    .goodsbox {
      padding-bottom: 0.47rem;
      .item {
        display: flex;
        margin: 0.47rem 0.38rem 0 0.36rem;
        img {
          width: 2.64rem;
          height: 2.65rem;
          flex-shrink: 0;
          border-radius: 0.13rem;
        }
        .info {
          margin-top: 0.11rem;
          margin-left: 0.51rem;
          position: relative;
          flex-grow: 1;
          text-align: left;
          .name {
            font-size: 0.41rem;
            color: #1a1a1a;
            display: block;
            // margin-bottom: 1.2rem;
          }
          .price {
            font-size: 0.5rem;
            color: #ff2120;
            position: absolute;
            bottom: 0;
            left: 0;
            .txt {
              font-size: 0.63rem;
            }
          }
          .btn {
            position: absolute;
            top: 1.6rem;
            right: 0;
            background-color: #3fbefe;
            color: #fff;
            width: 2.13rem;
            height: 0.94rem;
            line-height: 0.94rem;
            border-radius: 0.47rem;
            text-align: center;
          }
        }
      }
    }
    .closeLiveroom {
      margin: 1rem 0;
    }
  }
}
</style>