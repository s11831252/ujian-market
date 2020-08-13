<template>
    <div class="index">
        <div class="content">
            <div class="my">
                <div class="myTop" v-if="Logined">
                    <img class="my_headimg" :src="UserInfo.Portrait" v-if="UserInfo.Portrait" alt="" />
                    <div class="myTop_textDiv">
                        <p class="myTop_name">{{UserInfo.UserName}}</p>
                        <p class="myTop_phone">手机号码：{{UserInfo.Phone}}</p>
                    </div>
                </div>
                <div class="myTop" v-else>
                    <div class="myTop_textDiv">
                        <p class="myTop_name" @click="go({path:'/pages/index/index'})">去登录/注册</p>
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
                <div class="myInfo" v-if="Logined">
                    <div class="myInfo_demo" @click="go({path:'/pages/order/index'})" v-if="Config.showBuy">
                        <i class="icon">&#xe653;</i>
                        <p class="myInfo_p">查看全部订单</p>
                        <img class="next" src="../../../static/img/next.png" alt="" />
                    </div>
                    <div class="myInfo_demo" @click="go({path:'/pages/my/address'})" v-if="Config.showBuy">
                        <i class="icon">&#xe627;</i>
                        <p class="myInfo_p">收货地址</p>
                        <img class="next" src="../../../static/img/next.png" alt="" />
                    </div>
                    <div class="myInfo_demo" @click="outShopping" v-if="ShoppingInfo&&ShoppingInfo.AudtiState==1">
                        <i class="icon">&#xe626;</i>
                        <p class="myInfo_p">管理店铺</p>
                        <img class="next" src="../../../static/img/next.png" alt="" />
                    </div>
                    <div class="myInfo_demo" @click="outShopping" v-else>
                        <i class="icon">&#xe60e;</i>
                        <p class="myInfo_p">入驻商城</p>
                        <img class="next" src="../../../static/img/next.png" alt="" />
                    </div>
                </div>
                <div v-if="Logined" class="myesc" @click="exit">退出登录</div>
            </div>
        </div>
     
    </div>    
</template>
<script>
import { mapState,mapGetters } from "vuex";
import WebIM from "@/utils/hx/WebIM";
import utils from "@/utils/index.js";
export default {
  data() {
    return {
      Balance: 0,
      Coupon:0,
      ShoppingInfo:null
    };
  },
  computed: {
    ...mapState({
      UserInfo: state => state.User.UserInfo,
      Config: state => state.Global.Config     
    }),
    Logined()
    {
        return this.$store.getters.Logined;
    }
  },
  methods: {
    exit() {
      this.$store.commit("Login", { Ticket: "" }); //清空Ticket
      this.$store.commit("SetUserInfo", {});//清空userinfo
      utils.removeItem("myUsername");
      WebIM.conn.close();//环信IM关闭
      this.$router.push("/pages/index/index"); //回到登录页
    },
    outShopping(){
        console.log(this.ShoppingInfo);
        if(this.ShoppingInfo)
        {
            switch(this.ShoppingInfo.AudtiState)
            {
                case -1:{
                    this.go({path:'/pages/my/write_license',query:{sId:this.ShoppingInfo.sId}})
                    break;
                }
                case 0:{
                    this.go({path:'/pages/my/applyresult',query:{sId:this.ShoppingInfo.sId}})
                    break;
                }
                case 1:{
                    this.go({path:'/pages/store/storepage',query:{sId:this.ShoppingInfo.sId}})
                    break;
                }
                case 2:{
                    this.go({path:'/pages/my/applyresult',query:{sId:this.ShoppingInfo.sId}})
                    break;
                }
            }
        }
        else{
            this.go({path:'/pages/my/entry_notice'})
        }
    },
    async init(){
        if(this.Logined)
        {
            if (!this.UserInfo.UserId) {
                    var rep = await this.$ShoppingAPI.User_Get();
                    if (rep.ret == 0) this.$store.commit("SetUserInfo", rep.data);
            }
            this.$UJAPI.Balance_Purse().then(rep => {
                this.Balance = rep.data;
            });
            this.$ShoppingAPI.User_Coupon_Get({State:-1}).then(rep => {
            if(rep.ret==0)
                this.Coupon = rep.total;
            });
            
            var rep = await this.$ShoppingAPI.Shop_GetMy();
            if(rep.ret==0)
            {
                this.ShoppingInfo=rep.data[0];
            }
        }

    }
  },
  components: {

  },
  onPullDownRefresh(){
    this.init();
    wx.stopPullDownRefresh()
  },
   mounted() {
      this.wx_login(async ()=>{
          await  this.init();
      })
  }
};
</script>
<style>
page{
    background-color: #ecf0f1;
}
.myInfo_demo i{
    color: #14b6f6;
    float: left;
    font-size: 0.54rem;
    margin-right: 0.31rem;
    margin-top: 0.38rem;
}
</style>
