<template>
    <div class="page">
        <div class="my-head">
            <div class="my-head-tool"><i class="icon"></i><i class="icon"></i></div>
            <img :src="UserInfo.Portrait" v-if="UserInfo.Portrait">
        </div>
        <div class="my-info">
            <p>{{UserInfo.UserName}}</p>
            <p>手机号码：{{UserInfo.Phone}}</p>
            <ul class="my-info-vital">
                <li>
                    <p class="vital-value">0.00元</p>
                    <p class="vital-title">我的钱包</p>
                </li>
                <li>
                    <p class="vital-value">0张</p>
                    <p class="vital-title">优惠券</p>
                </li>
                <li>
                    <p class="vital-value">0分</p>
                    <p class="vital-title">我的积分</p>
                </li>
            </ul>
            <ul class="my-info-action">
                <li>
                    <p><i class="icon icon-sh">&#xe65e;</i>收货地址<i class="icon right">&#xe601;</i></p>
                </li>
                <li>
                    <p><i class="icon icon-dw">&#xe620;</i>项目定位<i class="icon right">&#xe601;</i></p>
                </li>
                <li>
                    <p><i class="icon icon-sc">&#xe60c;</i>我的收藏<i class="icon right">&#xe601;</i></p>
                </li>
                <li>
                    <p><i class="icon icon-lljl">&#xe6f8;</i>浏览记录<i class="icon right">&#xe601;</i></p>
                </li>
                <li>
                    <p><i class="icon icon-tsjy">&#xe64c;</i>投诉与建议<i class="icon right">&#xe601;</i></p>
                </li>
                <li @click="exit" >
                    <p><i class="icon icon-tc">&#xe609;</i>退出登录<i class="icon right">&#xe601;</i></p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      UserInfo: state => state.User.UserInfo
    })
  },
  methods:{
    exit(){
      this.$store.commit("Login", { Ticket: "" }); //存入Ticket
      this.$router.push("/pages/index/index");//回到登录页
    }
  },
  components: {},
};
</script>
<style lang="less" scoped>
.page{
    color: #5c5c5c;
}
.my-head {
  margin: 0 auto;
  padding-top: 20px;
  text-align: center;
  background-color: #12b7f5;
  .my-head-tool {
    i {
      display: inline-block;
      float: right;
    }
  }
  img {
    position: relative;
    bottom: -10px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
}
.my-info {
  background-color: #fff;
  margin-top: 15px;
  text-align: center;
  .my-info-vital {
    margin-top: 10px;
    display: flex;
    //   flex-direction: row;
    //   align-items: center;
    justify-content: center;
    li {
      margin: 0 30px;
      .vital-title {
        font-size: 14px;
      }
      .vital-value {
        color: #ff5252;
        font-size: 20px;
      }
    }
  }
}
.my-info-action {
    background-color: #fff;
  text-align: initial;
  margin-top: 10px;
  li {
    margin-bottom: 10px;
    border-bottom: 1px solid #ecf0f1;
    p {
        padding: 5px 0 5px 10px;
      i {
        display: inline-block;
        margin-right: 10px;
        font-size: 30px;
      }
      // .icon-sh,
      // .icon-dw {
      //   color: #ff5252;
      // }
      // .icon-sc,
      // .icon-lljl {
      //   color: #6dff60;
      // }
      // .icon-tsjy,.tc {
      //   color: #fccb5c;
      // }
      line-height: 30px;
    }
  }
}
</style>
