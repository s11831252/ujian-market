<template>
  <div class="pay">
    <div class="pay-info">
      <div class="pay-info-title">交易金额</div>
      <div class="pay-money">￥{{ money }}</div>
    </div>
    <ul class="pay-mode">
      <li :class="{ action: PayMode == 0 }" @click="PayMode = 0">
        <i class="icon icon-ye">&#xe62a;</i>余额支付
        <i class="icon right" v-if="PayMode == 0">&#xe633;</i>
      </li>
      <li :class="{ action: PayMode == 1 }" @click="PayMode = 1">
        <img class="wx" src="/static/img/wx.png" mode="aspectFit" />
        <i class="icon right" v-if="PayMode == 1">&#xe633;</i>
      </li>
      <!-- <li :class="{action:PayMode==2}" @click="selectPayMode(2)">
        <img class="zfb" src="/static/img/zhifubao.png" mode="aspectFit" />
        <i class="icon right" v-if="PayMode==2">&#xe633;</i>
      </li>-->
    </ul>
    <div class="pay-confirm">
      <button class="btn-ok" @click="pay">确定支付</button>
      <button class="btn-no" @click="$router.back()">稍后付款</button>
    </div>
    <vaildCodeBox :openModal="modalOpen" @close="modalOpen = false" v-if="OrderInfo" :price="money" :inputBefore="codeBefore" :inputComplete="codeComplete"></vaildCodeBox>

    <!-- <div class="modal pay-validCodeBox" v-if="modalOpen" @click="openModal">
      <div class="modal-container" @click.stop>
        <div class="box-title">
          <i class="icon"></i>
          <span>请输入验证码</span>
        </div>
        <div class="box-body">
          <p>商城付款</p>
          <p class="pay-money">￥{{money}}</p>
          <p>
            <a class="countDown" @click="countDown">{{countDownStr}}</a>
          </p>
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
    </div>-->
  </div>
</template>
<script>
import { mapState } from "vuex";
import vaildCodeBox from "../../components/validCodeBox";

export default {
  components: {
    vaildCodeBox,
  },
  data() {
    return {
      OrderInfo: {
        TotalAmount: 0.0,
        PayAmount: 0.0,
        GoodsAmount: 0.0,
        DifferenceAmount: 0.0,
        State: 0,
      },
      PayMode: 0,
      OrderId: "",
      modalOpen: false,
    };
  },
  methods: {
    async codeComplete(code) {
      var that = this;
      var rep = await this.$ShoppingAPI.Order_Pay({
        OrderId: this.OrderId,
        VerificationCode: code,
      });

      if (rep.ret == 0) {
        //弹出提示框
        that.modal({
          title: "支付成功",
          content: "您已支付成功,请稍后检查订单状态。",
          showCancel: false,
          confirm: () => {
            that.go({ path: "/pages/order/index", reLaunch: true });
          },
        });
      }
    },
    // openModal() {
    //   this.modalOpen = !this.modalOpen;
    //   this.code = "";
    // },
    async codeBefore() {
      console.log("codeBefore");
      var rep = await this.$ShoppingAPI.Order_ValidationCode();
      if (rep.ret == 0) {
        return true;
      }
    },
    async pay() {
      let that = this;
      if (this.PayMode == 0) {
        this.modalOpen = true;
        // this.openModal();
        // if (this.sendTime == 0) {
        //   var rep = await this.$ShoppingAPI.Order_ValidationCode();
        //   if (rep.ret == 0) {
        //     this.countDown();
        //   }
        // }
      } else if (this.PayMode == 1) {
        if (!this.UserInfo.openid) {
          //弹出提示框
          that.modal({
            title: "您还未登录",
            content: "您还未使用微信登录，请登录后再使用微信支付",
            confirm: () => {
              wx.login({
                success: (obj) => {
                  if (obj.errMsg.indexOf("login:ok") > -1) {
                    that.$ShoppingAPI.Account_wxLogin(obj.code).then((rep) => {
                      if (rep.ret == 0) {
                        // console.log(rep);
                        var _u = { ...this.UserInfo, ...rep.data.result };
                        that.$store.commit("SetUserInfo", _u); //清空userinfo
                      }
                    });
                  }
                },
              });
            },
            confirmText: "微信登录",
          });
          return false;
        }

        var rep = await this.$ShoppingAPI.Order_Pay({
          OrderId: this.OrderId,
          Type: 1,
          UserId: this.UserInfo.UserId,
          appiId: "wx443ed32fe34ba2f0",
          OpenId: this.UserInfo.openid,
        });
        if (rep.ret == 0) {
          var payData = JSON.parse(rep.data);
          var payData = {
            ...payData,
            async success(res) {
              console.log(res);
              // that.$ShoppingAPI
              //   .Order_UpdatePayState({
              //     OrderId: that.OrderId,
              //     Type: 1,
              //     UserId: that.UserInfo.UserId,
              //     appiId: "wx443ed32fe34ba2f0",
              //     OpenId: that.UserInfo.openid
              //   })
              //   .then(rep => {
              //   });

              //场景值scene=1037 则返回调用过来的商家小程序
              let options = that.$mp.appOptions;
              if (options && options.scene == 1037) {
                wx.navigateBackMiniProgram({
                  extraData: {
                    OrderId: this.OrderId,
                    success: "true",
                    msg: "支付成功",
                  },
                  success(res2) {
                    // 返回成功
                    console.log(res2);
                  },
                });
              } else {
                //弹出提示框
                that.modal({
                  title: "支付成功",
                  content: "您已支付成功,请稍后检查订单状态。",
                  showCancel: false,
                  confirm: () => {
                    that.go({ path: "/pages/order/index", reLaunch: true });
                  },
                });
              }
            },
            fail: function (res) {
              if (res.errMsg == "requestPayment:fail cancel") return;
              else that.toast(res.errMsg || res.err_desc || "支付失败");
            },
          };
          // console.log(payData);
          wx.requestPayment(payData);
        }
      }
    },
  },
  computed: {
    money() {
      return (this.OrderInfo.TotalAmount - this.OrderInfo.PayAmount).toFixed(2);
    },
    ...mapState({
      UserInfo: (state) => state.User.UserInfo,
    }),
  },
  async mounted() {
    this.extraDataHandler();
    this.wx_login(async () => {
      if (this.$route.query && this.$route.query.OrderId) {
        this.OrderId = this.$route.query.OrderId;
        var rep = await this.$ShoppingAPI.Order_Get({ OrderId: this.OrderId });
        if (rep.ret == 0) {
          this.OrderInfo = rep.data[0];
        }
      }
    });
  },
};
</script>
<style lang="scss" scoped>
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
      margin-bottom: 5px;
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
      margin-bottom: 5px;
    }
  }
}
</style>
