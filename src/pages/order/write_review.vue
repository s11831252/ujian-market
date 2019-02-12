<template>
  <div class="content">
    <!-- 订单信息 -->
    <div class="OrderInfo">
      <ul class="OrderId">
        <li class="OrderNo">订单号:</li>
        <li>3581273416555</li>
      </ul>
      <ul class="shoppingcarList">
        <li>
          <span class="goods-img">
            <img src="/static/img/good.png/">
          </span>
          <span class="goods-info">
            <p class="goods-name">304不锈钢圆环O型环不锈钢钢圈圆圈环焊接钢环实心手握</p>
            <p class="goods-price">
              单价：
              <span>¥65.00</span>/件
            </p>
            <p class="goods-iteminfo">规格：xxx</p>
          </span>
        </li>
      </ul>
      <!-- 商家评论 -->
      <ul class="comment">
        <li class="comment-goods">评论商品：</li>
        <li>
          <span class="good">
            <img src="/static/img/goods.png">
            <p>好评</p>
          </span>
          <span class="good">
            <img src="/static/img/goods.png">
            <p>中评</p>
          </span>
          <span class="good1">
            <img src="/static/img/goods.png">
            <p>差评</p>
          </span>
        </li>
      </ul>
      <!-- 文本框 -->
      <textarea class="textarea">写下您的评价，我们将不断改进希望能满足您的需求，
您的宝贵意见也能帮助到其他小伙伴哦~</textarea>
      <!-- 上传凭证 -->
      <div class="Images">
        <img src="/static/img/Images.png">
      </div>
    </div>
    <!-- 2 -->
    <div class="OrderInfo">
      <ul class="shoppingcarList">
        <li>
          <span class="goods-img">
            <img src="/static/img/good.png/">
          </span>
          <span class="goods-info">
            <p class="goods-name">304不锈钢圆环O型环不锈钢钢圈圆圈环焊接钢环实心手握</p>
            <p class="goods-price">
              单价：
              <span>¥65.00</span>/件
            </p>
            <p class="goods-iteminfo">规格：xxx</p>
          </span>
        </li>
      </ul>
      <!-- 商家评论 -->
      <ul class="comment">
        <li class="comment-goods">评论商品：</li>
        <li>
          <span class="good">
            <img src="/static/img/goods.png">
            <p>好评</p>
          </span>
          <span class="good">
            <img src="/static/img/goods.png">
            <p>中评</p>
          </span>
          <span class="good1">
            <img src="/static/img/goods.png">
            <p>差评</p>
          </span>
        </li>
      </ul>
      <!-- 文本框 -->
      <textarea class="textarea">写下您的评价，我们将不断改进希望能满足您的需求，
您的宝贵意见也能帮助到其他小伙伴哦~</textarea>
      <!-- 上传凭证 -->
      <div class="Images">
        <img src="/static/img/Images.png">
      </div>
    </div>
    <!-- 物流速度 -->
    <ul class="logistics">
      <li class="speed">物流速度</li>
      <ul>
        <li>
          <img src="/static/img/star.png">
        </li>
        <li>
          <img src="/static/img/star.png">
        </li>
        <li>
          <img src="/static/img/star.png">
        </li>
        <li>
          <img src="/static/img/star.png">
        </li>
        <li>
          <img src="/static/img/star.png">
        </li>
        <li>
          <img src="/static/img/star.png">
        </li>
      </ul>
      <li>一般</li>
    </ul>

    <ul class="logistics">
      <li class="speed">商家服务</li>
      <ul>
        <li>
          <img src="/static/img/star.png">
        </li>
        <li>
          <img src="/static/img/star.png">
        </li>
        <li>
          <img src="/static/img/star.png">
        </li>
        <li>
          <img src="/static/img/star.png">
        </li>
        <li>
          <img src="/static/img/star.png">
        </li>
        <li>
          <img src="/static/img/star.png">
        </li>
      </ul>
      <li>非常好</li>
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
  methods: {}
  //异步
};
</script>



<style scoped>
.content {
  width: 10.8rem;
  background-color: #ecf0f1;
  padding-top: 0.21rem;
}
/* 订单信息 */
.OrderInfo {
  background-color: #ffffff;
  padding-left: 0.28rem;
  padding-top: 0.31rem;
}
.OrderInfo .OrderId {
  font-size: 0.36rem;
  color: #5c5c5c;
  padding-top: 0.39rem;
  padding-bottom: 0.3rem;
}
.OrderNo {
  float: left;
}
.goods-img img {
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 0.1rem;
  float: left;
  padding-right: 0.44rem;
}
.goods-info {
  padding-bottom: 0.4rem;
}
.goods-name {
  color: #021218;
  font-size: 0.4rem;
  padding-bottom: 0.9rem;
}
.goods-price {
  color: #5c5c5c;
  font-size: 0.36rem;
  float: left;
}
.goods-iteminfo {
  color: #5c5c5c;
  font-size: 0.36rem;
}
/* 评价 */
.comment {
  margin-top: 0.62rem;
  font-size: 0.36rem;
  color: #5c5c5c;
}
.comment-goods {
  float: left;
}
.good img {
  height: 0.52rem;
  width: 0.52rem;
  float: left;
}
.good p {
  float: left;
}
.good1 img {
  float: left;
  height: 0.52rem;
  width: 0.52rem;
}
.good p {
  padding-left: 0.23rem;
  padding-right: 1.2rem;
}
/* 文本框 */
.textarea {
  width: 10.2rem;
  height: 3.58rem;
  border: solid 0.02rem #e4e5e5;
  margin-top: 0.38rem;
  font-size: 0.4rem;
  color: #cccaca;
}
/* 上传凭证 */
.Images img {
  width: 1.6rem;
  height: 1.61rem;
  border: solid 0.01rem #b4b4b4;
  margin-top: 0.31rem;
}
.logistics {
  font-size: 0.36rem;
  color: #5c5c5c;
  background-color: #ffffff;
  padding-top: 0.53rem;
  padding-left: 0.21rem;
  padding-bottom: 0.59rem;
}
.logistics img {
  width: 0.46rem;
  height: 0.44rem;
  float: left;
  margin-right: 0.8rem;
}
.speed {
  float: left;
  padding-right: 0.84rem;
}
</style>
