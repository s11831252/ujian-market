<template>
  <!-- 评价完成页面 -->
  <div class="content">
    <div class="picture">
      <ul>
        <li class="correct">
          <img src="/static/img/correct.png/">
        </li>
        <li class="goods">评论成功</li>
      </ul>
    </div>
    <!-- 订单信息 在退货/退款中不显示-->
    <div class="OrderInfo">
      <div class="order" v-if="orderInfo.IsReturnGoods==false || orderInfo.IsCancelling==false">
        <div class="information">订单信息</div>
          <ul class="ordernumber">
            <li>订单号:<span class="right">{{ orderInfo.OrderNo}}</span></li>
            <li>下单时间<span class="right">{{ orderInfo.OrderTime}}</span></li>
          </ul>
          <ul class="ordertime">
            <li></li>
            <li></li>
          </ul>
      </div>
    </div>
    <!-- 联系客服 -->
    <ul class="query">
        <li>若您对上述交易有疑问</li>
        <li>请联系客服0771-2755698</li>
    </ul>
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
    //打印外面传进来的参数 Query是一个查询参数类，封装了查询条件，分页，排序等功能。
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
  height: 17.33rem;
  background-color: #ecf0f1;
  padding-top: 0.21rem;
}
/* 中间图标 */
.picture {
  height: 3.92rem;
  background-color: #ffffff;
  margin-top: 0.23rem;
  text-align: center;
}
.picture .correct img {
  width: 2.14rem;
  height: 2.15rem;
  padding-top: 0.7rem;
}
.goods {
  color: #12b7f5;
  padding-top: 0.3rem;
  font-size: 0.5rem;
  font-family: MicrosoftYaHei;
}

/* 订单信息 */
.OrderInfo {
  background-color: #ffffff;
  padding-top: 0.81rem;
  /* height: 2.58rem; */
}
.order {
  width: 10.24rem;
  border-top: solid #12b7f5 0.03rem;
  margin-bottom: 0.32rem;
  padding-bottom: 0.3rem;
  margin-left: 0.31rem;
}
.information {
  color: #5c5c5c;
  padding-top: 0.55rem;
  font-size: 0.36rem;
  border-bottom: solid #ecf0f1 0.02rem;
  padding-bottom: 0.31rem;
}
.ordernumber {
  margin-top: 0.2rem;
  color: #a2a2a2;
  font-size: 0.36rem;
  /* float: left; */
}
.ordernumber .right{
  float: right;
}
.ordertime {
  margin-top: 0.2rem;
  font-size: 0.36rem;
  color: #a2a2a2;
  float: right;
}
.query {
  font-size: 0.36rem;
  color: #a2a2a2;
  text-align: center;
  padding-top: 8.03rem;
}
</style>
<style>
body{
    background-color: #ecf0f1;
    height: 100%;
}
</style>