<template>
  <!-- 成功收货页面 -->
  <div class="content">
    <div class="Goods_ItemInfo" v-for="(item, index) in orderInfo.Order_Goods_items" v-bind:key="index">
      <div class="Image_url">
        <img :src="item.Image_url	">
      </div>
      <div class="gName">{{item.gName}}</div>
    </div>
    <!-- 成功收货 -->
    <div class="picture">
      <ul>
        <li class="correct">
          <img src="/static/img/correct.png/">
        </li>
        <li class="goods">收货成功</li>
        <button class="evaluate" @click="go({path:'/pages/order/write_review',query:{OrderId:orderInfo.OrderId}})">
          <samp>马上评价</samp>
        </button>
      </ul>
    </div>
    <!-- 订单信息 在退货/退款中不显示-->
    <div class="OrderInfo"  v-if="orderInfo.IsReturnGoods==false || orderInfo.IsCancelling==false">
        <div class="information">订单信息</div>
        <ul class="ordernumber">
          <li>订单号:</li>
          <li>下单时间</li>
        </ul>
        <ul class="ordertime">
          <li>{{ orderInfo.OrderNo}}</li>
          <li>{{ orderInfo.OrderTime}}</li>
        </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderInfo: {}
    };
  },
  computed: {},
  components: {},
  methods: {},
  //异步
  async mounted() {
    //打印外面传进来的参数
    console.log(this.$route.query);
    //把vue this 指向that，方便在其他回调函数里面使用this
    var that = this;
    //访问服务端，请求api获取传进来的OrderId的订单信息
    var res = await this.$ShoppingAPI.Order_Get({
      OrderId: this.$route.query.OrderId
    });
    //res.ret==0表示服务端请求成功
    if (res.ret == 0) {
      console.log(res.data[0]);

      //将返回的data数组第一项（因为接口返回的是数组）赋值给 this.orderInfo
      this.orderInfo = res.data[0];
    }
  }
};
</script>



<style scoped>
.content {
  width: 10.8rem;
  height: 19.2rem;
  background-color: #ecf0f1;
  padding-top: 0.21rem;
}
/* 订单信息 */
.Goods_ItemInfo {
  padding-left: 0.32rem;
  height: 1.4rem;
  background-color: #ffffff;
  padding-top: 0.41rem;
}
.Image_url {
  float: left;
  margin-right: 0.35rem;
}
.Image_url img {
  width: 1rem;
  height: 1rem;
  border-radius: 0.1rem;
}
.Goods_ItemInfo .gName {
  color: #021218;
  font-size: 0.4rem;
}
/* 中间图标 */
.picture {
  width: 10.8rem;
  height: 6.21rem;
  background-color: #ffffff;
  margin-top: 0.23rem;
  text-align: center;
}
.picture .correct img {
  width: 2.14rem;
  height: 2.15rem;
  line-height: 2.15rem;
  padding-top: 0.73rem;
}
.goods {
  color: #12b7f5;
  padding-top: 0.3rem;
  font-size: 0.46rem;
  font-family: MicrosoftYaHei;
}
.evaluate {
  width: 2.22rem;
  height: 0.83rem;
  background-color: #12b7f5;
  box-shadow: 0rem 0.01rem 0rem 0rem #e8e8e8;
  border-radius: 0.16rem;
  border: solid 0.01rem #dddbdb;
  margin-left: 4.29rem;
  margin-top: 0.79rem;
}
.evaluate samp {
	font-family: MicrosoftYaHei;
	font-size: 0.36rem;
	line-height: 0.63rem;
	color: #ffffff;
}


/* 订单信息 */
.OrderInfo {
  background-color: #ffffff;
  height: 2.47rem;
  margin-top: 0.23rem;
  font-size: 0.36rem;
  font-family: MicrosoftYaHei;
  padding-left: 0.31rem;
}
.information {
  color: #5c5c5c;
  padding-top: 0.2rem;
  border-bottom: solid #ecf0f1 0.01rem;
  padding-bottom: 0.31rem;
}
.ordernumber {
  margin-top: 0.2rem;
  color: #a2a2a2;
  float: left;
}
.ordertime {
  margin-top: 0.2rem;
  color: #a2a2a2;
  float: right;
  padding-right: 0.28rem;
}
</style>
