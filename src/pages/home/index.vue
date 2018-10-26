<template>
  <div class="page">
    <swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" duration="1000">
      <block v-for="(item, index) in Market.Banners" :index="index" :key="index">
        <swiper-item>
          <img :src="item.ImageUrl" class="slide-image" mode="aspectFill" />
        </swiper-item>
      </block>
    </swiper>
    <div class="news box">
      <p v-text="Market.News.title"></p>
    </div>
    <ul class="box category">
      <li v-for="(item,index) in Market.Category" :key="index">
        <img :src="item.ImageUrl" :title="item.Title">
      </li>
    </ul>
    <div class="box service">
      <div class="box-head">
        <p>市场焦点
          <span>Market focus</span>
        </p>
      </div>
      <div class="box-body">
        <ul class="Primary">
          <li v-for="(item,index) in Market.Service.Primary" :key="index">
            <img :src="item.ImageUrl" :title="item.Title">
          </li>
        </ul>
        <ul class="Secondary">
          <li v-for="(item,index) in Market.Service.Secondary" :key="index">
            <img :src="item.ImageUrl" :title="item.Title">
          </li>
        </ul>
      </div>
    </div>
    <div class="box nearby">
      <div class="box-head">
        <p>附近商家
          <span>Nearby merchants</span>
        </p>
      </div>
      <div class="box-body">
        <div class="nearby-location">
          <p>我的定位:<span>龙光水悦龙湾</span></p>
          <span class="icon">&#xe65e;</span>
        </div>
        <div class="nearby-merchants">
          <ul class="navbar">
            <li v-for="(item,index) in Tabs" :key="index" :id="index" :class="{'navbar_item_on':activeIndex == index}" class="navbar_item" @click="tabClick(item,$event)">
              <div class="navbar_title">{{item.name}}</div>
            </li>
          </ul>
          <div class="navbar_slider" :class="navbarSliderClass"></div>
          <div class="nearby-merchants-list">
            <div :hidden="activeIndex != 0">
              <ul>
                <li v-for="(item,index) in ShopList" :key="index">
                  <div class="shop-item" @click="go({path:'/pages/shop/index',query:{sId:item.sId}})">
                    <div class="shop-item-logo">
                      <img :src="item.sLogo">
                    </div><div class="shop-item-info">
                      <p class="shop-item-info-name">{{item.sName}}<span class="shop-item-info-distance">{{item.Distance}}米</span></p>
                      <p class="shop-item-info-score">店铺综合评分：<span class="">{{item.Score}}</span></p>
                      <p class="shop-item-info-maintype">主营：<span class="">{{item.MainType}}</span></p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div :hidden="activeIndex != 1">
              <ul>
                <li v-for="(item,index) in ShopList" :key="index">
                  <div class="shop-item">
                    <div class="shop-item-logo">
                      <img :src="item.sLogo">
                    </div><div class="shop-item-info">
                      <p class="shop-item-info-name">{{item.sName}}<span class="shop-item-info-distance">{{item.Distance}}米</span></p>
                      <p class="shop-item-info-score">店铺综合评分：<span class="">{{item.Score}}</span></p>
                      <p class="shop-item-info-maintype">主营：<span class="">{{item.MainType}}</span></p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div :hidden="activeIndex != 2">
              <ul>
                <li v-for="(item,index) in ShopList" :key="index">
                  <div class="shop-item">
                    <div class="shop-item-logo">
                      <img :src="item.sLogo">
                    </div><div class="shop-item-info">
                      <p class="shop-item-info-name">{{item.sName}}<span class="shop-item-info-distance">{{item.Distance}}米</span></p>
                      <p class="shop-item-info-score">店铺综合评分：<span class="">{{item.Score}}</span></p>
                      <p class="shop-item-info-maintype">主营：<span class="">{{item.MainType}}</span></p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div :hidden="activeIndex != 3">
              <ul>
                <li v-for="(item,index) in ShopList" :key="index">
                  <div class="shop-item">
                    <div class="shop-item-logo">
                      <img :src="item.sLogo">
                    </div><div class="shop-item-info">
                      <p class="shop-item-info-name">{{item.sName}}<span class="shop-item-info-distance">{{item.Distance}}米</span></p>
                      <p class="shop-item-info-score">店铺综合评分：<span class="">{{item.Score}}</span></p>
                      <p class="shop-item-info-maintype">主营：<span class="">{{item.MainType}}</span></p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <h1>行业市场首页</h1>
        <a @click="go('/pages/index/index')" class="counter">去往授权页</a> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      Market: {
        Banners: [],
        Category: [],
        Service: {
          Primary: [],
          Secondary: []
        },
        News: {}
      },
      ShopList: [],
      Tabs: [
        {
          name: "综合",
          type: "1",
          parm: { PageIndex: 1, PageSize: 20, OrderType: "DEFAULT" },
          checked: true
        },
        {
          name: "人气",
          type: "2",
          parm: { PageIndex: 1, PageSize: 20, OrderType: "HOT" },
          checked: true
        },
        {
          name: "销量",
          type: "3",
          parm: { PageIndex: 1, PageSize: 20, OrderType: "SALE" },
          checked: true
        },
        {
          name: "距离",
          type: "4",
          parm: { PageIndex: 1, PageSize: 20, OrderType: "DISTANCE" },
          checked: true
        }
      ],
      activeIndex: 0
    };
  },
  computed: {
    navbarSliderClass() {
      return "navbar_slider_" + this.activeIndex;
    }
  },
  methods: {
    async marketGet() {
      var rep = await this.$ShoppingAPI.Market_Get();
      if (rep.ret == 0) {
        this.Market = rep.data;
      }
    },
    async tabClick(tab, e) {
      if (e) this.activeIndex = e.currentTarget.id;
      var rep = await this.$ShoppingAPI.Shop_Get(tab.parm);
      if (rep.ret == 0) {
        this.ShopList = rep.data;
      }
    }
  },
  onPullDownRefresh(){
    console.log("page index onPullDownRefresh", this);
    this.activeIndex=0;
    this.marketGet();
    this.tabClick(this.Tabs[0]);
  },
  created() {
    console.log("page index created", this);
  },
  onLoad() {
    console.log("page index onLoad", this);
  },
  onReady() {
    console.log("page index onReady", this);
  },
  onShow() {
    console.log("onShow", this);
  },
  mounted() {
    console.log("mounted", this);
    this.marketGet();
    this.tabClick(this.Tabs[0]);
  },
  onUnload() {
    console.log("onUnload", this);
  },
  onHide() {
    console.log("onHide", this);
  }
};
</script>
<style  lang="less">
.page {
  background: #ecf0f1;
}
.swiper .slide-image {
  width: 100%;
  height: 100%;
}
.box {
  background: #fff;
  margin-bottom: 10px;
  .box-head {
    padding: 10px;
    border-bottom: 1px solid @borderColor;
    p {
      color: #12b7f5;
      span {
        padding-left: 10px;
        color: #7f8699;
      }
    }
  }
}
.news {
  padding: 10px;
}
.news p {
  border-left: 2px solid #12b7f5;
  padding-left: 5px;
}
.category {
  margin: 10px;
}
.category li {
  display: inline-block;
  text-align: center;
  width: 25%;
}
.category li img {
  width: 80px;
  height: 80px;
}
@borderColor: #ecf0f1;
.service {
  .Primary {
    border-bottom: 1px solid @borderColor;
    li {
      display: inline-block;
      text-align: center;
      width: 49.5%;
      img {
        width: 100%;
        height: 118px;
      }
    }
    li:nth-of-type(odd) {
      border-right: 1px solid @borderColor;
    }
  }
  .Secondary li {
    display: inline-block;
    text-align: center;
    width: 25%;
    img {
      width: 100%;
      height: 120px;
    }
  }
}

.navbar {
  // display: -webkit-box;
  // display: -webkit-flex;
  // display: flex;
  // position: fixed;
  // z-index: 500;
  // top: 0;
  height: 40px;
  line-height: 40px;
  width: 100%;
  // background-color: #298de5;
  border-bottom: 1rpx solid #ccc;
  position: relative;
}

.navbar_item {
  // position: relative;
  // display: block;
  // -webkit-box-flex: 1;
  // -webkit-flex: 1;
  // flex: 1;
  // padding: 13px 0;
  text-align: center;
  // font-size: 0;
  display: inline-block;
  width: 25%;
}

.navbar_item_on {
  color: #12b7f5;
  //  border-bottom: 2px solid #12b7f5;
}

.navbar_title {
  // color: white;
  font-weight: 500;
  display: inline-block;
  // font-size: 15px;
  // max-width: 8em;
  // width: auto;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  // word-wrap: normal;
}

.navbar_slider {
  position: absolute;
  content: " ";
  left: 0;
  // bottom: 0;
  width: 25%;
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
.nearby{
  .nearby-location{
    color:#6b6b6b;
    border-bottom:1px solid @borderColor;
    padding: 10px;
    .icon,p{
      display: inline;
    }
  }
  .nearby-merchants{
    
    .nearby-merchants-list{
      margin-top: 10px;
      margin: 10px;
      .shop-item{
        margin-top:10px;
        .shop-item-logo{
          width: 25%;
          img{
            width: 100%;
            height: 100%;
            border-radius: 10%;
          }
        }
        .shop-item-info{
          padding-left: 8px;
          width: 66%;
          .shop-item-info-name{
            font-size: 16px;
            color: #021218;
            margin-bottom: 10px;
            position: relative;
            .shop-item-info-distance{
              position: absolute;
              right: 0;
            }
          }
          .shop-item-info-score{
            color: #5c5c5c;
            margin-bottom: 10px;
            span{
              color: #ff5252;
            }
          }
          .shop-item-info-maintype{
            color: #a2a2a2;
          }
          .shop-item-info-score,.shop-item-info-maintype{
            font-size: 14px;
          }
        }
        .shop-item-logo,.shop-item-info{
          display: inline-block;
          vertical-align: top;
          height: 80px;
        }
      }
    }
  }
}

</style>

