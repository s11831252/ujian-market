<template>
  <div class="pay">
    <div class="pay-info">
      <div class="pay-info-title">交易金额</div>
      <div class="pay-money">￥{{money}}</div>
    </div>
    <ul class="pay-mode">
      <li :class="{action:PayMode==0}" @click="selectPayMode(0)">
        <i class="icon icon-ye">&#xe62a;</i>余额支付
        <i class="icon right" v-if="PayMode==0">&#xe633;</i>
      </li>
      <li :class="{action:PayMode==1}" @click="selectPayMode(1)">
        <img class="wx" src="/static/img/wx.png" mode="aspectFit" />
        <i class="icon right" v-if="PayMode==1">&#xe633;</i>
      </li>
      <li :class="{action:PayMode==2}" @click="selectPayMode(2)">
        <img class="zfb" src="/static/img/zhifubao.png" mode="aspectFit" />
        <i class="icon right" v-if="PayMode==2">&#xe633;</i>
      </li>
    </ul>
    <div class="pay-confirm">
      <button class="btn-ok" @click="pay">确定支付</button>
      <button class="btn-no">稍后付款</button>
    </div>
    <div class="modal pay-validCodeBox" v-if="modalOpen" @click="openModal">
      <div class="modal-container" @click.stop>
        <div class="box-title">
          <i class="icon"></i><span>请输入验证码</span>
        </div>
        <div class="box-body">
          <p>商城付款</p>
          <p class="pay-money">￥{{money}}</p>
          <p><a class="countDown" @click="countDown">{{countDownStr}}</a></p>
          <div class="blocks">
            <input type="number" maxlength="4" v-model="code" focus=’true’ auto-focus=’true’ />
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      OrderInfo: {
        TotalAmount: 0.0,
        PayAmount: 0.0,
        GoodsAmount: 0.0,
        DifferenceAmount: 0.0,
        State: 0
      },
      code: "",
      PayMode: 0,
      OrderId: "",
      modalOpen: false,
      countDownStr: "点击发送验证码",
      sendTime: 0
    };
  },
  watch: {
    code(newval, oldval) {
      if (newval.length == 4) {
        // console.log(oldval,newval);
        var rep = this.$ShoppingAPI.Order_Pay({
          OrderId: this.OrderId,
          VerificationCode: newval
        });
        if (rep.ret == 0) {
          this.replace({ path: "/pages/order/index" });
        }
      }
    }
  },
  methods: {
    selectPayMode(paymode) {
      this.PayMode = paymode;
    },
    openModal() {
      this.modalOpen = !this.modalOpen;
      this.code = "";
    },
    async pay() {
      this.openModal();
      if (this.sendTime == 0) {
        var rep = await this.$ShoppingAPI.Order_ValidationCode();
        if (rep.ret == 0) {
          this.countDown();
        }
      }
    },
    countDown() {
      if (this.sendTime == 0) {
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
  },
  computed: {
    money() {
      return (this.OrderInfo.TotalAmount - this.OrderInfo.PayAmount).toFixed(2);
    }
  },
  async mounted() {
    if (this.$route.query && this.$route.query.OrderId) {
      this.OrderId = this.$route.query.OrderId;
      var rep = await this.$ShoppingAPI.Order_Get({ OrderId: this.OrderId });
      if (rep.ret == 0) {
        this.OrderInfo = rep.data[0];
      }
    }
  }
};
</script>
<style lang="less" scoped>
.pay {
  margin-top: 5px;
  .pay-info {
    text-align: center;
    padding: 24px 0;
    margin: 20px 10px;
    border-bottom: 1px solid #12b7f5;
    .pay-info-title {
      color: #6a6a6a;
      font-size: 17px;
    }
    .pay-money {
      margin-top: 10px;
      color: #ff5252;
      font-size: 30px;
    }
  }
  .pay-mode {
    margin: 0px 10px;
    li {
      height: 35px;
      padding: 10px;
      border-bottom: 1px solid #ecf0f1;
      i {
        display: inline-block;
        font-size: 28px;
        color: #12b7f5;
        margin-right: 10px;
      }
      .zfb,
      .wx {
        display: inline-block;
        height: 35px;
        max-width: 30%;
        margin-right: 10px;
      }
    }
  }
  .pay-confirm {
    position: absolute;
    bottom: 0px;
    text-align: center;
    width: 100%;
    .btn-ok {
      line-height: initial;
      background-color: #12b7f5;
      font-size: 16px;
      font-weight: bold;
      padding: 4px 16px;
      border: 0;
      color: #ffffff;
      border-radius: 5px;
      display: inline-block;
      width: 80%;
    }
    .btn-no {
      background-color: #fff;
      line-height: initial;
      font-size: 16px;
      font-weight: bold;
      padding: 4px 16px;
      border: 0;
      color: #12b7f5;
      display: inline-block;
      width: 80%;
    }
  }
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
      width: 70%;
      background-color: #fff;
      text-align: center;
      position: relative;
      .countDown {
        color: #12b7f5;
      }
      .pay-money {
        margin-top: 10px;
        color: #ff5252;
        font-size: 25px;
      }
      .tip {
        font-size: 12px;
      }
      .blocks {
        text-align: center;
          position: relative;
          display: flex;
          // flex-direction: row;
          // align-items: center;
          justify-content:center;
        .block {
          width: 30px;
          height: 30px;
          border: 1px solid #5c5c5c;
          margin-left: 10px;
          span{
            line-height: 30px;
          }
        }
        .cursor {
          text-align: center;
          color: transparent;
          //光标的样式
          width: 1px;
          height: 30px;
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
          height: 30px;
        }
      }
    }
  }
}
</style>
