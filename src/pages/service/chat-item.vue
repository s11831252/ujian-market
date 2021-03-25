<template>
  <div class="chat-item" :id="chatdata.mid" :class="chatdata.info.from==myUsername?'chat-my':'chat-other'">
    <p class="time">{{fmtChattime}}</p>
    <!-- 用户对话框 -->
    <div class="chat-content" :class="{showCheckbox:showCheckbox}" @click.stop="$emit('checked',checked=!checked,chatdata)">
      <div class="checkbox" :class="{checked:checked}" v-show="showCheckbox">
        <i v-show="checked" class="icon">&#xe633;</i>
        <i v-show="!checked" class="icon">&nbsp;</i>
      </div>
      <div class="dialog_box">
        <p v-if="chatdata.info.from==myUsername" class="username">{{UserInfo.UserName}}</p>
        <p v-else class="username">{{(desc&&desc.store)?desc.store.sNm:""}}</p>
        <!-- <span class="read">已读</span> -->
        <div class="m-load2" v-if="chatdata.msg.sending">
          <div class="line">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
          <div class="circlebg"></div>
        </div>
        <div v-if="chatdata.msg.data" class="chatdata" @longpress="editmsg">
          <div v-if="chatdata.msg.type=='emoji' || chatdata.msg.type=='txt'" class="chatmsgarr">
            <chatMsg v-for="(item,index) in chatdata.msg.data" :key="index" :msgdata="item"></chatMsg>
          </div>
          <img v-else-if="chatdata.msg.type=='img'" lazy-load="true" class="avatar" @click.stop="previewImage(chatdata.msg.data)" :src="chatdata.msg.data" mode="widthFix" />
          <video v-else-if="chatdata.msg.type == 'video'" :src="chatdata.msg.data" controls autoplay></video>
          <audioMsg v-else-if="chatdata.msg.type == 'audio'" :msgdata="chatdata.msg" :position="chatdata.info.from==myUsername?'right':'left'"></audioMsg>
          <div v-else-if="chatdata.msg.type == 'location'" class="loc" @click.stop="mapclick">
            <img src="../../../static/img/maps.png" />
            <p class="addr">{{chatdata.msg.data.addr}}</p>
          </div>
          <!-- <div class="tool-box" :class="{show:showTool}" @click.stop> -->
          <div class="tool-box" v-if="showTool" @click.stop>
            <div class="mask" @touchstart="showTool=false"></div>
            <ul class="list">
              <li class="item" @click="$emit('delMsg',chatdata);showTool=false;">删除</li>
              <li class="item" @click="$emit('onShowCheckbox',true);$emit('checked',checked=true,chatdata);showTool=false;">多选</li>
              <li class="item" v-if="chatdata.msg.type=='emoji' || chatdata.msg.type=='txt'" @click="copyMsg">复制</li>
              <li class="item" @click="showTool=false">取消</li>
            </ul>
          </div>
        </div>
        <span v-else>&nbsp;</span>
        <img v-if="chatdata.info.from==myUsername" :src="UserInfo.Portrait" alt />
        <img v-else :src="(desc&&desc.store)?desc.store.sLogo:''" alt />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import utils from "@/utils";
import chatMsg from "@/pages/service/chat-msg";
import audioMsg from "@/pages/service/audio";

export default {
  props: {
    chatdata: Object,
    desc: Object,
    showCheckbox: Boolean
  },
  data() {
    return {
      startPoint: null,
      showTool: false,
      checked: false
    };
  },
  watch: {
    showCheckbox(newval, oldval) {
      if (!newval && oldval) {
        this.checked = false;
      }
    }
  },
  computed: {
    ...mapState({
      UserInfo: state => state.User.UserInfo
    }),
    fmtChattime() {
      return this.chatdata.time;
    },
    myUsername() {
      var _myUsername = utils.getItem("myUsername");
      return _myUsername;
    },
  },
  components: {
    chatMsg,
    audioMsg
  },
  methods: {
    mapclick() {
      if (this.isMP) {
        wx.openLocation({
          latitude: this.chatdata.msg.data.lat,
          longitude: this.chatdata.msg.data.lng,
          scale: 28
        });
      }
    },
    previewImage(url) {
      if (this.isMP) {
        wx.previewImage({
          urls: [url] // 需要预览的图片 http 链接列表
        });
      }
    },
    editmsg(e) {
      var that = this;
      this.startPoint = e.touches[0];
      setTimeout(() => {
        that.showTool = true;
      }, 300);
    },
    copyMsg() {
      var that = this;
      if(this.chatdata.msg.type=='emoji' || this.chatdata.msg.type=='txt')
      {
        let copyText = "";
        for (const item of this.chatdata.msg.data) {
          copyText += item.data;
        }
        wx.setClipboardData({
          data: copyText,
          success(res) {
            console.log("复制文本成功", res);
            that.showTool = false;
          }
        });
      }else return;

    }
  }
};
</script>
<style scoped  lang="scss">
.chat-item {
  margin: 0.28rem 0;
  text-align: center;
  position: relative;
}

.chat-my .chat-content {
  /* margin: 0.4rem auto; */
  /* float: right; */
  word-break: break-all;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.chat-other .chat-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.chat-content {
  .checkbox {
    color: #353333;
    width: 0.45rem;
    height: 0.45rem;
    line-height: 0.45rem;
    font-size: 0.38rem;
    border-radius: 50%;
    margin: 0 0.3rem;
    border: 0.04rem solid #353333;
    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .checkbox.checked {
    background-color: rgb(3, 148, 3);
    border-color: transparent;
    color: #fff;
  }
}
.chat-my .chat-content.showCheckbox {
  justify-content: space-between;
}
.time {
  font-size: 0.3rem;
  color: #5c5c5c;
  /* 让内容强制不换行 */
  white-space: nowrap;
  margin-bottom: 0.47rem;
}
.chat-my .chat-content .username {
  font-size: 0.3rem;
  color: #5c5c5c;
  /* 让内容强制不换行 */
  white-space: nowrap;
  position: absolute;
  right: 0.15rem;
  top: -0.5rem;
}
.chat-my .chat-content .read {
  font-size: 0.3rem;
  color: #a2a2a2;
  position: absolute;
  left: -0.74rem;
  top: 50%;
}

.chat-my .chat-content .dialog_box {
  max-width: 6.5rem;
  /* css3属性，fit-content既是让宽度随内容大小变化 */
  width: fit-content;
  font-size: 0.4rem;
  color: #5c5c5c;
  background-color: #d2e0e1;
  border-radius: 0.1rem;
  position: relative;
  margin-right: 1.5rem;
  .chatdata {
    padding: 0.5rem;
  }
}

.chatmsgarr {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
/* 右侧小三角形 */
.chat-my .chat-content .dialog_box:after {
  border: 0.1rem solid transparent;
  border-left: 0.25rem solid #d2e0e1;
  position: absolute;
  content: "";
  top: 0.8rem;
  margin-top: -0.2rem;
  left: 100%;
}
.chat-my .chat-content .dialog_box > img {
  width: 1.08rem;
  height: 1.09rem;
  border-radius: 50%;
  background-color: #5c5c5c;
  position: absolute;
  right: -1.4rem;
  top: 0.2rem;
}
.chat-other .chat-content .username {
  font-size: 0.3rem;
  color: #5c5c5c;
  /* 让内容强制不换行 */
  white-space: nowrap;
  position: absolute;
  left: 0.15rem;
  top: -0.5rem;
}
.chat-other .chat-content .read {
  font-size: 0.3rem;
  color: #a2a2a2;
  position: absolute;
  right: -0.74rem;
  top: 40%;
}
.chat-other .chat-content .dialog_box {
  max-width: 6.5rem;
  /* css3属性，fit-content既是让宽度随内容大小变化 */
  width: fit-content;
  font-size: 0.4rem;
  color: #5c5c5c;
  background-color: #fdfdfd;
  border-radius: 0.1rem;
  position: relative;
  margin-left: 1.5rem;
  .chatdata {
    padding: 0.5rem;
  }
}
/* 左侧小三角形 */
.chat-other .chat-content .dialog_box:after {
  border: 0.1rem solid transparent;
  border-right: 0.25rem solid #fdfdfd;
  position: absolute;
  content: "";
  top: 0.8rem;
  margin-top: -0.2rem;
  right: 100%;
}
.chat-other .chat-content .dialog_box > img {
  width: 1.08rem;
  height: 1.09rem;
  border-radius: 50%;
  background-color: #5c5c5c;
  position: absolute;
  left: -1.4rem;
  top: 0.2rem;
}
.avatar {
  max-width: 1.5rem;
  max-height: 2.5rem;
}
video {
  width: 2.5rem;
  height: 2.5rem;
}
.loc {
  position: relative;
  img {
    width: 2.5rem;
    height: 2.5rem;
  }
  p.addr {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #000;
    color: #fff;
    font-size: 0.3rem;
    text-align: left;
    padding-left: 0.1rem;
    opacity: 0.7;
    filter: alpha(opacity=70); /* 针对 IE8 以及更早的版本 */
  }
}
.chat-content .dialog_box {
  .tool-box {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    .mask {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: 9;
      // visibility: hidden;
      // display: none;
      // background: rgba($color: #000000, $alpha: 0.2);
    }
    .list {
      font-size: 0.36rem;
      background-color: rgb(80, 80, 80);
      color: #fff;
      position: absolute;
      top: -0.9rem;
      right: -1.3rem;
      left: auto;
      display: flex;
      // transform: translateY(-100%);
      // visibility: hidden;
      // opacity: 0;
      // transition: all 0.3s ease-in;
      // width: 3rem;
      // justify-content: center;
      align-items: center;
      z-index: 10;
      .item {
        // padding: 0 0.3rem;
        width: 1.2rem;
        height: 0.4rem;
        line-height: 0.4rem;
        margin: 0.2rem 0;
        &:not(:last-child) {
          border-right: 0.02rem dashed rgb(238, 238, 238);
        }
      }
      &:after {
        border: 0.15rem solid transparent;
        border-top: 0.15rem solid rgb(80, 80, 80);
        position: absolute;
        content: "";
        top: 100%;
        left: 60%;
      }
    }
  }
  // .tool-box.show{
  //   .mask{
  //     // visibility: visible;
  //     display: block;
  //   }
  //   .list{
  //     transform: none;
  //     visibility: visible;
  //     opacity: 1;
  //   }
  // }
}
.chat-other .chat-content .dialog_box {
  .tool-box{
    .list {
      right: auto;
      left: -1.3rem;
    }
    .list:after {
      position: absolute;
      top: 100%;
      left: 40%;
    }
  }
}

.m-load2{
  top: 0.5rem;
  left: -1rem;
}
</style>
