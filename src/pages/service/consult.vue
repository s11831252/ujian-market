<template>
  <div class="wai">
    <scroll-view :scroll-into-view="toView" enable-flex="true" scroll-y="true" class="chatbox" @click="pending('chat',null)" v-if="isMP">
      <div class="top">欢迎您光临本店，请问有什么能帮助您？</div>
      <chatItem v-for="item in ChatHistory" :key="item.mid" @delMsg="delMsg" :showCheckbox="showCheckbox" @checked="checkedMsg" @onShowCheckbox="onShowCheckbox" :chatdata="item" :desc="desc_obj" :chatRoomInfo="chatRoomInfo"></chatItem>
      <div id="end"></div>
    </scroll-view>
    <scrollContainer :scroll-to-id="toView" v-else>
      <div class="top">欢迎您光临本店，请问有什么能帮助您？</div>
      <chatItem v-for="item in ChatHistory" :key="item.mid" @delMsg="delMsg" :showCheckbox="showCheckbox" @checked="checkedMsg" @onShowCheckbox="onShowCheckbox" :chatdata="item" :desc="desc_obj" :chatRoomInfo="chatRoomInfo"></chatItem>
      <div id="end"></div>
    </scrollContainer>
    <!-- 输入框 -->
    <div class="input-chat-box">
      <div class="input">
        <!-- 引用图标，需要引用其样式 -->
        <div class="icon" v-if="isMP" :class="chattype=='audio'?'focus':''" @click="pending('audio')">{{chattype=='audio'?'&#xe635;':'&#xe664;'}}</div>
        <div class="icon" v-else :class="chattype=='audio'?'focus':''" @click="pending(null,'语音')">{{chattype=='audio'?'&#xe635;':'&#xe664;'}}</div>
        <form action @submit.prevent="sendMsg">
          <input class="msg_input" type="text" @click="pending('chat',null)" maxlength="1000" @confirm="sendMsg" confirm-type="send" fixed="true" v-model="msg" placeholder="输入新消息" />
          <input class="submit_btn" type="submit" value="发送" />
        </form>
        <div class="icon" :class="chattype=='emoji'?'focus':''" @click="pending('emoji')">&#xe652;</div>
        <div v-if="isMP" class="icon" :class="chattype=='more'?'focus':''" @click="pending('more')">&#xe726;</div>
        <div v-else class="icon" :class="chattype=='more'?'focus':''" @click="pending(null,`多媒体`)">&#xe726;</div>
      </div>
      <div class="Checkbox-tool" :class="{show:showCheckbox}">
        <div class="item" @click="batchDelMsg">
          <i class="icon">&#xe612;</i>
          <span>删除</span>
        </div>
        <div class="item" @click="showCheckbox=false;delMsgList=[]">
          <i class="icon">&#xe613;</i>
          <span>取消</span>
        </div>
      </div>
      <div v-if="chattype=='audio'">
        <recordInput :recordSuccess="recordSuccess"></recordInput>
      </div>
      <div v-if="chattype=='emoji'" class="emojibox">
        <swiper class="swiper" indicator-dots="true" v-if="isMP">
          <swiper-item v-for="(item,index) in EmojiObj2.map" :key="index">
            <img v-for="(value,key) in item" :key="key" :src="EmojiObj2.path+value" @click="emojiInput(key)" />
          </swiper-item>
        </swiper>
        <swiper v-else ref="mySwiper" :options="swiperOption">
          <swiper-slide v-for="(item, index) in EmojiObj2.map" :index="index" :key="index">
            <img v-for="(value,key) in item" :key="key" :src="EmojiObj2.path+value" @click="emojiInput(key)" />
          </swiper-slide>
          <!-- Optional controls -->
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div class="toolbox">
          <span class="btn_send" @click="sendMsg">发送</span>
        </div>
      </div>
      <div v-if="chattype=='more'">
        <swiper>
          <swiper-item>
            <div class="moremsg">
              <span class="iconbox" @click="openImage">
                <i class="icon">&#xe89c;</i>
                <p>图片</p>
              </span>
              <span class="iconbox">
                <i class="icon" @click="openCamera">&#xe634;</i>
                <p>拍照</p>
              </span>
              <span class="iconbox" @click="openVideo">
                <i class="icon">&#xe6c5;</i>
                <p>视频</p>
              </span>
              <span class="iconbox" @click="chooseLocation">
                <i class="icon">&#xe65e;</i>
                <p>位置</p>
              </span>
            </div>
          </swiper-item>
        </swiper>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState,mapActions} from "vuex";
import utils from "@/utils/index.js";
import chatItem from "@/pages/service/chat-item";
import WebIM from "@/utils/hx/WebIM";
import msgStorage from "./msgstorage";
import msgType from "./msgtype";
import scrollContainer from "./scrollcontainer";
import recordInput from "./record";
export default {
  data() {
    return {
      swiperOption: {
        pagination: {
          el: ".swiper-pagination"
        }
      },
      msg: "",
      sId: null,
      ChatHistory: [],
      chatRoomInfo: {},
      toView: "",
      chattype: "chat",
      EmojiObj2: {},
      desc_obj: {},
      showCheckbox: false,
      delMsgList: []
    };
  },
  components: {
    chatItem,
    scrollContainer,
    recordInput
  },
  computed: {
    ...mapState({
      Ticket: state => state.User.SingleTicket,
      UserInfo: state => state.User.UserInfo
    }),
    to() {
      if (this.chatRoomInfo) return this.chatRoomInfo.id;
      else return null;
    },
    sessionKey() {
      if (this.chatRoomInfo && this.chatRoomInfo.id) return this.chatRoomInfo.id + WebIM.conn.context.userId;
      else return "";
    }
  },
  methods: {
    sendMsg(e) {
      var that = this;
      if (!this.msg) return;
      if (e && e.keyCode) {
        if (e.keyCode != 13) return;
      }
      if (!this.to) {
        this.toast(`群组信息获取失败,请重试`);
      } else {
        this.chcekSensitiveWords(this.msg).then(words=>{
          console.log("checked:",words)
          if(!words)
          {
            let id = WebIM.conn.getUniqueId();
            let msg = new WebIM.message(msgType.TEXT, id);
            msg.set({
              msg: that.msg,
              from: WebIM.conn.context.userId,
              to: that.to,
              // roomType: true,
              chatType: "groupchat",
              success(id, serverMsgId) {
                // disp.fire('em.chat.sendSuccess', id, me.data.userMessage);
                console.log(`发送消息(id=${id},serverMsgId=${serverMsgId})成功为`, msg);
              },
              fail(id, serverMsgId) {
                console.log(`发送消息(id=${id},serverMsgId=${serverMsgId})失败`);
              }
            });
            msgStorage.saveMsg(msg, "txt");
            that.msg = "";
            that.chattype = "chat";
            msg.setGroup("groupchat");
            WebIM.conn.send(msg.body);
          }else
          {
            that.modal({title:"发送失败",content:"内容包涵敏感词:"+`[${words.join("][")}]`,showCancel:false})
          }
        })

      }
    },
    /**
     * @description: '删除消息,由子组件chatItem传出来的长按消息删除事件,在这里删除视图中的数据,本地缓存由子组件内删除'
     * @param {*} msg 要删除的消息
     * @return {*}
     */
    delMsg(msg) {
      var msglist = utils.getItem(this.sessionKey) || [];
      var _msg = msglist.find(item => {
        return item.mid == msg.mid;
      });
      if (_msg) {
        msglist.splice(msglist.indexOf(_msg), 1);
        utils.setItem(this.sessionKey, msglist);
      }
      var _msg = this.ChatHistory.find(item => {
        return item.mid == msg.mid;
      });
      this.ChatHistory.splice(this.ChatHistory.indexOf(_msg), 1);
    },
    /**
     * @description: '批量删除消息数据'
     * @param {*}
     * @return {*}
     */
    batchDelMsg() {
      while (this.delMsgList.length > 0) {
        const element = this.delMsgList.shift();
        this.delMsg(element);
      }
    },
    /**
     * @description: '长按消息显示消息工具框,选择多选所有消息显示选择框'
     * @param {*}
     * @return {*}
     */
    onShowCheckbox() {
      this.showCheckbox = true;
    },
    checkedMsg(isChecked, msg) {
      if (isChecked) {
        this.delMsgList.push(msg);
      } else {
        var _msg = this.delMsgList.find(item => {
          return item.mid == msg.mid;
        });
        if (_msg) {
          this.delMsgList.splice(this.delMsgList.indexOf(_msg), 1);
        }
      }
      console.log(this.delMsgList);
    },
    readMsg(renderableMsg, type, currentChatMsg, sessionKey, isNew) {
      this.ChatHistory = currentChatMsg;
      console.log(this.ChatHistory)
      if (this.ChatHistory && this.ChatHistory.length) {
        if (isNew) {
          this.toView = this.ChatHistory[this.ChatHistory.length - 1].mid;
        } else {
          this.toView = this.ChatHistory[this.ChatHistory.length - 1].mid;
        }
        setTimeout(() => {
          this.toView = "";
        }, 1000);
      }
    },
    pending(type, title) {
      if (this.chattype == type) this.chattype = "chat";
      else {
        if (title) {
          this.toast(`${title}功能正在开发中`);
          return;
        }
        this.chattype = type;
      }
    },
    recordSuccess(res) {
      this.upLoadFile([res], msgType.AUDIO);
    },
    emojiInput(emoji) {
      // console.log(item,item2)
      this.msg += emoji;
    },
    upLoadFile(tempFilePaths, _msgType = "img") {
      var me = this;
      var token = WebIM.conn.context.accessToken;
      var str = WebIM.config.appkey.split("#");
      for (let index = 0; index < tempFilePaths.length; index++) {
        const path = tempFilePaths[index];
        if (_msgType == msgType.IMAGE) {
          wx.getImageInfo({
            src: path,
            success(res) {
              var allowType = {
                jpg: true,
                gif: true,
                png: true,
                bmp: true
              };
              var width = res.width;
              var height = res.height;
              var index = res.path.lastIndexOf(".");
              var filetype = (~index && res.path.slice(index + 1)) || "";
              if (filetype.toLowerCase() in allowType) {
                me.$HXAPI
                  .chatfiles(str[0], str[1], [path], ["file"], {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + token
                  })
                  .then(dataArr => {
                    var dataObj = dataArr[0];
                    var id = WebIM.conn.getUniqueId(); // 生成本地消息 id
                    var msg = new WebIM.message(_msgType, id);
                    var body = {
                      type: _msgType,
                      size: {
                        width: width,
                        height: height
                      },
                      url: dataObj.uri + "/" + dataObj.entities[0].uuid,
                      filetype: filetype,
                      filename: path
                    };

                    msg.set({
                      body: body,
                      from: WebIM.conn.context.userId,
                      to: me.to,
                      // roomType: true,
                      chatType: "groupchat",
                      success: function(argument) {
                        // disp.fire('em.chat.sendSuccess', id);
                        console.log("files send ok", argument);
                      },
                      fail(id, serverMsgId) {
                        console.log(`发送文件(id=${id},serverMsgId=${serverMsgId})失败`);
                      }
                    });
                    msgStorage.saveMsg(msg, _msgType);
                    msg.setGroup("groupchat");
                    WebIM.conn.send(msg.body);
                  });
              } else {
                me.toast(`不支持的文件格式:${filetype}`);
              }
            },
            fail(msg) {
              console.log(msg);
            },
            complete() {
              console.log("getImageInfo complete");
            }
          });
        } else if (_msgType == msgType.VIDEO) {
          var allowType = {
            mp4: true
          };
          // var width = path.width;
          // var height = path.height;
          var index = path.tempFilePath.lastIndexOf(".");
          var filetype = (~index && path.tempFilePath.slice(index + 1)) || "";
          if (filetype.toLowerCase() in allowType) {
            me.$HXAPI
              .chatfiles(str[0], str[1], [path.thumbTempFilePath], ["file"], {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + token
              })
              .then(thumbResponseArr => {
                var thumbRes = thumbResponseArr[0];
                var _thumbUrl = thumbRes.uri + "/" + thumbRes.entities[0].uuid;
                var _thumb_secret = thumbRes.entities[0].uuid;
                console.log(thumbResponseArr, thumbRes);
                me.$HXAPI
                  .chatfiles(str[0], str[1], [path.tempFilePath], ["file"], {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + token
                  })
                  .then(dataArr => {
                    var dataObj = dataArr[0];
                    var id = WebIM.conn.getUniqueId(); // 生成本地消息 id
                    var msg = new WebIM.message(_msgType, id);
                    msg.set({
                      body: {
                        type: _msgType,
                        url: dataObj.uri + "/" + dataObj.entities[0].uuid,
                        filetype: filetype || "mp4",
                        filename: path.tempFilePath,
                        file_length: path.size,
                        length: path.duration * 1000,
                        thumb: _thumbUrl,
                        thumb_secret: _thumb_secret
                        // size: {
                        //   width: width,
                        //   height: height
                        // }
                      },
                      file: {
                        filename: path.tempFilePath,
                        file_length: path.size,
                        length: path.duration * 1000
                      },
                      ext: { imageBase64: _thumbUrl },
                      from: WebIM.conn.context.userId,
                      to: me.to,
                      // roomType: true,
                      chatType: "groupchat",
                      success: function(argument) {
                        // disp.fire('em.chat.sendSuccess', id);
                        console.log("files send ok", argument);
                      },
                      fail(id, serverMsgId) {
                        console.log(`发送文件(id=${id},serverMsgId=${serverMsgId})失败`);
                      }
                    });
                    msgStorage.saveMsg(msg, _msgType);
                    msg.setGroup("groupchat");
                    WebIM.conn.send(msg.body);
                  });
              });
          } else {
            me.toast("目前仅支持.mp4文件");
          }
        } else if (_msgType == msgType.AUDIO) {
          var allowType = ["mp3", "wav"];
          var index = path.tempFilePath.lastIndexOf(".");
          var filetype = (~index && path.tempFilePath.slice(index + 1)) || "";
          if (allowType.indexOf(filetype.toLowerCase()) >= 0) {
            me.$HXAPI
              .chatfiles(str[0], str[1], [path.tempFilePath], ["file"], {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + token,
                "restrict-access": "true"
              })
              .then(res => {
                // 发送 xmpp 消息
                var id = WebIM.conn.getUniqueId();
                var msg = new WebIM.message(msgType.AUDIO, id);
                var dataObj = res[0];
                // 接收消息对象
                msg.set({
                  apiUrl: WebIM.config.apiURL,
                  accessToken: token,
                  body: {
                    type: msgType.AUDIO,
                    url: dataObj.uri + "/" + dataObj.entities[0].uuid,
                    filetype: filetype,
                    filename: `${id}audio.${filetype}`,
                    secret: dataObj.entities[0]["share-secret"],
                    length: Math.ceil(path.duration / 1000)
                  },
                  file: {
                    filename: path.tempFilePath,
                    file_length: path.fileSize,
                    length: Math.ceil(path.duration / 1000)
                  },
                  length: Math.ceil(path.duration / 1000),
                  from: WebIM.conn.context.userId,
                  to: me.to,
                  // roomType: true,
                  chatType: "groupchat",
                  success: function(argument) {
                    // disp.fire('em.chat.sendSuccess', id);
                    console.log("audio send ok", argument, msg);
                  }
                });
                msgStorage.saveMsg(msg, _msgType);
                msg.setGroup("groupchat");
                WebIM.conn.send(msg.body);
              });
          } else {
            me.toast("目前仅支持.wav文件");
          }
        }
      }
    },
    openImage() {
      let that = this;
      wx.chooseImage({
        sizeType: ["original", "compressed"], //所选的图片的尺寸
        sourceType: ["album"], //
        count: 1,
        //接口调用成功的回调函数
        success: function(res) {
          that.upLoadFile(res.tempFilePaths); //数组临时路径
        }
      });
    },
    openCamera() {
      var that = this;
      wx.chooseMedia({
        count: 1,
        mediaType: ["image", "video"],
        sourceType: ["camera"],
        maxDuration: 10,
        camera: "back",
        sizeType: "original",
        success(res) {
          console.log(res);
          if (res.type == "video") {
            that.upLoadFile(res.tempFiles, msgType.VIDEO);
          } else {
            var paths = res.tempFiles.map(item => {
              return item.tempFilePath;
            });
            that.upLoadFile(paths, msgType.IMAGE); //临时路径
          }
        }
      });
    },
    openVideo() {
      var that = this;
      wx.chooseMedia({
        count: 1,
        mediaType: ["video"],
        sourceType: ["album"],
        maxDuration: 10,
        sizeType: "original",
        success(res) {
          console.log(res);
          if (res.type == "video") {
            that.upLoadFile(res.tempFiles, msgType.VIDEO);
          } else {
            var paths = res.tempFiles.map(item => {
              return item.tempFilePath;
            });
            that.upLoadFile(paths, msgType.IMAGE); //临时路径
          }
        }
      });
    },
    chooseLocation() {
      var that = this;
      wx.chooseLocation({
        success(res) {
          var id = WebIM.conn.getUniqueId();
          var msg = new WebIM.message(msgType.LOCATION, id);
          msg.set({
            msg: "",
            from: WebIM.conn.context.userId,
            to: that.to,
            lng: res.longitude,
            lat: res.latitude,
            addr: res.name,
            // addr: res.address,
            ext: {
              name: res.name,
              address: res.address
            },
            // roomType: true,
            chatType: "groupchat",
            success(argument) {
              // disp.fire('em.chat.sendSuccess', id);
              console.log("location send ok", argument);
            }
          });
          msgStorage.saveMsg(msg,  msgType.LOCATION);
          msg.setGroup("groupchat");
          WebIM.conn.send(msg.body);
        }
      });
    },
    ...mapActions(["chcekSensitiveWords"])
  },
  async mounted() {
    var that = this;
    this.sId = this.$route.query.sId;
    let shopInfo = {};
    var rep = await this.$ShoppingAPI.Shop_GetDetails({ sId: this.sId });
    if (rep.ret == 0) {
      shopInfo = rep.data;
      if (this.isMP)
        //设置标题
        wx.setNavigationBarTitle({ title: shopInfo.sName });

      //店铺Id为创建人
      var owner = shopInfo.sId.replace(/-/g, "").toLowerCase() + "_"; //需要根据owner获取当前店铺客服聊天组
      //查询聊天组列表,并尝试获取与该店铺的聊天组
      var listGroup = utils.getItem("listGroup");
      // console.log("listGroup:", listGroup);
      if (listGroup) {
        this.chatRoomInfo = listGroup.find(item => {
          return item.owner == owner;
        });
      }
      // console.log(this.chatRoomInfo);
      that.desc_obj = {
        store: {
          sId: shopInfo.sId,
          sNm: shopInfo.sName,
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
      if (!this.chatRoomInfo || !this.chatRoomInfo.id) {
        var groupname, members, desc;
        desc = JSON.stringify(that.desc_obj);
        desc = desc.replace(/\//g, "#"); //格式化url
        groupname = `${this.UserInfo.Phone}_${shopInfo.sName}`;

        //把店铺成员一起拉进来
        var rep = await this.$ShoppingAPI.ShopEmployee_Get(shopInfo.sId);
        if (rep.ret == 0) {
          var _menberArr = rep.data.map(item => {
            return item.UserId.replace(/-/g, "");
          });
          _menberArr.push(this.UserInfo.UserId.replace(/-/g, ""));
          members = _menberArr.join();
          // console.log(groupname, owner, members, desc);
          let rep2 = await that.$API2.groupChat_Create(groupname, owner, members, desc);
          if (rep2.ret == 0) {
            this.chatRoomInfo = {
              id: rep2.data.groupid,
              name: groupname,
              description: desc,
              membersonly: false,
              allowinvites: true,
              maxusers: 200,
              owner: owner,
              created: new Date().getTime(),
              custom: "",
              affiliations_count: _menberArr.length + 1,
              affiliations: _menberArr,
              public: false,
              mute: false,
              scale: "normal"
            };//listGroup 数据结构
            listGroup.push(this.chatRoomInfo);//本地手动push,减少网络请求

            console.log(`新建聊天室成功`, this.chatRoomInfo);
            utils.setItem("listGroup", listGroup);
          }
        }
      } else {
        // //更新聊天室备注
        try {
          var dencode_str = decodeURIComponent(this.chatRoomInfo.description);
          var server_desc_obj = JSON.parse(dencode_str);
          server_desc_obj.lastTime = Math.round(new Date().getTime() / 1000);
          server_desc_obj.buyer = that.desc_obj.buyer;
          server_desc_obj.store = that.desc_obj.store;
          var json_obj = JSON.stringify(server_desc_obj);
          json_obj = json_obj.replace(" ", ""); //处理空格
          that.$API2.groupChat_ModifyDescription(
            that.chatRoomInfo.id,
            json_obj.replace(/\//g, "#") //处理斜杠
          );
        } catch (e) {
          var desc = JSON.stringify(that.desc_obj);
          desc = desc.replace(/\//g, "#"); //处理斜杠
          that.$API2.groupChat_ModifyDescription(this.chatRoomInfo.id, desc);
        }
      }
      // console.log(this.sessionKey);
      var chatMsg = utils.getItem(this.sessionKey);
      this.readMsg(null, null, chatMsg, this.sessionKey);
    }
    this.EmojiObj2 = WebIM.EmojiObj2;

    msgStorage.on("newChatMsg", function(renderableMsg, type, curChatMsg, sesskey) {
      // console.log("newChatMsg:",renderableMsg, curChatMsg)
      // 判断是否属于当前会话
      if (that.chatRoomInfo.id && sesskey == that.sessionKey) {
        if (renderableMsg.info.from == that.chatRoomInfo.id || renderableMsg.info.to == that.chatRoomInfo.id) {
          //群消息或者群成员发出的消息
          that.readMsg(renderableMsg, type, curChatMsg, sesskey, true);
        } else if (renderableMsg.info.from == WebIM.conn.context.userId || renderableMsg.info.to == WebIM.conn.context.userId) {
          //我发的消息或者别人发给我的消息
          that.readMsg(renderableMsg, type, curChatMsg, sesskey);
        }
      }
    });
    msgStorage.on("updateChatMsg",function(curChatMsg,sesskey)
    {
      if (that.chatRoomInfo.id && sesskey == that.sessionKey)
      {
          that.readMsg(null, null, curChatMsg, sesskey);
      }
    });
  }
};
</script>
<style>
page {
  height: 100%;
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
.chatbox {
  height: 90%;
  flex-grow: 2;
  padding-bottom: 2%;
  overflow: hidden;
  overflow-y: scroll;
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
.input-chat-box {
  width: 100%;
  border-top: 0.02rem solid #898989;
  padding-top: 0.2rem;
  background-color: #fdfdfd;
  flex-grow: 1;
  position: relative;
  .Checkbox-tool {
    position: absolute;
    background-color: #fff;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    transform: translateY(100%);
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s ease-in;
    display: flex;
    justify-content: center;
    align-items: center;
    .item {
      text-align: center;
      &:not(:last-child) {
        margin-right: 0.5rem;
      }
    }
  }
  .Checkbox-tool.show {
    transform: none;
    visibility: visible;
    opacity: 1;
  }
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
  form {
    flex-grow: 2;
  }
  .msg_input {
    padding: 0 0.1rem;
    // height: fit-content;
    min-height: 1rem;
    max-height: 2rem;
    width: 7.5rem;
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
  input.submit_btn {
    display: none;
  }
  .icon {
    font-size: 0.7rem;
    margin-right: 0.2rem;
    margin: 0 0.15rem;
  }
  .icon.focus {
    color: #12b7f5;
  }
}

.emojibox {
  height: auto;
  width: auto;
  // margin-bottom:0.2rem;
  // padding-bottom:0.2rem;
  .swiper {
    background-color: #ecf0f1;
    height: 3.3rem;
  }
  .swiper-slide {
    margin-bottom: 20px;
  }
  .swiper-pagination {
    bottom: 0;
    z-index: 0;
  }
  img {
    width: 0.8rem;
    height: 0.8rem;
    margin-top: 0.15rem;
  }
  img:not(:first-child) {
    padding-left: 0.7rem;
  }
  img:nth-child(7n + 1),
  img:first-child {
    padding-left: 0.5rem;
  }
  .toolbox {
    display: flex;
    justify-content: flex-end;
    .btn_send {
      padding: 0.3rem;
      background-color: #12b7f5;
      color: #ecf0f1;
      font-size: 0.45rem;
    }
  }
}
.moremsg {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #ecf0f1;
  padding: 0.3rem 0;
  z-index: 101;
  span.iconbox {
    text-align: center;
    .icon {
      background-color: #fff;
      padding: 0.3rem 0.4rem;
      border: 0.02rem solid #fff;
      border-radius: 0.3rem;
      font-size: 0.7rem;
    }
    p {
      color: #898989;
      font-size: 0.4rem;
    }
  }
}
</style>
