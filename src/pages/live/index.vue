<template>
  <div>
    <ul class="room-list">
      <li v-for="(item, index) in rooms" :key="index" @click="joinRoom(item)">
        <img :src="item.cover" />
        <a>{{ item.name }}</a>
      </li>
    </ul>
    <video class="video-js vjs-default-skin" id="my-video" width="100%" height="100%" controls autoplay data-setup='{}' preload="auto">
      <source type="application/x-mpegURL" src="http://122.9.104.217:5500/test.m3u8" />
    </video>
    <!-- <live-player src="rtmp://58.200.131.2:1935/livetv/gxtv" mode="live" autoplay @statechange="statechange" @error="error" style="width: 300px; height: 225px;" /> -->
    <!-- <video src="http://122.9.104.217:5500/test.m3u8" autoplay ></video> -->
    <!-- <videoPlayer class="vjs-custom-skin videoPlayer" :options="playerOptions"></videoPlayer> -->
  </div>
</template>
<script>
import "video.js/dist/video-js.css"; // 引入样式
import videojs from "video.js";
import "videojs-contrib-hls";
// import {videoPlayer} from 'vue-video-player'

// import 'vue-video-player/src/custom-theme.css' // 引入样式
// import 'videojs-flash'

// The actual tech function is registered to video.js automatically; so, there
// is no need to assign it to a variable.
// require('videojs-flash');
// var videojs = require('ue-video-player');
import { mapState } from "vuex";
import WebIM from "@/utils/hx/WebIM";

export default {
  // components:{
  //     videoPlayer
  // },
  data() {
    return {
      rooms: [],
      // playerOptions: {
      //     height: '300',
      //     sources: [{
      //         type: 'rtmp/mp4',
      //         src: 'rtmp://58.200.131.2:1935/livetv/hunantv'
      //     }],
      //     techOrder: ['flash'],
      //     autoplay: false,
      //     controls: true,
      //     notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
      // }
    };
  },
  computed: {
    ...mapState({
      UserInfo: (state) => state.User.UserInfo,
    }),
  },
  methods: {
    getVideo() {
      var myPlayer = videojs("my-video");
      myPlayer.src([
        {
          type: "application/x-mpegURL",
          src: "http://122.9.104.217:5500/test.m3u8",
        },
      ]);
      myPlayer.play();
    },
  },
  async mounted() {
    var that = this;
    this.$nextTick(() => {
      that.getVideo();
    });
    this.wx_login(async () => {
      // var res = await that.$ShoppingAPI.appserver_Ongoing({limit:10,video_type:"live"})
      // that.rooms = res.data.entities
    });
  },
};
</script>
<style lang="scss" scoped>
.room-list {
  li {
    text-align: center;
    width: 50%;
    img {
    }
  }
}
</style>