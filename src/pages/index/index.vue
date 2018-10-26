<template>
  <div class="container" >
    <div class="userinfo" @click="go({path:'/pages/logs/index'})">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
    </div>
    <button v-if="!userInfo.nickName" open-type="getUserInfo" @getuserinfo="getUserInfoData" >授权登录</button>
    <button v-if="userInfo.nickName" @click="opensetting">打开授权设置</button>
    <login v-if="userInfo.nickName" :userInfo="userInfo"></login>
    <!-- <form v-if="userInfo.nickName">
      <input class="form-control" v-model.lazy="userInfo.Account" type="text" placeholder="请输入U建登录账号" >
      <input class="form-control" v-model.lazy="userInfo.PassWord" type="password" placeholder="请输入U建登录密码" >
      <button @click="login">登录</button>
    </form> -->
    <a @click="go({path:'/pages/counter/index'})" class="counter">去往Vuex示例页面</a>
    <a @click="go({path:'/pages/home/index',isTab: true})" class="counter">去往项目首页</a>
  </div>
</template>

<script>
import card from "@/components/card";
import login from '@/components/login';
export default {
  data() {
    return {
      userInfo: {
        Account: "",
        PassWord: "",
        avatarUrl: "",
        nickName: ""
      }
    };
  },
  components: {
    card,
    login
  },

  methods: {
    opensetting() {
      wx.openSetting();
    },
    getUserInfoData(obj) {
      console.log(obj);
      if (obj.mp.detail.errMsg.indexOf("getUserInfo:ok") != -1) {
        this.userInfo.nickName = obj.mp.detail.userInfo.nickName;
        this.userInfo.avatarUrl = obj.mp.detail.userInfo.avatarUrl;
      } else {
        wx.showModal({
          title: "警告",
          content: "您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!",
          showCancel: false,
          confirmText: "返回授权",
          success(res) {
            if (res.confirm) {
              console.log("点击了“返回授权”");
            }
          }
        });
      }
    },
    wx_login() {
      // 调用wx登录接口
      wx.login({
        success: obj => {
          if (obj.errMsg.indexOf("login:ok") > -1) {
            console.log(obj);
          } else {
          }
        }
      });
    }
  },
  mounted(){
    console.log((this.$store.state.User.SingleTicket==null||this.$store.state.User.SingleTicket.length > 0));
    if (
      this.$store.state.User.SingleTicket==null ||
      this.$store.state.User.SingleTicket.length > 0
    ) {
      // 切换至 tabBar 页面
      this.$router.push({ path: "/pages/home/index", isTab: true });
    }

    // 检查是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
        } else {
          wx.getUserInfo({
            success(res) {
              this.userInfo.nickName = res.userInfo.nickName;
              this.userInfo.avatarUrl = res.userInfo.avatarUrl;
            }
          });
        }
      }
    });
  },
  created() {
    //1. 调用wx.login
    this.wx_login();
  }
};
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
