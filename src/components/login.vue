<template>
  <div class="form">
    <div v-if="isMP">
      <input class="form-control" v-model="userInfo.Account" type="text" placeholder="输入U建账号或手机号码">
      <input class="form-control VerificationCode" v-model="VerificationCode" type="text" placeholder="输入验证码">
      <a class="VerificationCode" :class="{action:codeAction}" @click="countDown">{{countDownStr}}</a>
      <!-- <input class="form-control" v-model.lazy="userInfo.PassWord" type="password" placeholder="输入登录密码"> -->
      <p>如果您还没有使用这个手机号注册过U建,我们将为您创建U建账号</p>
      <a class="button" :class="{action:loginAction}" @click="login">登录</a>
    </div>
    <div v-else>
      <input class="form-control" v-model.lazy="userInfo.Account" type="text" placeholder="请输入U建登录账号">
      <input class="form-control" v-model.lazy="userInfo.PassWord" type="password" placeholder="请输入U建登录密码">
      <button @click="login2">登录</button>
    </div>
  </div>

</template>
<script>
import $toast from "@/utils/toast";
export default {
  props: {
    userInfo: Object
  },
  data() {
    return {
      countDownStr: "发送验证码",
      sendTime: 0,
      VerificationCode: ""
    };
  },
  computed: {
    codeAction() {
      return this.userInfo.Account && this.userInfo.Account.length == 11;
    },
    loginAction() {
      return this.VerificationCode && this.VerificationCode.length > 0;
    }
  },
  methods: {
    async countDown() {
      if (this.sendTime == 0 && this.codeAction) {
        var rep = await this.$ShoppingAPI.Account_ValidationCode({
          Phone: this.userInfo.Account
        });
        if (rep.ret == 0) {
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
    async login2() {
      var req = await this.$ShoppingAPI.Account_Login({
        Account: this.userInfo.Account,
        PassWord: this.userInfo.PassWord
      });
      if (req.ret == 0) {
        this.$store.commit("Login", { Ticket: req.data }); //存入Ticket
        var userinfo = await this.$ShoppingAPI.User_Get();
        this.$store.commit("GetUserInfo", userinfo.data);
        if (this.$route.query.redirect)
          // 切换至 tabBar页面
          this.$router.push({ path: this.$route.query.redirect, isTab: true });
        // 切换至 tabBar页面
        else this.$router.push({ path: "/pages/home/index", isTab: true });
      } else {
        this.toast("登录失败");
      }
    },
    async login() {
      var req = await this.$ShoppingAPI.Account_SimpleLogin({
        Phone: this.userInfo.Account,
        unionid: this.userInfo.unionid,
        openid: this.userInfo.openid,
        UserName: this.userInfo.nickName,
        VerificationCode: this.VerificationCode
      });

      if (req.ret == 0) {
        this.$store.commit("Login", { Ticket: req.data }); //存入Ticket
        var userinfo = await this.$ShoppingAPI.User_Get();
        this.$store.commit("GetUserInfo", userinfo.data);
        if (this.$route.query.redirect)
          // 切换至 tabBar页面
          this.$router.push({ path: this.$route.query.redirect, isTab: true });
        // 切换至 tabBar页面
        else this.$router.push({ path: "/pages/home/index", isTab: true });
      } else {
        this.toast("登录失败");
      }
    }
  }
};
</script>
<style lang="less" scoped>
.form {
  margin-top: 5px;
  // text-align: center;
  width: 70%;
}
.form-control,
.button {
  width: 100%;
}
p {
  color: #7f8699;
  font-size: 12px;
  text-align: left;
  margin-bottom: 5px;
}
a.button {
  color: #7f8699;
  display: inline-block;
  text-align: center;
  border: 1px solid #7f8699;
  padding: 0px;
  height: 30px;
}

.form-control {
  margin-bottom: 5px;
  text-align: left;
  font-size: 16px;
  height: 30px;
  display: inline-block;
  padding: 0 0 0 5px;
  border: 1px solid #ccc;
}
a.VerificationCode {
  margin-left: 5%;
  width: 40%;
  padding: 0 0 0 5px;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  font-size: 14px;
  border: 1px solid #7f8699;
  color: #7f8699;
  border-radius: 5px;
  vertical-align: top;
}
input.VerificationCode {
  width: 50%;
  display: inline-block;
}
a.action {
  border: 1px solid #12b7f5;
  color: #12b7f5;
}
</style>

