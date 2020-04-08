<template>
    <div class="page">
        <div class="shopinfo">
            <p>{{getShoppingCarBysId.sName}}
                <span class="icon">&#xe601;</span>
            </p>
        </div>
        <ul class="shoppingcarList">
            <li v-for="(item, index) in getShoppingCarGoods" :key="index">
                <span class="goods-img"><img :src="item.Image"></span>
                <span class="goods-info">
                    <p class="goods-name">{{item.gName}}</p>
                    <p class="goods-price">单价：
                        <span>￥{{item.Price}}</span>/件</p>
                    <p class="goods-iteminfo" v-if="item.ItemName">规格：{{item.ItemName}}</p>
                </span>
                <div class="buy">
                    <buy :goods="item" :image="item.Image" :sName="getShoppingCarBysId.sName"></buy>
                </div>
            </li>
        </ul>
        <div class="orderinfo">
            <div class="orderinfo-item">商品金额
                <span>￥{{getShoppingCarAmountBysId}}</span>
            </div>
            <div class="orderinfo-item" @click="go({path:'/pages/order/distribution',query:{sId:sId}})">配送方式
                <span v-if="!Logistics.Name" >请选择<span class="icon">&#xe601;</span></span>
                <span v-else >{{Logistics.LogisticsId==1?Logistics.Name+"："+Logistics.DistributionMode.DistributionModeText:Logistics.Name}} <span class="icon">&#xe601;</span></span>
            </div>
            <div class="orderinfo-item">送货路程
                <span>{{Logistics.FreightInfo?Logistics.FreightInfo.distance.text:'0.0'}}</span>
            </div>
            <div class="orderinfo-item">运费总计
                <span>￥{{Logistics.FreightInfo?Logistics.FreightInfo.Freight:'0.00'}}</span>
            </div>
            <div class="orderinfo-item">买家留言：<input type="text" class="left" v-model="Remarks" placeholder="对商品有什么期待，快跟商家说说吧~" /></div>
            <div class="orderinfo-item">实际支付：
                <span class="payamount">{{PayAmount}}</span>
            </div>
        </div>
        <div class="order-total">
          <span>合计：<span class="order-total-money">￥{{PayAmount}}</span></span>
          <button @click="pay" class="btn-ok">确认下单</button>
        </div>
    </div>
</template>
<script>
import buy from "@/components/buy"
import { mapMutations } from "vuex";
export default {
  components: {
    buy
  },
  data() {
    return {
      sId: "",
      Remarks:"",
    };
  },
  methods:{
    ...mapMutations([
      'ShoppingCarEmpty'
    ]),
    async pay(){
      if(!this.getShoppingCarBysId.Logistics)
        this.toast("请选择配送方式")

      if(this.getShoppingCarGoods.length<=0)
        this.toast("请选择下单商品")

         var rep = await  this.$ShoppingAPI.Order_Create({
            LogisticsMode:this.Logistics.LogisticsId,
            DistributionModeId:this.Logistics.DistributionMode.DistributionModeId,
            Order_Address_Id:this.Logistics.Order_Address_Id,
            Remarks : this.Remarks,
            Order_Goods_Items:this.getShoppingCarGoods.map(item=>{
              return {gId:item.gId,gItemId:item.ItemId,Number:item.Number}
             })
          });
        if(rep.ret==0)
        {
          this.ShoppingCarEmpty({sId:this.sId})
            this.$router.replace({
              path:'/pages/order/pay',
              query:{
                OrderId:rep.data
              }
            });
        }
    }
  },
  computed: {
    Logistics() {
      var shopCar = this.$store.getters.getShoppingCarBysId(this.sId);
        if (shopCar&&shopCar.Logistics) return shopCar.Logistics;
      else 
        return {

        };
    },
    PayAmount(){
      var amount =0;
      var goodsAmount =parseFloat(this.getShoppingCarAmountBysId);
      var LogisticsAmount =parseFloat(this.Logistics.FreightInfo?this.Logistics.FreightInfo.Freight:0);
      amount=goodsAmount+LogisticsAmount;
      return amount.toFixed(2)
    },
    getShoppingCarBysId() {
      var shopCar = this.$store.getters.getShoppingCarBysId(this.sId);
      if (shopCar) return shopCar;
      else return {};
    },
    getShoppingCarGoods() {
      var shopCar = this.getShoppingCarBysId;
      if (shopCar && shopCar.goods) return shopCar.goods;
      else return [];
    },
    getShoppingCarAmountBysId() {
      return this.$store.getters.getShoppingCarAmountBysId(this.sId).toFixed(2);
    },
    getShoppingCarCountBysId() {
      return this.$store.getters.getShoppingCarCountBysId(this.sId);
    }
  },
  mounted() {
    if (this.$route.query && this.$route.query.sId.length > 0) {
      this.sId = this.$route.query.sId;
    }
  }
};
</script>
<style lang="less" scoped>
.page{
  margin-bottom: 45px;
  background-color: #fff;
}
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
    input.left {
      float: initial;
      color: #a2a2a2;
      border: none;
      display: inline-block;
      width: 80%;
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
  .btn-ok {
    line-height: initial;
    background-color: #12b7f5;
    font-size: 16px;
    font-weight: bold;
    padding: 4px 16px;
    border: 0;
    color: #ffffff;
    border-radius: 5px;
    float: right;
    margin-right: 5%;
  }
}

</style>
