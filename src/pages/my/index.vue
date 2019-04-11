<template>
    <div class="index">
        <div class="content">
            <div class="my">
                <div class="myTop">
                    <img class="my_headimg" :src="UserInfo.Portrait" v-if="UserInfo.Portrait" alt="" />
                    <div class="myTop_textDiv">
                        <p class="myTop_name">{{UserInfo.UserName}}</p>
                        <p class="myTop_phone">手机号码：{{UserInfo.Phone}}</p>
                    </div>
                </div>
                <div class="mystate">
                    <div class="mystate_demo">
                        <div class="mystate_number">{{Balance}}<b>元</b></div>
                        <p class="mystate_p">我的钱包</p>
                    </div>
                    <div class="mystate_demo">
                        <div class="mystate_number2">{{Coupon}}<b>张</b></div>
                        <p class="mystate_p">优惠券</p>
                    </div>
                    <div class="mystate_demo">
                        <div class="mystate_number3">0<b>分</b></div>
                        <p class="mystate_p">我的积分</p>
                    </div>
                </div>
                <div class="myInfo">
                    <div class="myInfo_demo" @click="go({path:'/pages/my/address'})">
                        <img class="address" src="/static/img/address.png" alt="" />
                        <p class="myInfo_p">收货地址</p>
                        <img class="next" src="/static/img/next.png" alt="" />
                    </div>
                    <div class="myInfo_demo">
                        <img class="shoppingCart" src="/static/img/shoppingCart.png" alt="" />
                        <p class="myInfo_p">管理店铺</p>
                        <img class="next" src="/static/img/next.png" alt="" />
                    </div>
                </div>
                <div class="myesc" @click="exit">退出登录</div>
            </div>
        </div>
     
    </div>    
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      Balance: 0,
      Coupon:0,
    };
  },
  computed: {
    ...mapState({
      UserInfo: state => state.User.UserInfo
    })
  },
  methods: {
    exit() {
      this.$store.commit("Login", { Ticket: "" }); //存入Ticket
      this.$router.push("/pages/index/index"); //回到登录页
    }
  },
  components: {},
  async mounted() {
    if (!this.UserInfo) {
      var rep = await this.$ShoppingAPI.User_Get();
      if (rep.ret == 0) this.$store.commit("GetUserInfo", rep.data);
    }

    this.$UJAPI.Balance_Purse().then(rep => {
      this.Balance = rep.data;
    });
    this.$ShoppingAPI.User_Coupon_Get({State:-1}).then(rep => {
      if(rep.ret==0)
        this.Coupon = rep.total;
    });
    
  }
};
</script>
<style>
page{
    background-color: #ecf0f1;
}
</style>
