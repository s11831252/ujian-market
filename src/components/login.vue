<template>
        <div class="form">
            <input class="form-control" v-model="userInfo.Account" type="text" placeholder="输入U建账号或手机号码">
            <!-- <input class="form-control" v-model.lazy="userInfo.PassWord" type="password" placeholder="输入登录密码"> -->
            <p>如果您还没有使用这个手机号注册过U建,我们将为您创建U建账号</p>
            <a class="button" :class="{action:loginAction}" @click="login">登录</a>
        </div>
</template>
<script>
import $toast from '@/utils/toast'
export default {
  props: {
    userInfo: Object
  },
  data(){
    return {
      
    };
  },
  computed:{
    loginAction(){
      return this.userInfo.Account&&this.userInfo.Account.length==11;
    }
  },
  methods: {
    async login() {
      // var req = await this.$ShoppingAPI.Account_Login({
      //   Account: this.userInfo.Account,
      //   PassWord: this.userInfo.PassWord
      // });
      var req = await this.$ShoppingAPI.Account_SimpleLogin({
        Phone: this.userInfo.Account,
        unionid:this.userInfo.unionid,
        openid:this.userInfo.openid,
        UserName:this.userInfo.nickName,
        VerificationCode:"1234",
      });
      if (req.ret == 0) {
        this.$store.commit("Login", { Ticket: req.data }); //存入Ticket
        var userinfo = await this.$ShoppingAPI.User_Get();
        this.$store.commit("GetUserInfo",  userinfo.data);
        if(this.$route.query.redirect)
          // 切换至 tabBar页面
          this.$router.push({ path: this.$route.query.redirect, isTab: true });
        else
        // 切换至 tabBar页面
        this.$router.push({ path: "/pages/home/index", isTab: true });
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
  text-align: center;
  width:70%;
}
.form-control,.button{
  width:100%;
}
p{
  color:#7f8699;
  font-size:12px;
  text-align: left;
  margin-bottom: 5px;
}
a.button{
  color:#7f8699;
  display: inline-block;
  border: 1px solid #7f8699;
  padding: 0px;
}
a.action{
    border: 1px solid #12b7f5;
    color:#12b7f5;
}
.form-control {
  text-align: left;
  font-size: 16px;
  display:inline-block;
  padding: 0 0 0 5px;
  border: 1px solid #ccc;
}
</style>

