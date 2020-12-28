<template>
  <swiper class="recorderbox" :class="{'action':recording}">
    <swiper-item>
      <i class="icon" @longpress="openRecorder" @touchend="closeRecorder" @touchmove="handleTouchMove">&#xe648;</i>
      <p>{{recording?'松开即可发送':'长按开始录音'}}</p>
    </swiper-item>
  </swiper>
</template>
<script>
export default {
  props: {
      recordSuccess:Function
  },
  data() {
    return {
      recording: false,
      startPoint:null
    };
  },
  computed: {
    recorderManager() {
      return wx.getRecorderManager();
    }
  },
  methods: {
    openRecorder(e) {
      var that = this;
      this.startPoint=e.touches[0]
      setTimeout(() => {
        const options = {
          duration: 10000,
          sampleRate: 44100,
          numberOfChannels: 2,
          encodeBitRate: 192000,
          format: "wav",
          frameSize: 50
        };
        that.recorderManager.start(options);
        that.recording = true;
      }, 300);
    },
    closeRecorder() {
      this.recorderManager.stop();
    },
    handleTouchMove:function(e){
        console.log(e)
    //计算距离，当滑动的垂直距离大于25时，则取消发送语音
        if (Math.abs(e.touches[e.touches.length - 1].clientY - this.startPoint.clientY)>25){
            this.recording=false;
        }else
            this.recording=true;
    }
  },
  mounted() {
    var that = this;
    this.recorderManager.onStart(() => {
      console.log("recorder start");
      this.recording = true;
    });
    this.recorderManager.onPause(() => {
      console.log("recorder pause");
    });
    this.recorderManager.onStop(res => {
      if(this.recording)
      {
        console.log("recorder stop", res);
        const { tempFilePath } = res;
        if (res.duration < 1000) {
            this.toast("录音时间太短");
        } else {
            this.recordSuccess&&this.recordSuccess(res)
            // this.toast("录音成功");
        }
        this.recording=false;
      }
    });
    this.recorderManager.onFrameRecorded(res => {
      const { frameBuffer } = res;
      console.log("frameBuffer.byteLength", frameBuffer.byteLength);
    });
    wx.getSetting({
      success: res => {
        console.log(res);
        let recordAuth = res.authSetting["scope.record"];
        if (recordAuth == false) {
          //已申请过授权，但是用户拒绝
          wx.openSetting({
            success: function(res) {
            console.log("openSetting:success",res)
              let recordAuth = res.authSetting["scope.record"];
              if (recordAuth == true) {
                that.toast({
                  title: "授权成功",
                  icon: "success"
                });
              } else {
                that.toast({
                  title: "请授权录音",
                  icon: "none"
                });
              }
            },
            fail(res){
                console.log("openSetting:fail " ,res)
            },
            complete(res)
            {
                console.log("openSetting:complete " ,res)
            }
          });
        } else if (recordAuth == true) {
            // 用户已经同意授权
        } else {
          // 第一次进来，未发起授权
          wx.authorize({
            scope: "scope.record",
            success: () => {
              //授权成功
              that.toast({
                title: "授权成功",
                icon: "success"
              });
            }
          });
        }
      },
      fail: function() {
        that.toast("鉴权失败，请重试");
      }
    });
  }
};
</script>
<style  lang="scss" scoped>
.recorderbox {
  margin: 0 auto;
  text-align: center;
  padding: 1rem;
  z-index: 101;
  i,
  p {
    margin: 0 auto;
    width: auto;
  }
  i {
    font-size: 2rem;
    font-weight: bold;
  }
}
.swiper-item {
  position: static;
}
.action {
  color: #12b7f5;
}
</style>