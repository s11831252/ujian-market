<template>
  <div class="shop-detail">
    <div class="shop-detail-head">
      <div class="shop-detail-logo">
        <img :src="shopDetail.sLogo">
      </div>
      <div class="shop-detail-info">
        <p class="shop-detail-name">{{shopDetail.sName}}</p>
        <p class="shop-detail-notice">店铺公告：
          <span>{{shopDetail.Notice}}</span>
        </p>
        <div class="shop-detail-statistics">
          <p class="shop-detail-statistics-sales">本店销量：
            <span>{{shopDetail.Sales}}</span>
          </p>
          <p class="shop-detail-statistics-goods">商品数：
            <span>{{shopDetail.GoodsCount}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="shop-detail-tab">
      <ul class="navbar">
        <li v-for="(item,index) in Tabs" :key="index" :id="index" :class="{'navbar_item_on':activeIndex == index}" class="navbar_item" @click="tabClick(item,$event)">
          <div class="navbar_title">{{item.name}}</div>
        </li>
      </ul>
      <div class="navbar_slider" :class="navbarSliderClass"></div>
      <div class="navbar-body">
        <div :hidden="activeIndex != 0">
          <div class="shop-detail-tab-goods">
            <ul class="shop-detail-tab-goods-types">
              <li v-for="(item,index) in GoodsType " :key="index" :class="{'active': item.TypeId==activeType}" @click="changeGoodsType(item.TypeId)">
                <p>{{item.TypeName}}</p>
              </li>
            </ul>
            <ul class="shop-detail-tab-goods-list">
              <li v-for="(item,index) in goodList" :key="index" class="shop-detail-tab-goods-detail" @click="go({path:'/pages/shop/detail',query:{sId:item.sId,gId:item.gId,sName:shopDetail.sName}})">
                <div class="shop-detail-tab-goods-logo" >
                  <img :src="item.Images[0].Thumbnail_url">
                </div>
                <div class="shop-detail-tab-goods-info">
                  <p class="shop-detail-tab-goods-title">{{item.gName}}</p>
                  <p class="shop-detail-tab-goods-statistics">
                    <span>月售{{item.Sales}}</span>
                    <span>评论{{item.CommentCount}}</span>
                  </p>
                  <div>
                    <p class="shop-detail-tab-goods-Price">￥{{item.Price}}</p>
                    <span v-if="item.Goods_Items.length>1" class="shop-detail-tab-goods-choose">选规格</span>
                    <buy v-else :goods="item.Goods_Items[0]" :image="item.Images[0].Thumbnail_url" :sName="shopDetail.sName"></buy>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div :hidden="activeIndex != 1">
          &nbsp;
          <h1>评价列表正在开发中</h1>
        </div>
        <div :hidden="activeIndex != 2">
          <h1>商家信息正在开发中</h1>
        </div>
      </div>
    </div>
    <shoppingCar :sId="sId"></shoppingCar>
  </div>
</template>
<script>
import buy from "@/components/buy";
import shoppingCar from "@/components/shoppingCarToolbar";

import {mapGetters,mapMutations } from 'vuex'
export default {
  data() {
    return {
      sId: "",
      shopDetail: {},
      goodList: [],
      GoodsType: [],
      Tabs: [],
      activeIndex: 0,
      activeType: 0
    };
  },
  components: {
    buy,
    shoppingCar
  },
  computed: {
    navbarSliderClass() {
      return "navbar_slider_" + this.activeIndex;
    }
  },
  methods: {
    async tabClick(tab, e) {
      if (e) this.activeIndex = e.currentTarget.id;
    },
    changeGoodsType(typeid) {
      this.activeType = typeid;
      this.goodList = this.shopDetail.Goods.filter(item => {
        if (typeid > 1) return item.TypeId.indexOf(typeid) > -1;
        else return item.TypeId.length == 0;
      });
    }
  },
  async mounted() {
    wx.showShareMenu({
      withShareTicket: true
    });
    this.activeIndex = 0;
    this.Tabs = [
      { name: "商品", type: "1", checked: true },
      { name: "评价", type: "2", checked: true },
      { name: "商家", type: "3", checked: true }
    ];
    this.goodList = [];
    if (this.$route.query && this.$route.query.sId.length > 0) {
      this.sId = this.$route.query.sId;
      var rep = await this.$ShoppingAPI.Shop_GetDetails({ sId: this.sId }); //获取店铺详情
      if (rep.ret == 0) {
        this.shopDetail = rep.data;
        this.Tabs[1].name += `(${this.shopDetail.CommentCount})`; //绑定评价数量
      }
      var rep3 = await this.$ShoppingAPI.Goods_GetByShop({ sId: this.sId }); //获取店铺商品
      if (rep3.ret == 0) {
        this.shopDetail.Goods = rep3.data;
      }
      var rep2 = await this.$ShoppingAPI.CustomGoodsType_Get({ sId: this.sId }); //获取店铺商品分类
      if (rep2.ret == 0) {
        this.GoodsType = rep2.data;
        this.GoodsType.push({ Sort: "0", TypeId: "-1", TypeName: "其他" });
        this.changeGoodsType(this.GoodsType[0].TypeId);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.shop-detail {
  background-color: #12b7f5;
  margin-bottom: 65px;
  .shop-detail-head {
    padding: 20px 5px 0 10px;
    color: #fff;
    .shop-detail-logo {
      width: 24%;
      position: relative;
      img {
        width: 100%;
        height: 80px;
        position: absolute;
      }
    }
    .shop-detail-info {
      padding-left: 10px;
      width: 71%;
      .shop-detail-name {
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 20px;
        font-weight: bold;
      }
      .shop-detail-notice {
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .shop-detail-statistics {
        font-size: 14px;
        p {
          display: inline-block;
          span {
            color: #fffc00;
          }
        }
        .shop-detail-statistics-goods {
          padding-left: 20px;
        }
      }
    }
    .shop-detail-logo,
    .shop-detail-info {
      display: inline-block;
      vertical-align: top;
    }
  }

  .shop-detail-tab {
    background-color: #fff;
    padding-top: 20px;
    .shop-detail-tab-goods {
      height: 100%;
      min-height: 500px;
      .shop-detail-tab-goods-types {
        width: 23%;
        // background-color: rgb(173, 173, 173);
        color: #717070;
        padding: 0 2px 0 8px;
        li {
          height: 40px;
          line-height: 40px;
          p {
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        li.active {
          color: #1b1b1b;
        }
      }
      .shop-detail-tab-goods-list {
        width: 70%;
        .shop-detail-tab-goods-detail {
          margin-top: 10px;
          .shop-detail-tab-goods-logo {
            width: 25%;
            img {
              width: 100%;
              height: 70px;
            }
          }
          .shop-detail-tab-goods-info {
            width: 70%;
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
              font-size: 17px;
              color: #ff5252;
              display: inline-block;
              vertical-align: top;
            }
            .shop-detail-tab-goods-choose{
              display: inline-block;
              float: right;
              color: #fccb5c;
              border: 1px solid;
              border-radius: 10px;
              padding: 0 4px;
            }
          }
          .shop-detail-tab-goods-logo,
          .shop-detail-tab-goods-info {
            display: inline-block;
            vertical-align: top;
          }
        }
      }
      .shop-detail-tab-goods-types,
      .shop-detail-tab-goods-list {
        display: inline-block;
        vertical-align: top;
      }
    }
  }

}

.navbar {
  height: 40px;
  line-height: 40px;
  width: 100%;
  border-bottom: 1rpx solid #ccc;
  position: relative;
}

.navbar_item {
  text-align: center;
  display: inline-block;
  width: 33%;
}

.navbar_item_on {
  color: #12b7f5;
}

.navbar_title {
  font-weight: 500;
  display: inline-block;
}
.navbar-body {
  margin-top: 10px;
}
.navbar_slider {
  position: absolute;
  content: " ";
  left: 0;
  width: 33%;
  height: 2px;
  background-color: #12b7f5;
  -webkit-transition: -webkit-transform 0.1s;
  transition: -webkit-transform 0.1s;
  transition: transform 0.1s;
  transition: transform 0.1s, -webkit-transform 0.1s;
}

.navbar_slider_0 {
  transform: translateX(0);
}

.navbar_slider_1 {
  transform: translateX(100%);
}
.navbar_slider_2 {
  transform: translateX(200%);
}
.navbar_slider_3 {
  transform: translateX(300%);
}
</style>

