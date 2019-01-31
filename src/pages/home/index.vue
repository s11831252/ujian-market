<template>
  <div class="page">
    <div class="search">
      <div @click="go({path:'/pages/home/search'})">
        <i class="icon">&#xe6e3;</i>&nbsp;
        <span>搜索</span>
      </div>
    </div>
    <swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" duration="1000">
      <block v-for="(item, index) in Market.Banners" :index="index" :key="index">
        <swiper-item>
          <img :src="item.ImageUrl" class="slide-image" mode="aspectFill">
        </swiper-item>
      </block>
    </swiper>
    <div class="news box">
      <p v-text="Market.News.title"></p>
    </div>
    <ul class="box category">
      <li v-for="(item,index) in Market.Category" :key="index" @click="go({path:'/pages/home/subject', query:{title:item.ActionParameter.WebApp.Parameter.title,MainType:item.ActionParameter.WebApp.Parameter.MainType}})">
        <img :src="item.ImageUrl" :title="item.Title">
      </li>
    </ul>
    <div class="box service" v-if="false">
      <div class="box-head">
        <p>
          市场焦点
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
        <p>
          附近商家
          <span>Nearby merchants</span>
        </p>
      </div>
      <div class="box-body">
        <div class="nearby-location">
          <p @click="openLocation">我的定位:
            <span>{{CurrentLocation.LocationAddress}}</span>
          </p>
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
                    </div>
                    <div class="shop-item-info">
                      <p class="shop-item-info-name">
                        {{item.sName}}
                        <span class="shop-item-info-distance">{{item.Distance}}米</span>
                      </p>
                      <p class="shop-item-info-score">店铺综合评分：
                        <span class>{{item.Score}}</span>
                      </p>
                      <p class="shop-item-info-maintype">主营：
                        <span class>{{item.MainTypeName}}</span>
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div :hidden="activeIndex != 1">
              <ul>
                <li v-for="(item,index) in ShopList" :key="index">
                  <div class="shop-item" @click="go({path:'/pages/shop/index',query:{sId:item.sId}})">
                    <div class="shop-item-logo">
                      <img :src="item.sLogo">
                    </div>
                    <div class="shop-item-info">
                      <p class="shop-item-info-name">
                        {{item.sName}}
                        <span class="shop-item-info-distance">{{item.Distance}}米</span>
                      </p>
                      <p class="shop-item-info-score">店铺综合评分：
                        <span class>{{item.Score}}</span>
                      </p>
                      <p class="shop-item-info-maintype">主营：
                        <span class>{{item.MainTypeName}}</span>
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div :hidden="activeIndex != 2">
              <ul>
                <li v-for="(item,index) in ShopList" :key="index">
                  <div class="shop-item" @click="go({path:'/pages/shop/index',query:{sId:item.sId}})">
                    <div class="shop-item-logo">
                      <img :src="item.sLogo">
                    </div>
                    <div class="shop-item-info">
                      <p class="shop-item-info-name">
                        {{item.sName}}
                        <span class="shop-item-info-distance">{{item.Distance}}米</span>
                      </p>
                      <p class="shop-item-info-score">店铺综合评分：
                        <span class>{{item.Score}}</span>
                      </p>
                      <p class="shop-item-info-maintype">主营：
                        <span class>{{item.MainTypeName}}</span>
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div :hidden="activeIndex != 3">
              <ul>
                <li v-for="(item,index) in ShopList" :key="index">
                  <div class="shop-item" @click="go({path:'/pages/shop/index',query:{sId:item.sId}})">
                    <div class="shop-item-logo">
                      <img :src="item.sLogo">
                    </div>
                    <div class="shop-item-info">
                      <p class="shop-item-info-name">
                        {{item.sName}}
                        <span class="shop-item-info-distance">{{item.Distance}}米</span>
                      </p>
                      <p class="shop-item-info-score">店铺综合评分：
                        <span class>{{item.Score}}</span>
                      </p>
                      <p class="shop-item-info-maintype">主营：
                        <span class>{{item.MainTypeName}}</span>
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";

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
      gcj02: {
        latitude: 0,
        longitude: 0
      },
      latitude: 0,
      longitude: 0,
      LocationAddress: "",
      ShopList: [],
      Tabs: [
        {
          name: "综合",
          index: 0,
          parm: {
            PageIndex: 1,
            PageSize: 20,
            OrderType: "DEFAULT",
            hasPage: true
          },
          checked: true
        },
        {
          name: "人气",
          index: 1,
          parm: { PageIndex: 1, PageSize: 20, OrderType: "HOT", hasPage: true },
          checked: true
        },
        {
          name: "销量",
          index: 2,
          parm: {
            PageIndex: 1,
            PageSize: 20,
            OrderType: "SALE",
            hasPage: true
          },
          checked: true
        },
        {
          name: "距离",
          index: 3,
          parm: {
            PageIndex: 1,
            PageSize: 20,
            OrderType: "DISTANCE",
            hasPage: true
          },
          checked: true
        }
      ],
      activeIndex: 0
    };
  },
  computed: {
    navbarSliderClass() {
      return "navbar_slider_" + this.activeIndex;
    },
    ...mapState({
      CurrentLocation: state => state.User.CurrentLocation
    })
  },
  methods: {
    openLocation() {
      var that = this;
      wx.openLocation({
        latitude: that.gcj02.latitude,
        longitude: that.gcj02.longitude,
        scale: 28
      });
    },
    async marketGet() {
      var rep = await this.$ShoppingAPI.Market_Get();
      if (rep.ret == 0) {
        this.Market = rep.data;
      }
    },
    async tabClick(tab, e) {
      if (e) {
        //切换tab动作赋值
        let _tab = this.Tabs[this.activeIndex];
        _tab.parm.PageIndex = 1;
        _tab.parm.hasPage = true;
        this.activeIndex = e.currentTarget.id;
      }

      //填充查询条件
      var param = {
        PageIndex: tab.parm.PageIndex,
        PageSize: tab.parm.PageSize,
        OrderType: tab.parm.OrderType
      };
      //赋值用户当前定位
      if (
        this.CurrentLocation &&
        this.CurrentLocation.longitude &&
        this.CurrentLocation.latitude
      ) {
        param.Lon = this.CurrentLocation.longitude;
        param.Lat = this.CurrentLocation.latitude;
      }

      //获取满足条件的店铺
      var rep = await this.$ShoppingAPI.Shop_Get(param);
      if (rep.ret == 0) {
        this.ShopList = rep.data;
      }
    },
    ...mapMutations([
      "UpdateLocation" //`this.$store.commit('UpdateLocation')`
    ])
  },
  onPullDownRefresh() {
    // console.log("page index onPullDownRefresh", this);
    this.activeIndex = 0;
    this.marketGet();
    this.Tabs[0].parm.PageIndex = 1;
    this.Tabs[0].parm.hasPage = true;
    this.tabClick(this.Tabs[0]);
    wx.stopPullDownRefresh();
  },
  async onReachBottom() {
    var that = this;
    var tab = this.Tabs.find(item => {
      return item.index == that.activeIndex;
    });
    if (tab.parm.hasPage) {
      tab.parm.PageIndex++;
      var param = {
        PageIndex: tab.parm.PageIndex,
        PageSize: tab.parm.PageSize,
        OrderType: tab.parm.OrderType
      };
      if (this.CurrentLocation.longitude && this.CurrentLocation.latitude) {
        (param.Lon = this.CurrentLocation.longitude),
          (param.Lat = this.CurrentLocation.latitude);
      }
      var rep = await this.$ShoppingAPI.Shop_Get(param);
      if (rep.ret == 0) {
        if (rep.data && rep.data.length) {
          for (let index = 0; index < rep.data.length; index++) {
            const element = rep.data[index];

            that.ShopList.push(element);
          }
        } else {
          tab.parm.hasPage = false;
        }
      }
    }
  },
  created() {
    // console.log("page index created", this);
  },
  onLoad() {
    // console.log("page index onLoad", this);
  },
  onReady() {
    // console.log("page index onReady", this);
  },
  onShow() {

  },
  mounted() {

    var that = this;
    that.marketGet();
    // wx.authorize({scope: "scope.userLocation"});
    if (this.isMP) {
      wx.getLocation({
        type: "gcj02",
        success(res) {
          that.gcj02.latitude = res.latitude;
          that.gcj02.longitude = res.longitude;
          that.$ShoppingAPI
            .baidu_geocoder({ location: `${res.latitude},${res.longitude}` })
            .then(rep2 => {
              if (rep2.status == 0) {
                // that.LocationAddress = rep2.result.formatted_address;
                // that.latitude = rep2.result.location.lat;
                // that.longitude = rep2.result.location.lng;

                that.UpdateLocation({
                  LocationAddress: rep2.result.formatted_address,
                  latitude: rep2.result.location.lat,
                  longitude: rep2.result.location.lng
                });
                that.tabClick(that.Tabs[0]);
              }
            });
        },
        fail() {},
        complete() {}
      });
    } else {
      that.tabClick(that.Tabs[0]);
    }
  },
  onUnload() {
    // console.log("onUnload", this);
  },
  onHide() {
  }
};
</script>
<style  lang="less">
.page {
  background: #ecf0f1;
  padding-top: 42px;
}
.search {
  background-color: #12b7f5;
  width: 100%;
  height: 42px;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    border: solid 1px #d0f1fd;
    border-radius: 0.5rem;
    color: #d0f1fd;
    margin: 0 10%;
    i,
    span {
      font-size: 14px;
    }
  }
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
      font-size: 0.4rem;
      span {
        padding-left: 10px;
        color: #7f8699;
        font-size: 0.35rem;
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
  font-size: 0.4rem;
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
  // background-color: #298de5;
  height: 40px;
  line-height: 40px;
  width: 100%;
  border-bottom: 1px solid #ccc;
  position: relative;
  font-size: 0.41rem;
}

.navbar_item {
  // position: relative;
  // display: block;
  // -webkit-box-flex: 1;
  // -webkit-flex: 1;
  // flex: 1;
  // padding: 13px 0;
  // font-size: 0;
  text-align: center;
  display: inline-block;
  width: 25%;
}

.navbar_item_on {
  color: #12b7f5;
  //  border-bottom: 2px solid #12b7f5;
}

.navbar_title {
  font-weight: 500;
  display: inline-block;
  // color: white;
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
.nearby {
  .nearby-location {
    font-size: 0.4rem;
    color: #6b6b6b;
    border-bottom: 1px solid @borderColor;
    padding: 10px;
    .icon,
    p {
      display: inline;
    }
  }
  .nearby-merchants {
    .nearby-merchants-list {
      margin-top: 10px;
      margin: 10px;
      .shop-item {
        position: relative;
        margin-top: 10px;
        .shop-item-logo {
          // width: 25%;
          img {
            // width: 100%;
            // height: 100%;
            width: 2.3rem;
            height: 2.3rem;
            border-radius: 10%;
            border: 1px solid #d7d7d7;
          }
        }
        .shop-item-info-distance {
          position: absolute;
          right: 0;
          color: #5c5c5c;
        }
        .shop-item-info {
          padding-left: 8px;
          width: 66%;

          .shop-item-info-name {
            font-size: 16px;
            color: #021218;
            margin-bottom: 10px;
            width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .shop-item-info-score {
            color: #5c5c5c;
            margin-bottom: 10px;
            span {
              color: #ff5252;
            }
          }
          .shop-item-info-maintype {
            color: #a2a2a2;
          }
          .shop-item-info-score,
          .shop-item-info-maintype {
            font-size: 14px;
          }
        }
        .shop-item-logo,
        .shop-item-info {
          display: inline-block;
          vertical-align: top;
          // height: 80px;
        }
      }
    }
  }
}
</style>

