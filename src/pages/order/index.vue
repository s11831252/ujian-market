<template>
    <div>
        <ul>
            <li v-for="(order,i) in OrderList" :key="i">
                       <div class="shopinfo">
            <p v-if="order.sId">{{order.sName}}
                <span class="icon">&#xe601;</span>
            </p>
        </div>
        <ul class="shoppingcarList">
            <li v-for="(item, index) in order.Order_Goods_items" :key="index">
                <span class="goods-img"><img :src="item.Image_url"></span>
                <span class="goods-info">
                    <p class="goods-name">{{item.gName}}</p>
                    <p class="goods-price">单价：
                        <span>￥{{item.Price}}</span>/件</p>
                    <p class="goods-iteminfo" v-if="item.ItemName">规格：{{item.ItemName}}</p>
                </span>
            </li>
        </ul>
                <div class="orderinfo">
            <div class="orderinfo-item">商品金额
                <span>￥{{order.GoodsAmount}}</span>
            </div>
            <div class="orderinfo-item" v-if="order.LogisticsInfo">运费
                <span>￥{{order.LogisticsInfo.Amount}}</span>
            </div>
            <div class="orderinfo-item">实际支付：
                <span class="payamount">{{order.TotalAmount}}</span>
            </div>
        </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      OrderList: null
    };
  },
  methods: {},
  async mounted() {
    var rep = await this.$ShoppingAPI.Order_Get({ PageIndex: 1, PageSize: 10 });
    if (rep.ret == 0) {
      this.OrderList = rep.data;
      console.log(this.OrderList);
    }
  }
};
</script>
<style lang="less" scoped>
.shopinfo {
  font-size: 13px;
  color: #5c5c5c;
  padding: 15px;
  p {
    line-height: 28px;
  }
  span.icon {
    font-size: 28px;
    vertical-align: top;
  }
}
.shoppingcarList {
  margin: 0 17px 17px 17px;
  font-size: 13px;
  li {
    border-bottom: 1px solid #ecf0f1;
    padding: 5px 0;
    .goods-img {
      width: 30%;
      img {
        width: 100%;
        height: 85px;
      }
    }
    .goods-info {
      width: 62%;
      margin-left: 10px;
      .goods-name {
        color: #021218;
        margin-bottom: 15px;
      }
      .goods-price,
      .goods-iteminfo {
        font-size: 12px;
        color: #5c5c5c;
        span {
          color: #ff5252;
        }
      }
    }
    .buy {
      width: 100%;
      height: 25px;
      text-align: right;
    }
    .goods-img,
    .goods-info {
      display: inline-block;
      vertical-align: top;
    }
  }
}
.orderinfo {
  padding: 15px;
  font-size: 12px;
  color: #5c5c5c;
  .orderinfo-item {
    padding: 5px 0;
    border-bottom: 1px solid #ecf0f1;
    line-height: 28px;
    span {
      float: right;
      line-height: 28px;
      span.icon {
        font-size: 28px;
      }
    }
    span.payamount {
      font-size: 15px;
      color: #ff5252;
    }
  }
}
.order-total{
  margin-top: 45px;
  background: #fff;
  font-size: 15px;
  border-top: 1px solid #ecf0f1;
  position: fixed;
  bottom:  0;
  width: 100%;
  line-height: 40px;
  padding: 5px 10px;
  .order-total-money{
      color: #ff5252;
  }
}
</style>
