<template>
  <div class="audio-box" :class="{open:isOpen}" @click="openAudio">
    <div class="wifi-symbol" :class="['wifi-symbol-'+position]">
      <div class="wifi-circle first"></div>
      <div class="wifi-circle second"></div>
      <div class="wifi-circle third"></div>
    </div>
    <span>'{{msgdata.length}}</span>
  </div>
</template>
<script>
import utils from "@/utils";

export default {
  props: {
    position: String,
    msgdata: Object
  },
  data() {
    return {
      isOpen: false
    };
  },
  computed: {
    innerAudioContext() {
      var that = this;
      const _innerAudioContext = wx.createInnerAudioContext();
      _innerAudioContext.onError(res => {
        console.log("播放失败:" + res.errMsg);
      });
      _innerAudioContext.onEnded(() => {
        console.log("播放结束");
        //   that.innerAudioContext.destroy();
        //   that.innerAudioContext = null;
        that.isOpen = false;
      });
      _innerAudioContext.onPlay(() => {
        that.isOpen = true;
      });
      return _innerAudioContext;
    }
  },
  methods: {
    openAudio() {
      var that = this;
      var _index = this.msgdata.data.lastIndexOf('/');
      var fileuri = this.msgdata.data.substring(++_index);
      var _audioCache= utils.getItem("audioCache");
      if(_audioCache)
      {
         var audioFilePath =  _audioCache[fileuri];
         if(audioFilePath)
         {
           that.innerAudioContext.src = audioFilePath;
           that.innerAudioContext.play();
           return;
         }else
         {
           this.downloadAudio(_audioCache);
         }
          
      }else
      {
        this.downloadAudio()
      }
    },
    downloadAudio(_audioCache){
      var that = this;
      var _index = this.msgdata.data.lastIndexOf('/');
      var fileuri = this.msgdata.data.substring(++_index);
        wx.downloadFile({
          url: this.msgdata.data,
          header: {
            "X-Requested-With": "XMLHttpRequest",
            Accept: "audio/mp3",
            Authorization: "Bearer " + that.msgdata.token
          },
          success(res) {
            console.log("音频本地", res);
            var curl = res.tempFilePath;
            //renderableMsg.msg.url = res.tempFilePath;
            var obj=_audioCache||{};
            obj[fileuri]=res.tempFilePath
            utils.setItem("audioCache",obj);
            that.innerAudioContext.src = curl;
            that.innerAudioContext.play();
          },
          fail(e) {
            console.log("downloadFile failed", e);
            that.toast("下载失败");
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.audio-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  transform: translate3d(0, 0, 0); /*父元素使用transform:translate3d 属性*/
  -webkit-transform: translate3d(0, 0, 0);
  .wifi-symbol {
    width: 0.8rem;
    height: 0.8rem;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    .wifi-circle {
      border: 0.02rem solid #000;
      border-radius: 50%;
      position: absolute;
    }

    .first {
      width: 0.2rem;
      height: 0.2rem;
      /* background: #999999; */
      top: -18%;
      left: -18%;
    }

    .second {
      width: 0.4rem;
      height: 0.4rem;
      top: -28%;
      left: -28%;
    }
    .third {
      width: 0.6rem;
      height: 0.6rem;
      top: -38%;
      left: -38%;
    }
  }
  .wifi-symbol-left {
    transform: rotate(315deg);
  }
  .wifi-symbol-right {
    transform: rotate(135deg);
  }
}
.open {
  .second {
    animation: fadeInOut 1s infinite 0.2s;
  }
  .third {
    animation: fadeInOut 1s infinite 0.4s;
  }
}

@keyframes fadeInOut {
  0% {
    opacity: 0; /*初始状态 透明度为0*/
  }
  100% {
    opacity: 1; /*结尾状态 透明度为1*/
  }
}
</style>