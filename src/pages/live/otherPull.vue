<!--
 * @Author: your name
 * @Date: 2021-01-29 09:50:53
 * @LastEditors: your name
 * @LastEditTime: 2021-01-29 17:04:34
 * @Description: file content
-->
<template>
  <live-player :src="url" mode="live" autoplay class="other-play" :class="{isAudio:isAudio}">
    <cover-image class="audio_img" v-if="isAudio" src="../../static/img/yuyin.png"></cover-image>
    <cover-view class="name">{{pullName}}</cover-view>
  </live-player>
</template>
<script>
export default {
  props: {
    url: String,
    members: Array
  },
  computed: {
    isAudio() {
      if (this.url) {
        return this.url.indexOf("audio") > -1;
      } else return false;
    },
    pullName() {
      if (this.members && this.members.length > 0) {
        var _member = this.members.find(item => {
          return this.url.indexOf(item.member) > -1;
        });
        if (_member) return _member.UserName;
        else return "";
      } else {
        return "";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.other-play {
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
  .name {
    position: absolute;
    left: 0.05rem;
    bottom: 0.05rem;
    color: #fff;
    font-size: 0.36rem;
  }
}
</style>
