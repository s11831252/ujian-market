<template>
        <div class="form">
            <input class="form-control" v-model.lazy="userInfo.Account" type="text" placeholder="请输入U建登录账号">
            <input class="form-control" v-model.lazy="userInfo.PassWord" type="password" placeholder="请输入U建登录密码">
            <button @click="login">登录</button>
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
  methods: {
    async login() {
      var req = await this.$UJAPI.Account_Login({
        Account: this.userInfo.Account,
        PassWord: this.userInfo.PassWord
      });
      if (req.ret == 0) {
        this.$store.commit("Login", { Ticket: req.data }); //存入Ticket
        var userinfo = await this.$UJAPI.User_Get();
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
<style>
.form {
  margin-top: 20px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}
</style>

