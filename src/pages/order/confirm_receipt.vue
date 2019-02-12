<template>
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
        <li class="evaluate">马上评价</li>
      </ul>
    </div>
    <!-- 订单信息 在退货/退款中不显示-->
    <div class="order" v-if="orderInfo.IsReturnGoods==false || orderInfo.IsCancelling==false">
      <div class="information">订单信息</div>
      <div class="ordernumber">
        <div class="ordernumber1">订单号:</div>
        <div class="orderreference">{{ orderInfo.OrderNo}}</div>
      </div>
      <div class="ordertime">
        <div class="ordertime1">下单时间:</div>
        <div class="ordertime2">{{ orderInfo.OrderTime}}</div>
      </div>
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
  height: 2.85rem;
  background-color: #ffffff;
  padding-top: 0.41rem;
}
.Image_url {
  float: left;
  margin-right: 0.35rem;
}
.Image_url img {
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 0.1rem;
}
.Goods_ItemInfo .gName {
  color: #021218;
  font-size: 0.4rem;
}
/* 中间图标 */
.picture {
  width: 10.8rem;
  height: 7.21rem;
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
}
.evaluate {
  width: 2.22rem;
  height: 0.83rem;
  background-color: #12b7f5;
  border-radius: 0.16rem;
  margin-top: 0.79rem;
  margin-left: 4.3rem;
  padding: 0.2rem;
  color: #ffffff;
  font-size: 0.36rem;
}
/* 订单信息 */
.order {
  margin-top: 0.21rem;
  background-color: #ffffff;
  margin-bottom: 0.32rem;
  padding-bottom: 0.2rem;
}
.ordernumber {
  margin-top: 0.2rem;
}
.information {
  color: #5c5c5c;
  padding-left: 0.31rem;
  padding-top: 0.2rem;
  font-size: 0.36rem;
  border-bottom: solid #ecf0f1;
  padding-bottom: 0.31rem;
}
.ordernumber .ordernumber1 {
  float: left;
  padding-left: 0.3rem;
  color: #a2a2a2;
  font-size: 0.36rem;
}
.ordernumber .orderreference {
  padding-left: 5.5rem;
  color: #a2a2a2;
  font-size: 0.36rem;
}
.ordertime {
  margin-top: 0.2rem;
  font-size: 0.36rem;
  margin-bottom: 0.2rem;
}
.ordertime .ordertime1 {
  float: left;
  padding-left: 0.3rem;
  color: #a2a2a2;
}
.ordertime .ordertime2 {
  padding-left: 7rem;
  color: #a2a2a2;
}
</style>
