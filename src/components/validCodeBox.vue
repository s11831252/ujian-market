<template>
  <div class="modal pay-validCodeBox" v-if="openModal" @click="$emit('close',false)">
    <div class="modal-container" @click.stop>
      <div class="box-title">
        <i class="icon" @click="$emit('close',false)">&#xe613;</i>
        <span>请输入验证码</span>
      </div>
      <div class="box-body">
        <p class="txt">商城付款</p>
        <p class="pay-money" v-if="priceStr">{{priceStr}}</p>
        <p class="pay-money" v-else>￥{{price}}</p>
        
        <a class="countDown" @click="countDown">{{countDownStr}}</a>
        <div class="blocks">
          <input type="number" maxlength="4" v-model="code" focus="’true’" auto-focus="’true’" />
          <div class="block">
            <span v-if="!code.length" class="cursor"></span>
            <span v-if="code.length">{{code[0]}}</span>
          </div>
          <div class="block">
            <span v-if="code.length==1" class="cursor"></span>
            <span v-if="code.length>1">{{code[1]}}</span>
          </div>
          <div class="block">
            <span v-if="code.length==2" class="cursor"></span>
            <span v-if="code.length>2">{{code[2]}}</span>
          </div>
          <div class="block">
            <span v-if="code.length==3" class="cursor"></span>
            <span v-if="code.length>3">{{code[3]}}</span>
          </div>
        </div>
        <p class="tip">支付验证码已发送到您账号手机，“5分钟”有效</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    //是否打开验证码框
    openModal: {
      type: Boolean,
      default: false
    },
    //输入验证码之前触发, 如:调用服务接口生成验证码短信
    inputBefore: {
      type: Function
    },
    //输入完整验证码之后触发, 如:调用服务端接口完成支付
    inputComplete: {
      type: Function
    },
    //支付的额
    price: {
      type: String
    },
    //支付的文本,有文本显示文本,没有文本限制默认的price格式
    priceStr:{
      type: String
    }
  },
  data() {
    return {
      code: "",
      sendTime: 0,
      countDownStr: "点击发送验证码"
    };
  },
  watch: {
    async code(newval, oldval) {
      console.log("watch code", oldval, newval);
      if (newval.length == 4) {
        var that = this;
        var isOK = this.inputComplete && await this.inputComplete(newval);
        console.log("watch code inputComplete",isOK);
        if (isOK) {
          this.code = "";
          this.countDownStr = "点击发送验证码";
        }
      }
    },
    openModal(newval, oldavl) {
      console.log("watch openModal", newval, oldavl);
      if (newval && !oldavl) {
        //初始是false,新值是true时认为开启短信倒计时
        this.countDown();
      }
    }
  },
  methods: {
    async countDown() {
      if (this.sendTime == 0) {
        let isOk = this.inputBefore && (await this.inputBefore());
        if (isOk) {
          this.sendTime = 60;
          this.countDownStr = this.sendTime + "s后可重新发送";
          var clock = setInterval(() => {
            this.sendTime--;
            if (this.sendTime <= 0) {
              this.countDownStr = "点击发送验证码";
              this.sendTime = 0;
              clearInterval(clock);
            } else {
              this.countDownStr = this.sendTime + "s后可重新发送";
            }
          }, 1000);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.modal {
  position: fixed;
  background: rgba(0, 0, 0, 0.3);
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  text-align: center;
  .modal-container {
    top: 25%;
    margin: 0 auto;
    // padding: 0.5rem;
    width: 70%;
    background-color: #fff;
    text-align: center;
    position: relative;
    .box-title {
      font-size: 0.43rem;
      color: #353535;
      position: relative;
      padding: 0.39rem 0 0.28rem 0;
      border-bottom: 0.03rem solid #64c7ee;
      .icon {
        position: absolute;
        top: 0.39rem;
        left: 0.57rem;
        color: #aaaaaa;
        font-size: 0.5rem;
      }
    }
    .box-body {
      color: #353535;
      margin-top: 0.24rem;
      padding: 0 0.33rem;
      padding-bottom: 0.7rem;
      .txt{
        font-size: 0.38rem;
      }
      .countDown {
        color: #1bb4ee;
        font-size:0.32rem
      }
      .pay-money {
        margin-top: 0.62rem;
        color: #333333;
        font-size: 1rem;
      }
      .tip {
        font-size: 0.32rem;
        color: #8d8d8d;
      }
      .blocks {
        text-align: center;
        position: relative;
        display: flex;
        // flex-direction: row;
        // align-items: center;
        justify-content: center;
        margin: 0.3rem 0;
        .block {
          width: 1.03rem;
          height: 1.03rem;
          border: 0.02rem solid #5c5c5c;
          margin-left: 10px;
          span {
            line-height: 1.03rem;
            font-size: 0.6rem;
          }
        }
        .cursor {
          text-align: center;
          color: transparent;
          //光标的样式
          width: 0.02rem;
          height: 1.03rem;
          display: block;
          background-color: #000;
          animation: focus 0.7s infinite;
        }
        @keyframes focus {
          from {
            opacity: 1;
          }

          to {
            opacity: 0;
          }
        }
        input {
          width: 100%;
          position: absolute;
          color: transparent;
          left: -40%;
          text-align: left;
          padding-right: 100%;
          height: 1.3rem;
        }
      }
    }
  }
}
</style>