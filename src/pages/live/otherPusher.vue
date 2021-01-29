<!--
 * @Author: SCH
 * @Date: 2021-01-29 10:42:29
 * @LastEditors: your name
 * @LastEditTime: 2021-01-29 11:01:03
 * @Description: other-pusher
-->
<template>
  <live-pusher :url="url" @statechange="statechange" mode="RTC" autopush @error="error" class="other-pusher">
    <cover-image class="audio_img" v-if="isAudio" src="../../static/img/yuyin.png"></cover-image>
  </live-pusher>
</template>
<script>
export default {
  props: {
    url: String
  },
  computed: {
    isAudio() {
      if (this.url) {
        return this.url.indexOf("audio") > -1;
      } else return false;
    }
  },
  methods: {
    statechange(e) {
      var detail = e.mp.detail;
      console.log("live-player code:", detail);
    },
    error(e) {
      var detail = e.mp.detail;
      console.error("live-player error:", detail);
    }
  }
};
</script>
<style lang="scss" scoped>
.other-pusher {
  width: 2.3rem;
  height: 2.5rem;
  margin-bottom: 0.4rem;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.2);
  position: relative;
  .audio_img {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>