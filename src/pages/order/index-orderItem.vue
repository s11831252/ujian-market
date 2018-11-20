<template>
    <div v-if="order">
        <div class="shopinfo">
            <p>
                <span v-if="order.sName">{{order.sName}}</span>
                <span class="icon">&#xe601;</span>
                <span class="right">{{stateName}}</span>
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
            <div class="orderinfo-item btn-group">
                <button v-if="stateName=='待付款'" @click="cancle" class="btn right">取消订单</button>
                <button v-if="stateName=='待付款'" @click="go({path:'/pages/order/pay',query:{OrderId:order.OrderId}})" class="btn right pay">付款</button>
                <button v-if="stateName=='待发货'" @click="ApplyCancel" class="btn right">申请退款</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: {
    order: Object
  },
  computed: {
    stateName() {
      if (this.order) {
        var _stateName = "";
        switch (this.order.State) {
          case 0: {
            if (this.order.IsCancelling) _stateName = "已退款";
            else _stateName = "已取消";
            break;
          }
          case 1: {
            _stateName = "待付款";
            break;
          }
          case 2: {
            if (this.order.IsCancelling) _stateName = "退款中";
            else _stateName = "待发货";
            break;
          }
          case 3: {
            _stateName = "已发货";
            break;
          }
          case 4: {
            _stateName = "已完成";
            break;
          }
          default: {
            _stateName = "未知状态";
          }
        }
        return _stateName;
      } else return "";
    }
  },
  methods: {
    async cancle() {
      var rep = await this.$ShoppingAPI.Order_Cancel({
        OrderId: this.order.OrderId,
        CancelType: 0
      });
      if (rep.ret == 0) {
        this.order.State = 0;
      }
    },
    async ApplyCancel() {
      var rep = this.$ShoppingAPI.Order_ApplyCancel({
        OrderId: this.order.OrderId,
        CancelType: 0,
        IsCancelling: true
      });
      if (rep.ret == 0) {
        this.order.IsCancelling = true;
      }
    }
  },
  mounted() {}
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
  .btn-group {
    height: 30px;
    border: none;
    .btn {
      display: inline-block;
      padding: 0 10px;
      margin: 0px;
      line-height: auto;
      font-size: 14px;
      margin-right: 10px;
      min-width: 20%;
      border-radius: 10px;
      border: 1px solid;
      border-color: transparent;
    }
    .pay {
      border: 1px solid #12b7f5;
      color: #12b7f5;
    }
  }
}
</style>

