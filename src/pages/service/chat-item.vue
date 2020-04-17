<template>
  <div class="chat-item" :id="chatdata.mid" :class="chatdata.info.from==myUsername?'chat-my':'chat-other'">
    <p class="time">{{fmtChattime}}</p>
    <!-- 用户对话框 -->
    <div class="chat-content" >
      <div class="dialog_box">
        <p v-if="chatdata.info.from==myUsername" class="username">{{UserInfo.UserName}}</p>
        <p v-else class="username">{{(chatRoomInfo.desc&&chatRoomInfo.desc.store)?chatRoomInfo.desc.store.sNm:""}}</p>
        <!-- <span class="read">已读</span> -->
        <div v-if="chatdata.msg.data" class="chatdata">
          <div v-if="chatdata.msg.type=='emoji' || chatdata.msg.type=='txt'" class="chatmsgarr">
            <chatMsg v-for="(item,index) in chatdata.msg.data" :key="index" :msgdata="item"></chatMsg>
          </div>
          <img v-else-if="chatdata.msg.type=='img'" lazy-load="true" class="avatar" @click="previewImage(chatdata.msg.data)" :src="chatdata.msg.data" mode="widthFix" />
          <video v-else-if="chatdata.msg.type == 'video'" :src="chatdata.msg.data" controls autoplay></video>
          <!-- <map v-else-if="chatdata.msg.type == 'location'" id="map" :longitude="chatdata.msg.data.lng" :latitude="chatdata.msg.data.lat" enable-scroll="false" enable-zoom="false" :markers="markers" scale="16" style="width: 200px; height: 150px;"></map> -->
          <div v-else-if="chatdata.msg.type == 'location'" class="loc" @click="mapclick" >
            <img src="../../../static/img/maps.png">
            <p class="addr">{{chatdata.msg.data.addr}}</p>
          </div>
        </div>
        <span v-else>&nbsp;</span>
        <img v-if="chatdata.info.from==myUsername" :src="UserInfo.Portrait" alt />
        <img v-else :src="(chatRoomInfo.desc&&chatRoomInfo.desc.store)?chatRoomInfo.desc.store.sLogo:''" alt />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import utils from "@/utils";
import chatMsg from "@/pages/service/chat-msg";
export default {
  props: {
    chatdata: Object,
    chatRoomInfo: Object,
  },
  data(){
    return {
      markers:[{
        id: 0,
        latitude: this.chatdata.msg.data.lat,
        longitude: this.chatdata.msg.data.lng,
        title:this.chatdata.msg.data.addr
      }]
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
    }
  },
  components: {
    chatMsg
  },
  methods: {
    mapclick(){
      if (this.isMP) {
        wx.openLocation({
          latitude:this.chatdata.msg.data.lat,
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
    }
  },
  
};
</script>
<style scoped  lang="scss">
.chat-item {
  margin: 0.28rem 0;
  text-align: center;
}

.chat-my .chat-content {
  /* margin: 0.4rem auto; */
  /* float: right; */
  word-break: break-all;
  display: flex;
  justify-content: flex-end;
}
.chat-other .chat-content {
  display: flex;
  justify-content: flex-start;
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
  .chatdata{
    padding: 0.5rem;
  }
}

.chatmsgarr{
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
  .chatdata{
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
video{
  width: 2.5rem;
  height: 2.5rem;
}
.loc{
  position: relative;
  img{
    width: 2.5rem;
    height: 2.5rem;
  }
  p.addr{
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #000;
    color: #fff;
    font-size: 0.3rem;
    text-align: left;
    padding-left: 0.1rem;
    opacity:0.7;
    filter:alpha(opacity=70); /* 针对 IE8 以及更早的版本 */
  }
}
</style>
