<template>
  <div class="shop-detail" v-if="shopDetail">
    <div class="shop-detail-head">
      <div class="shop-detail-logo">
        <img :src="shopDetail.sLogo" @click="previewLogo" />
      </div>
      <div class="shop-simple-info">
        <p class="shop-detail-name">{{shopDetail.sName}}</p>
        <p class="shop-detail-notice">
          店铺公告：
          <span>{{shopDetail.Notice}}</span>
        </p>
        <div class="shop-detail-statistics">
          <p class="shop-detail-statistics-sales">
            本店销量：
            <span>{{shopDetail.Sales}}</span>
          </p>
          <p class="shop-detail-statistics-goods">
            商品数：
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
              <li v-for="(item,index) in $GoodsType " :key="index" :class="{'active': item.TypeId==activeType}" @click="changeGoodsType(item.TypeId)">
                <p>{{item.TypeName}}</p>
              </li>
            </ul>
            <ul class="shop-detail-tab-goods-list">
              <li v-for="(item,index) in goodList" :key="index" class="shop-detail-tab-goods-detail" @click="go({path:'/pages/shop/detail',query:{sId:item.sId,gId:item.gId,sName:shopDetail.sName}})">
                <indexGoodDetail :goodsInfo="item" :sName="shopDetail.sName"></indexGoodDetail>
              </li>
            </ul>
          </div>
        </div>
        <div :hidden="activeIndex != 1">
          <ul class="shop-detail-info">
            <li @click="openLocation">
              <i class="icon">&#xe61f;</i>
              <span>{{shopDetail.Address}}</span>
            </li>
            <li @click="previewImage(shopDetail.License[0],shopDetail.License)">
              <i class="icon">&#xe654;</i>
              <span>查看相关证件</span>
            </li>
            <li>
              <i class="icon">&#xe628;</i>
              <span>主营：{{shopDetail.MainTypeName}}</span>
            </li>
            <li>
              <i class="icon">&#xe60a;</i>
              <span @click="makePhoneCall(shopDetail.Mobile)">{{shopDetail.Mobile}}</span>&nbsp;
              <span @click="makePhoneCall(shopDetail.Tel)">{{shopDetail.Tel}}</span>
            </li>
            <li>
              <i class="icon">&#xe623;</i>
              <span>{{shopDetail.Notice}}</span>
            </li>
            <li>
              <i class="icon">店铺图片</i>
              <ul>
                <li v-for="(item,index) in shopDetail.ShopImages" :key="index">
                  <!-- <img mode="widthFix" :src="item.ThumbnailUrl"> -->
                  <img :src="item.ThumbnailUrl" @click="previewImage(item,shopDetail.ShopImages)" />
                </li>
              </ul>
            </li>
            <li>
              <i class="icon">店铺简介</i>
              <span>{{shopDetail.Brief}}</span>
            </li>
          </ul>
        </div>
        <div :hidden="activeIndex != 2">
          <h1>商家信息正在开发中</h1>
        </div>
      </div>
    </div>
    <div class="live-room" v-if="shopDetail.LiveRoomId&&Config.showBuy" @click="go({ path: '/pages/live/room', query: {roomId: shopDetail.LiveRoomId}})">
        <i class="icon rectbox">
          <span class="rect"></span>
          <span class="rect rect2"></span>
          <span class="rect rect3"></span>
        </i>
        <span class="txt">直播中</span>
    </div>
    <shoppingCar :sId="sId" :sName="shopDetail.sName"></shoppingCar>
  </div>
</template>
<script>
import shoppingCar from "@/components/shoppingCarToolbar";
import indexGoodDetail from "./index-good-detail";
import { mapState, mapMutations } from "vuex";
import WebIM from "@/utils/hx/WebIM";

export default {
  data() {
    return {
      sId: "",
      shopDetail: null,
      goodList: [],
      shopGoods: [],
      GoodsType: [],
      Tabs: [],
      activeIndex: 0,
      activeType: 0,
      gcj02: {
        latitude: 0,
        longitude: 0
      }
    };
  },
  components: {
    shoppingCar,
    indexGoodDetail
  },
  computed: {
    navbarSliderClass() {
      return "navbar_slider_" + this.activeIndex;
    },
    $GoodsType() {
      var that = this;
      var list = that.GoodsType.filter(item => {
        if (item.TypeId > 0 && that.shopGoods) {
          var goods = that.shopGoods.find(v => {
            return v.TypeId.indexOf(item.TypeId) >= 0;
          });
          return goods != null;
        } else {
          var goods = that.shopGoods.find(v => {
            return v.TypeId.length == 0;
          });
          return goods != null;
        }
      });
      return list;
    },
    ...mapState({
      UserInfo: state => state.User.UserInfo,
      Config: state => state.Global.Config
    })
  },
  methods: {
    joinRoom(id) {
      var that = this;
      that.$router.push({ path: "/pages/live/room", query: { roomId: id } });
    },
    openLocation() {
      var that = this;
      // console.log(that.gcj02);
      wx.openLocation({
        latitude: that.gcj02.latitude,
        longitude: that.gcj02.longitude,
        scale: 18
      });
    },
    previewLogo() {
      if (this.isMP) {
        wx.previewImage({
          current: this.shopDetail.sLogo, // 当前显示图片的http链接
          urls: [this.shopDetail.sLogo] // 需要预览的图片http链接列表
        });
      }
    },
    previewImage(item, images) {
      if (this.isMP) {
        let urls = images.map(item => {
          return item.ImgUrl;
        });
        wx.previewImage({
          current: item.ImgUrl, // 当前显示图片的http链接
          urls // 需要预览的图片http链接列表
        });
      }
    },
    makePhoneCall(phoneNumber) {
      if (this.isMP) {
        wx.makePhoneCall({
          phoneNumber: phoneNumber
        });
      }
    },
    async tabClick(tab, e) {
      if (e) this.activeIndex = e.currentTarget.id;
    },
    changeGoodsType(typeid) {
      this.activeType = typeid;
      if (this.shopGoods) {
        this.goodList = this.shopGoods.filter(item => {
          if (typeid > 1) return item.TypeId.indexOf(typeid) > -1;
          else return item.TypeId.length == 0;
        });
      }
    },
    ...mapMutations(["viewHistory_push"])
  },
  onShareAppMessage(result) {
    let title = this.shopDetail.sName;
    let path = `/pages/shop/index?sId=${this.sId}&InvitaId=${this.UserInfo.UserId}`;
    let imageUrl = "https://image.ujianchina.net/MiniProgram/share.png";
    return {
      title,
      path,
      imageUrl
    };
  },
  onLoad(query) {
    // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    if (query.scene) this.sId = decodeURIComponent(query.scene);
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  async mounted() {
    console.log("mounted", this.$route);
    let that = this;
    this.extraDataHandler();
    this.wx_login(async () => {
      this.activeIndex = 0;
      this.Tabs = [
        { name: "商品", type: "1", checked: true },
        // { name: "评价", type: "2", checked: true },
        { name: "商家", type: "3", checked: true }
      ];
      this.goodList = [];
      if (this.sId || (this.$route.query && this.$route.query.sId.length > 0)) {
        this.sId = this.sId || this.$route.query.sId;
        var rep = await this.$ShoppingAPI.Shop_GetDetails({ sId: this.sId }); //获取店铺详情

        if (rep.ret == 0) {
          this.shopDetail = rep.data;
          // this.Tabs[1].name += `(${this.shopDetail.CommentCount})`; //绑定评价数量
          if (this.isMP) {
            wx.setNavigationBarTitle({ title: this.shopDetail.sName });
            that.$ShoppingAPI.baidu_geocoder({ location: `${that.shopDetail.Latitude},${that.shopDetail.Longitude}`, coordtype: "bd09ll", ret_coordtype: "gcj02ll" }).then(rep2 => {
              if (rep2.status == 0) {
                that.gcj02.latitude = rep2.result.location.lat;
                that.gcj02.longitude = rep2.result.location.lng;
              }
            });
          }
          this.viewHistory_push({ sId: this.shopDetail.sId, sLogo: this.shopDetail.sLogo, sName: this.shopDetail.sName });
        }

        var rep3 = await this.$ShoppingAPI.Goods_GetByShop({ sId: this.shopDetail.sId }); //获取店铺商品
        if (rep3.ret == 0) {
          this.shopGoods = rep3.data;
        }
        var rep2 = await this.$ShoppingAPI.CustomGoodsType_Get({ sId: this.shopDetail.sId }); //获取店铺商品分类
        if (rep2.ret == 0) {
          this.GoodsType = rep2.data;
          this.GoodsType.push({ Sort: "0", TypeId: "-1", TypeName: "其他" });
          if(this.$GoodsType!=null)
          this.changeGoodsType(this.$GoodsType[0].TypeId);
        }
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.shop-detail {
  padding-bottom: 65px;
  .shop-detail-head {
    background-color: #12b7f5;
    padding: 0.64rem 0 0 0.29rem;
    color: #fff;
    .shop-detail-logo {
      width: 2.46rem;
      position: relative;
      img {
        // width: 100%;
        // height: 80px;
        width: 2.46rem;
        height: 2.46rem;
        position: absolute;
        border-radius: 10%;
      }
    }
    .shop-simple-info {
      padding-left: 10px;
      width: 70%;
      .shop-detail-name {
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 20px;
        font-weight: bold;
      }
      .shop-detail-notice {
        font-size: 14px;
        // overflow-y: hidden;
        // height: 0.84rem;
        // text-overflow: ellipsis;
        // white-space: nowrap;
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
    .shop-simple-info {
      display: inline-block;
      vertical-align: top;
    }
  }

  .shop-detail-tab {
    background-color: #fff;
    padding-top: 20px;
    .shop-detail-tab-goods {
      height: 100%;
      min-height: 400px;
      display: flex;
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
        width: 74%;
        .shop-detail-tab-goods-detail {
          margin-top: 10px;
        }
      }
      .shop-detail-tab-goods-types,
      .shop-detail-tab-goods-list {
        display: inline-block;
        // float: left;
        vertical-align: top;
      }
    }
    ul.shop-detail-info {
      > li {
        border-bottom: 1px solid #d6d6d6;
        padding: 7px 0;
        line-height: 0.4rem;
        i {
          font-size: 20px;
          display: inline-block;
          vertical-align: top;
          margin: 0 10px;
        }
        ul {
          display: inline-block;
          li {
            float: left;
            margin-top: 10px;
          }
        }
        i.icon {
          vertical-align: initial;
          font-size: 0.45rem;
        }
        span {
          color: #444444;
          font-size: 13px;
        }
        img {
          width: 2.59rem;
          height: 2.59rem;
          margin: 0 0 0 5px;
        }
      }
    }
  }
  .live-room {
    position: absolute;
    width: 1.33rem;
    right: 0.3rem;
    top: 1.6rem;
    border-radius: 30%;
    border: solid #8fc4d8 0.02rem;
    background-color: rgba(160, 227, 251, 0.3);
    text-align: center;
    padding: 0.21rem 0.24rem 0.29rem 0.21rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon {
      width: 0.62rem;
      height: 0.62rem;
      line-height: 0.62rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fc8749;
      color: #fff0ee;
      margin-bottom: 0.27rem;
    }
    .txt {
      display: inline-block;
      font-size: 0.36rem;
    }
  }
}

.navbar {
  height: 40px;
  line-height: 40px;
  width: 100%;
  border-bottom: 1rpx solid #ccc;
  position: relative;
  font-size: 0.41rem;
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
  // margin-top: 10px;
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

