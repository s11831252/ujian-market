<template>
  <div style="width: 100%;">
    <div class="index">
        <div v-if="isMP&&mode=='SMS'" class="nr">
          <form @submit.prevent="login" class="index">
            <!-- 输入手机号码 -->
            <div class="tel">
              <i class="icon">&#xe60d;</i>
              <input type="tel" placeholder="请输入手机号码" v-model="model.Account" />
            </div>
            <!-- 输入验证码 -->
            <div class="message">
              <div class="emal">
                <i class="icon">&#xe60b;</i>
                <input type="number" placeholder="请输入验证码" v-model="VerificationCode" />
              </div>
              <p class="yzm" :class="{action:codeAction}" @click="countDown">{{countDownStr}}</p>
            </div>
            <!-- 登录按钮 -->
            <div class="btn" :class="{action:loginAction}" @click="login">立即登录</div>
            <!-- 底部提示文字 -->
            <div class="fttext">
              <p>欢迎使用U建行业市场,</p>
              <p>请您输入手机号码进入下步购物环节</p>
            </div>
            <input type="submit">
          </form>
        </div>
        <div v-else-if="!isMP||(mode=='PWD')" class="nr">
          <form @submit.prevent="login2" class="index">
            <!-- 输入手机号码 -->
            <div class="tel">
              <i class="icon">&#xe60d;</i>
              <input type="tel" placeholder="请输入手机号码" v-model="model.Account" />
            </div>
            <!-- 输入密码 -->
            <div class="pwd">
              <i class="icon">&#xe75c;</i>
              <input type="password" placeholder="请输入密码" v-model="model.PassWord" />
            </div>
            <!-- 登录按钮 -->
            <div class="btn" :class="{action:model.Account&&model.PassWord}" @click="login2">立即登录</div>
            <!-- 底部提示文字 -->
            <div class="fttext">
              <p>欢迎使用U建行业市场,</p>
              <p>请您登录后进入下步购物环节</p>
            </div>
            <input type="submit">
          </form>
        </div>
    </div>
  </div>
</template>
<script>
import $toast from "@/utils/toast";
import { mapState } from "vuex";
import utils from '../utils/index'
import disp from "../utils/hx/broadcast";

export default {
  data() {
    return {
      countDownStr: "获取验证码",
      sendTime: 0,
      VerificationCode: "",
    };
  },
  props:{
    mode:{
      type:String,
      default:"SMS"
    },
    model:{
      type:Object,
      default: function(){
        return {
        Account:"",
        PassWord: ""
        }
      }
    }
  },
  computed: {
    ...mapState({
      UserInfo: state => state.User.UserInfo
    }),
    codeAction() {
      return utils.regexp.phone(this.model.Account)
    },
    loginAction() {
      return this.VerificationCode && this.VerificationCode.length >=4;
    }
  },
  methods: {
    async countDown() {
      if (this.sendTime == 0 && this.codeAction) {
        var rep = await this.$ShoppingAPI.Account_ValidationCode({
          Phone: this.model.Account
        });
        if (rep.ret == 0) {
          this.sendTime = 60;
          this.countDownStr = this.sendTime + "s后可重发";
          var clock = setInterval(() => {
            this.sendTime--;
            if (this.sendTime <= 0) {
              this.countDownStr = "点击发送验证码";
              this.sendTime = 0;
              clearInterval(clock);
            } else {
              this.countDownStr = this.sendTime + "s后可重发";
            }
          }, 1000);
        }
      }
    },
    async login2() {
      var req = await this.$UJAPI.Account_Login({
        Account: this.model.Account,
        PassWord: this.model.PassWord
      });
      if (req.ret == 0) {
        this.$store.commit("Login", { Ticket: req.data }); //存入Ticket
        var res = await this.$ShoppingAPI.User_Get();
        if (res.ret == 0) {
          var _u = { ...res.data, ...this.UserInfo };
          this.$store.commit("SetUserInfo", _u);
        }
        this.hx_login();
      } else {
        this.toast("登录失败");
      }
    },
    async login() {
      if (!this.codeAction) {
        this.toast("请输入正确的手机号码");
        return;
      }
      if (!this.loginAction) {
        this.toast("请输入验证码");
        return;
      }
      var req = await this.$ShoppingAPI.Account_SimpleLogin({
        Phone: this.model.Account,
        unionid: this.UserInfo.unionid,
        openid: this.UserInfo.openid,
        UserName: this.UserInfo.nickName && this.UserInfo.nickName.slice(0, 16),
        VerificationCode: this.VerificationCode
      });
      if (req.ret == 0) {
        this.$store.commit("Login", { Ticket: req.data }); //存入Ticket
        var res = await this.$ShoppingAPI.User_Get();
        if (res.ret == 0) {
          var _u = { ...res.data, ...this.UserInfo };
          this.$store.commit("SetUserInfo", _u);
        }
        this.hx_login();
      } else {
        this.toast("登录失败");
      }
    },
    loginOK_Redirect(){
        if (this.$route.query.redirect) {
          let url = decodeURIComponent(this.$route.query.redirect);
          // 切换至redirect页面
          this.$router.replace({ path: url},//跳转失败回调,失败了可以认为是tabBar页面,尝试使用isTab
          null,
          msg=>{this.$router.push({path: url, isTab: true })}
          );
        } else if (this.$route.query.back) {
          //后退
          this.$router.back();
        } // 切换至首页页面
        else {
          this.$router.push({ path: "/pages/home/index", isTab: true });
        }
    }
  },
  onUnload() {
    disp.off("onOpened", this.loginOK_Redirect);
  },
  mounted(){
    disp.on("onOpened",this.loginOK_Redirect);
  }
};
</script>
<style lang="scss" scoped>
.index{
  input[type='submit']{
    display: none;
  }
}
.index .nr {
  margin-top: 1.5rem;
  /*input提示文字颜色*/
  /*输入手机号码*/
  /*输入验证码*/
  /*立即登录按钮*/
  /*底部提示文字*/
  .tel,
  .pwd {
    width: 8rem;
    height: 1.4rem;
    margin-left: 1.4rem;
    border-radius: 0.7rem;
    background-color: #ffffff;
    box-shadow: 0 0.03rem 0.21rem 0 rgba(51, 150, 254, 0.35);
    i {
      // width: 0.44rem;
      // height: 0.69rem;
      margin-top: 0.35rem;
      margin-left: 0.65rem;
      margin-right: 0.47rem;
      float: left;
      font-size: 22px;
      color: #93e4fc;
    }

    input {
      border: none;
      width: 5rem;
      height: 0.7rem;
      float: left;
      margin-top: 0.35rem;
      color: #999999;
    }
  }
  .pwd {
    margin-top: 0.64rem;
  }
}

.index .nr ::-webkit-input-placeholder {
  color: #999999;
}

.index .nr ::-o--input-placeholder {
  color: #999999;
}

.index .nr ::-moz-input-placeholder {
  color: #999999;
}

.index .nr ::-ms-input-placeholder {
  color: #999999;
}

.index .nr .message {
  height: 1.4rem;
  margin-top: 0.64rem;
  /*验证码文字*/
}

.index .nr .message .emal {
  width: 5.5rem;
  height: 1.4rem;
  margin-left: 1.4rem;
  border-radius: 0.7rem;
  background-color: #ffffff;
  box-shadow: 0 0.03rem 0.21rem 0 rgba(51, 150, 254, 0.35);
  float: left;
}

.index .nr .message .emal i {
  // width: 0.56rem;
  // height: 0.43rem;
  margin-left: 0.65rem;
  margin-right: 0.35rem;
  margin-top: 0.35rem;
  float: left;
  font-size: 22px;
  color: #93e4fc;
}
.index {
  input {
    font-size: 0.4rem;
  }
}

.index .nr .message .emal input {
  border: none;
  width: 2.8rem;
  height: 0.7rem;
  color: #999999;
  float: left;
  margin-top: 0.35rem;
}

.index .nr .message .yzm {
  font-size: 0.4rem;
  margin-left: 0.52rem;
  float: left;
  line-height: 1.4rem;
  color: #999999;
}

.index .nr .message .yzm.action {
  color: #3396fe;
}

.index .nr .btn {
  width: 8rem;
  height: 1.21rem;
  margin-top: 1.04rem;
  margin-left: 1.4rem;
  background-color:  #999999;
  // background-blend-mode: normal, normal;
  // box-shadow: 0 0.03rem 0.21rem 0 rgba(51, 150, 254, 0.35);
  border-radius: 0.6rem;
  font-size: 0.5rem;
  line-height: 1.21rem;
  color: #ffffff;
  text-align: center;
}
.index .nr .btn.action{
  background-image: linear-gradient(-20deg, #3396fe 0%, #65c1fd 100%), linear-gradient(#ffffff, #ffffff);
  color: #ffffff;
}
.index .nr .btn p {
  font-size: 0.5rem;
  line-height: 1.21rem;
  color: #ffffff;
  text-align: center;
}

.index .nr .fttext {
  margin-top: 0.9rem;
}

.index .nr .fttext p {
  letter-spacing: 0.01rem;
  color: #12b7f5;
  font-size: 0.4rem;
  opacity: 0.6;
  line-height: 0.9rem;
  text-align: center;
}
</style>

