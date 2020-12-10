<template>
  <div class="container">
    <img class="logo" :class="{logoHide:logoHide}" src="/static/img/logo108.png" mode="widthFix">
    <p>U建商城</p>
    <div class="userinfo">
      <img class="userinfo-avatar" v-if="UserInfo.avatarUrl" :src="UserInfo.avatarUrl" background-size="cover">
      <div class="userinfo-nickname">
        <card :text="UserInfo.nickName"></card>
      </div>
    </div>
    <div v-if="!UserInfo.nickName" class="authorize">
      <p>申请获得你的公开信息(昵称、头像等)</p>
      <button open-type="getUserInfo" @getuserinfo="getUserInfoData">授权登录</button>
    </div>
    <!-- <button v-if="userInfo.nickName" @click="opensetting">打开授权设置</button> -->
    <login v-else></login>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import card from "@/components/card";
import login from "@/components/login";
export default {
  data() {
    return {
      logoHide: false
    };
  },  
  components: {
    card,
    login
  },
  computed:{
    ...mapState({
      UserInfo: state => state.User.UserInfo
    })
  },
  methods: {
    opensetting() {
      wx.openSetting();
    },
    getUserInfoData(obj) {
      var that = this;
      if (obj.mp.detail.errMsg.indexOf("getUserInfo:ok") != -1) {
        // this.userInfo.nickName = obj.mp.detail.userInfo.nickName;
        // this.userInfo.avatarUrl = obj.mp.detail.userInfo.avatarUrl;
        var _u = {...obj.mp.detail.userInfo, ...that.UserInfo}
        if(!that.UserInfo.openid)
        {
          wx.login({
            success: obj => {
              if (obj.errMsg.indexOf("login:ok") > -1) {
                this.$ShoppingAPI.Account_wxLogin(obj.code).then(rep => {
                  if (rep.ret == 0) {
                    _u = {..._u , ...rep.data.result}
                    this.$store.commit("SetUserInfo", _u);//清空userinfo
                    this.logoHide = true;
                  }
                });
              }
            }
          });
        }else
        {
          this.$store.commit("SetUserInfo", _u);//清空userinfo
          this.logoHide = true;
        }
      } else {
        this.$router.back();
      }
    }
  },
  mounted() {

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
  created() {}
};
</script>

<style lang="less" scoped>
.logo {
  width: 100px;
  transition: height 0.5s;
  -moz-transition: height 0.5s; /* Firefox 4 */
  -webkit-transition: height 0.5s; /* Safari and Chrome */
  -o-transition: height 0.5s; /* Opera */
}
.logoHide {
  width: 0px;
  height: 0px;
}
.authorize {
  text-align: center;
  width: 100%;
  button {
    color: #12b7f5;
    border: 1px solid #12b7f5;
    border-radius: 10px;
    padding: 0px;
    width: 50%;
  }
  p {
    margin: 10px 0 5px 0;
    font-size: 12px;
    color: #7f8699;
  }
}

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
