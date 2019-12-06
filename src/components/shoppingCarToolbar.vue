<template>
    <div class="shoppingcar" :class="{showed:showed}" v-if="Config.showBuy">
        <div class="shoppingcar-goods" v-if="showed">
            <span class="icon close" @click="taggle">&#xe603;</span>
            <div class="bar">
              <span>已选商品</span>
              <span class="empty" @click="ShoppingCarEmpty({sId:sId})"><span class="icon">&#xe8e6;</span><span>清空</span></span>
            </div>
            <ul class="shoppingcar-goods-list">
              <li v-for="(item,index) in getShoppingCarGoods" :key="index">
                <div class="shoppingcar-goods-name">
                  <p>{{item.gName}}</p>
                  <p class="shoppingcar-goods-itemname" v-if="item.ItemName">规格:{{item.ItemName}}</p>
                </div>
                <buy :goods="item" :image="item.Image" :sName="getShoppingCarBysId.sName"></buy>
              </li>
            </ul>
        </div>
        <div class="shoppingcar-toolbar">
            <span class="service" @click="go({path:'/pages/service/consult'})">
              <i class="icon service-icon">&#xe734;</i>
              <p>联系客服</p>
            </span>
            <i class="icon car-icon" :class="{has:getShoppingCarCountBysId>0}">
              &#xe600;
               <span v-if="getShoppingCarCountBysId>0" class="shoppingcar-count">{{getShoppingCarCountBysId}}</span>
              </i>
            <span class="shoppingcar-amount">￥{{getShoppingCarAmountBysId}}</span>
            <button v-if="getShoppingCarAmountBysId>0" class="btn-buy" @click="go({path:'/pages/order/settle',query:{sId:sId}})">去结算</button>
            <button v-else class="btn-buy Invalid">去结算</button>
            <button class="btn-show" @click="taggle">购物车</button>
        </div>
      <div class="shoppingcar-bg">
      </div>
    </div>
</template>
<script>
import {mapState, mapMutations } from "vuex";
import buy from "@/components/buy";
export default {
    props:{
        sId:String,
    },
    data(){
      return {
        showed:false,
        sName:"",
      };
    },
  computed: {
    getShoppingCarBysId(){
      var shopCar =this.$store.getters.getShoppingCarBysId(this.sId);
      if(shopCar)
        return shopCar;
      else
        return {};
    },
    getShoppingCarGoods() {
      var shopCar = this.getShoppingCarBysId;
      if(shopCar&&shopCar.goods)
        return shopCar.goods;
      else
        return [];
    },
    getShoppingCarAmountBysId() {
      return this.$store.getters.getShoppingCarAmountBysId(this.sId).toFixed(2);
    },
    getShoppingCarCountBysId() {
      return this.$store.getters.getShoppingCarCountBysId(this.sId);
    },
    ...mapState({
      Config: state => state.Global.Config      
    })
  },
  components:{
    buy,
  },
  methods:{
    ...mapMutations([
      'ShoppingCarEmpty'
    ]),
    taggle(){
      this.showed=!this.showed;
    },
  }
};
</script>
<style lang="less" scoped>
.shoppingcar {
  position: fixed;
  color: #bfbfbf;
  background-color: rgba(0,0,0,0.8);
  // filter: alpha(opacity=80);
  // -moz-opacity: 0.8;
  // -khtml-opacity: 0.8;
  // opacity: 0.8;
  bottom: 0;
  width: 100%;
  height: 1.45rem;
  z-index: 999;
  .shoppingcar-goods{
    color: #686565;
    font-size: 0.4rem;
    background-color: #fff;
    width: 100%;
    position: absolute;
    bottom: 1.45rem;
    .close{
      font-size: 28px;
      position: absolute;
      right: 0;
      top: -29px;
    }
    .bar{
      padding: 10px;
      background-color: #ebeff2;
      
      span{
        display: inline-block;
      }
      span.empty{
        font-size: 0.4rem;
        float: right;
      }
    }
    .shoppingcar-goods-list{
      padding: 10px;
      color: #686565;
      font-size: 0.4rem;
      li{
          min-height: 24px;
          border-bottom: #ecf0f1 1px solid;
          margin-bottom: 4px;
        .shoppingcar-goods-name{
          width: 60%;
          display: inline-block;

          .shoppingcar-goods-itemname{
          color: #a2a2a2;
          font-size: 0.3rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              clear:both;
          }
        }
      }
    }
  }
  .shoppingcar-toolbar {
    color: #ffffff;
    display: flex;
    align-items: center;
    height: 1.45rem;
    width: 100%;
    position: absolute;
    bottom: 0;
    .service{
      display: inline-block;
      font-size: 0.27rem;
      text-align: center;
      .service-icon{
        font-size: 0.64rem;
      }
      margin-left: 0.42rem;
      margin-right: 0.72rem;
    }
    .car-icon, {
      color: #bfbfbf;
      font-size: 0.8rem;
      position: relative;
      display: inline-block;
      padding-left: 0.5rem;
      border-left: 0.02rem solid #bfbfbf;
      .shoppingcar-count{
        position: absolute;
        top: -0.1rem;
        right: -0.2rem;
        font-size:0.26rem;
        background: #ff5252;
        border-radius: 50%;
        text-align: center;
        color: #ffffff;
        min-width: 0.46rem;
        width: auto;
        height: 0.46rem;
        line-height: 0.46rem;
      }
    }
    .car-icon.has{
      color: #fccb5c;
    }
    .shoppingcar-amount {
      margin-left: 0.5rem;
      line-height: 30px;
      font-size: 15px;
    }
    .btn-buy ,.btn-show{
      // height: 38px;
      line-height: initial;
      background-color: #12b7f5;
      font-size: 16px;
      font-weight: bold;
      padding: 4px 6px;
      border: 0;
      // float: right;
      color: #ffffff;
      border-radius: 10px;
      position: absolute;
      right: 2%;
      // bottom: 20%;
    }
    .Invalid {
       background-color:#bfbfbf
    }
    .btn-show{
      background-color: #fccb5c;
      margin-right: 10px;
      right: 16%;
    }
  }
}
.shoppingcar.showed{
  height: 100%;
}
</style>
