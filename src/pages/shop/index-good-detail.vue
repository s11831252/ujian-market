<template>
  <div class="shop-detail-tab-goods-root">
    <div class="shop-detail-tab-goods-logo">
      <img :src="goodsInfo.Images&&goodsInfo.Images.length>0?goodsInfo.Images[0].Thumbnail_url:''" mode="aspectFill" />
    </div>
    <div class="shop-detail-tab-goods-info">
      <p class="shop-detail-tab-goods-title">{{goodsInfo.gName}}</p>
      <p class="shop-detail-tab-goods-statistics">
        <span>月售{{goodsInfo.Month_Sales}}</span>
        <span>评论{{goodsInfo.CommentCount}}</span>
      </p>
      <div class="shop-detail-tab-goods-Price">
        <p class="txt">￥{{Price_fmt}}</p>
        <span v-if="goodsInfo.Goods_Items.length>1" class="shop-detail-tab-goods-choose">选规格</span>
        <buy v-else-if="goodsInfo.gType!=1" :goods="goodsInfo.Goods_Items[0]" :image="goodsInfo.Images.length>0?goodsInfo.Images[0].Thumbnail_url:''" :sName="sName"></buy>
      </div>
    </div>
  </div>
</template>
<script>
import buy from "@/components/buy";

export default {
  props: {
    goodsInfo: Object,
    sName: String
  },
  components: {
    buy
  },
  computed: {
    Price_fmt() {
      //商品单价格式化
      if (this.goodsInfo.gType == 1) {
        //gType==1显示议价
        return "议价";
      } else if (this.goodsInfo.Goods_Items.length > 1) {
        //如果有多个规格,则根据单规格价钱排序,显示格式为: 最低价格 - 最高价格
        var sortGoods = this.goodsInfo.Goods_Items.sort((a, b) => {
          return a.Price - b.Price;
        });
        if (sortGoods[0].Price == sortGoods[sortGoods.length - 1].Price) return `${this.goodsInfo.Goods_Items[0].Price}`;
        else return `${sortGoods[0].Price} - ${sortGoods[sortGoods.length - 1].Price}`;
      } else return `${this.goodsInfo.Goods_Items[0].Price}`;
    }
  }
};
</script>
<style lang="scss" scoped>
.shop-detail-tab-goods-root {
  display: flex;
  .shop-detail-tab-goods-logo {
    img {
      // width: 100%;
      // height: 70px;
      width: 2.16rem;
      height: 2.16rem;
      border: 1px solid #d6d6d6;
    }
  }
  .shop-detail-tab-goods-info {
    width: 67%;
    margin-left: 5px;
    .shop-detail-tab-goods-title {
      font-size: 15px;
      color: #1b1b1b;
      margin-bottom: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .shop-detail-tab-goods-statistics {
      font-size: 13px;
      color: #979797;
      margin-bottom: 6px;
      span {
        margin-right: 10px;
      }
    }
    .shop-detail-tab-goods-Price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .txt {
        font-size: 0.4rem;
        color: #ff5252;
        vertical-align: top;
      }
      .shop-detail-tab-goods-choose {
        color: #ecf0f1;
        background: #ff5252;
        border: 1px solid;
        border-radius: 10px;
        padding: 0.1rem;
        font-size: 0.32rem;
      }
    }
  }
}
</style>
