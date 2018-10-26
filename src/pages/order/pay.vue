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
                <img class="zfb" src="/static/img/wx.png" mode="widthFix" />
                <i class="icon right" v-if="PayMode==1">&#xe633;</i>
            </li>
            <li :class="{action:PayMode==2}" @click="selectPayMode(2)">
                <img class="zfb" src="/static/img/zhifubao.png" mode="widthFix" />
                <i class="icon right" v-if="PayMode==2">&#xe633;</i>
            </li>
        </ul>
        <div class="pay-confirm">
            <button class="btn-ok">确定支付</button>
            <button class="btn-no">稍后付款</button>
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
      PayMode: 0,
      OrderId: ""
    };
  },
  methods:{
      selectPayMode(paymode){
          this.PayMode=paymode
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
    li{
      height: 35px;
      padding: 10px;
      border-bottom:1px solid #ecf0f1;
      i {
        display: inline-block;
        font-size: 28px;
        color: #12b7f5;
        margin-right: 10px;
      }
      .zfb,
      .wx {
        height: 35px;
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
  .btn-no{
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
}

</style>
