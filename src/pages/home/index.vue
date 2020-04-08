<template>
  <div class="page">
    <div class="search">
      <div @click="go({path:'/pages/home/search'})">
        <i class="icon">&#xe6e3;</i>&nbsp;
        <span>搜索</span>
      </div>
    </div>
    <swiper v-if="isMP&&Config.showBuy" class="swiper" indicator-dots="true" autoplay="true" interval="5000" duration="1000">
      <block v-for="(item, index) in Market.Banners" :index="index" :key="index">
        <swiper-item>
          <img :src="item.ImageUrl" class="slide-image" mode="aspectFill">
        </swiper-item>
      </block>
    </swiper>
    <swiper v-else-if="Config.showBuy" ref="mySwiper" :options="swiperOption">
      <swiper-slide v-for="(item, index) in Market.Banners" :index="index" :key="index">
        <img :src="item.ImageUrl" class="slide-image">
      </swiper-slide>
      <!-- Optional controls -->
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
    <div class="news box">
      <p v-text="Market.News.title"></p>
    </div>
    <ul class="box category">
      <li
        v-for="(item,index) in Market.Category"
        :key="index"
        @click="go({path:'/pages/home/subject', query:{title:item.ActionParameter.WebApp.Parameter.title,MainType:item.ActionParameter.WebApp.Parameter.MainType}})"
      >
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
          <p @click="openLocation">
            我的定位:
            <span>{{CurrentLocation.LocationAddress}}</span>
          </p>
          <span class="icon">&#xe65e;</span>
          <span class="icon Right">&#xe601;</span>
        </div>
        <div class="nearby-merchants">
          <ul class="navbar">
            <li v-for="(item,index) in Tabs" :key="index" :id="index" :class="{'navbar_item_on':activeIndex == index}" class="navbar_item" @click="tabClick(item,$event)">
              <div class="navbar_title">{{item.name}}</div>
            </li>
          </ul>
          <div class="navbar_slider" :class="navbarSliderClass"></div>
          <div class="nearby-merchants-list">
            <div>
              <ul>
                <li v-for="(item,index) in ShopList" :key="index">
                  <div class="shop-item" @click="go({path:'/pages/shop/index',query:{sId:item.sId}})">
                    <div class="shop-item-logo">
                      <img :src="item.sLogo">
                    </div>
                    <div class="shop-item-info">
                      <p class="shop-item-info-name">
                        {{item.sName}}
                        <span class="shop-item-info-distance">{{item.Distance}}</span>
                      </p>
                      <p class="shop-item-info-score">
                        店铺综合评分：
                        <span class>{{item.Score}}</span>
                      </p>
                      <p class="shop-item-info-maintype">
                        主营：
                        <span class>{{item.MainTypeName}}</span>
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <!-- <div :hidden="activeIndex != 1">
              <ul>
                <li v-for="(item,index) in ShopList" :key="index">
                  <div class="shop-item" @click="go({path:'/pages/shop/index',query:{sId:item.sId}})">
                    <div class="shop-item-logo">
                      <img :src="item.sLogo">
                    </div>
                    <div class="shop-item-info">
                      <p class="shop-item-info-name">
                        {{item.sName}}
                        <span v-if="item.Distance<1000" class="shop-item-info-distance">{{item.Distance}}m</span>
                        <span v-if="item.Distance>=1000" class="shop-item-info-distance">{{item.Distance/1000}}km</span>
                      </p>
                      <p class="shop-item-info-score">
                        店铺综合评分：
                        <span class>{{item.Score}}</span>
                      </p>
                      <p class="shop-item-info-maintype">
                        主营：
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
                        <span v-if="item.Distance<1000" class="shop-item-info-distance">{{item.Distance}}m</span>
                        <span v-if="item.Distance>=1000" class="shop-item-info-distance">{{item.Distance/1000}}km</span>
                      </p>
                      <p class="shop-item-info-score">
                        店铺综合评分：
                        <span class>{{item.Score}}</span>
                      </p>
                      <p class="shop-item-info-maintype">
                        主营：
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
                        <span v-if="item.Distance<1000" class="shop-item-info-distance">{{item.Distance}}m</span>
                        <span v-if="item.Distance>=1000" class="shop-item-info-distance">{{item.Distance/1000}}km</span>
                      </p>
                      <p class="shop-item-info-score">
                        店铺综合评分：
                        <span class>{{item.Score}}</span>
                      </p>
                      <p class="shop-item-info-maintype">
                        主营：
                        <span class>{{item.MainTypeName}}</span>
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div> -->
          </div>
          <!-- <div class="box_bottom">DUANG~已经到底了哦</div> -->
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
      swiperOption: {
        pagination: {
          el: ".swiper-pagination"
        }
      },
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
      aa: [],
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
      CurrentLocation: state => state.User.CurrentLocation,
      Config: state => state.Global.Config     
    })
  },
  methods: {
    async unit(param) {
      var rep = await this.$ShoppingAPI.Shop_Get(param);
      if (rep.ret == 0) {
        if (rep.data && rep.data.length) {
          for (let index = 0; index < rep.data.length; index++) {
            const element = rep.data[index];
            // debugger;
            if (element.Distance >= 1000) {
              element.Distance = (element.Distance / 1000).toFixed(1) + "km";
            } else {
              element.Distance = element.Distance + "m";
            }
            rep.data[index] = element;
          }
        }
      }
      return rep;
    },

    openLocation() {
      var that = this;
      if (this.isMP) {
        wx.openLocation({
          latitude: that.gcj02.latitude,
          longitude: that.gcj02.longitude,
          scale: 28
        });
      }
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
      //this.ShopList = rep.data;
      //获取满足条件的店铺
      var rep = await this.unit(param);

      this.ShopList = rep.data;
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
      var rep = await this.unit(param);
      if (rep.data || rep.data.length) {
        this.ShopList.push.apply(this.ShopList, rep.data);
      } else {
        tab.parm.hasPage = false;
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
  onShow() {},
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
      var mapjs = require("../../utils/map").default;
      mapjs.init("yCCZ5HnYGnUoRQNfd0YkTHg8lluFGQRZ").then(Bmap => {
        // console.log(Bmap);
        var geolocation = new Bmap.Geolocation();
        geolocation.getCurrentPosition(function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            // if (r.accuracy != null) {
            //   that.toast("您已拒绝地理位置授权");
            //   //用户决绝地理位置授权
            //   return;
            // } else
            // {
            // }
            const myGeo = new BMap.Geocoder();
            myGeo.getLocation(
              new BMap.Point(r.point.lng, r.point.lat),
              data => {
                if (data.addressComponents) {
                  const result = data.addressComponents;
                  const location = {
                    creditLongitude: r.point.lat, // 经度
                    creditLatitude: r.point.lng, // 纬度
                    creditProvince: result.province || "", // 省
                    creditCity: result.city || "", // 市
                    creditArea: result.district || "", // 区
                    creditStreet:
                      (result.street || "") + (result.streetNumber || "") // 街道
                  };
                  // console.log(location);
                  that.UpdateLocation({
                    LocationAddress:
                      location.creditProvince +
                      location.creditCity +
                      location.creditArea +
                      location.creditStreet,
                    latitude: location.creditLongitude,
                    longitude: location.creditLatitude
                  });
                }
              }
            );
          }
        });
      });
      that.tabClick(that.Tabs[0]);
    }
  },
  onUnload() {
    // console.log("onUnload", this);
  },
  onHide() {}
};
</script>
<style  lang="less" scoped>
.page {
  background: #ecf0f1;
  padding-top: 1.27rem;
}
.search {
  background-color: #12b7f5;
  width: 100%;
  height: 1.27rem;
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
    height: 0.8rem;
    justify-content: center;
    flex: 1;
    border: solid 0.02rem #d0f1fd;
    border-radius: 0.5rem;
    color: #d0f1fd;
    margin: 0 10%;
    i,
    span {
      font-size: 0.4rem;
    }
  }
}
.swiper .slide-image {
  width: 100%;
  height: 100%;
}
.box {
  background: #fff;
  margin-bottom: 0.27rem;
  .box-head {
    background-color: #ffffff;
    padding: 0.35rem 0 0 0.27rem;
    // border-bottom: 0.01rem solid @borderColor;
    p {
      color: #12b7f5;
      font-size: 0.4rem;
      span {
        padding-left: 0.26rem;
        color: #7f8699;
        font-size: 0.35rem;
      }
    }
  }
}
.news {
  padding: 0.37rem;
  margin-top: 0.27rem;
}
.news p {
  border-left: 0.09rem solid #12b7f5;
  padding-left: 0.26rem;
  font-size: 0.4rem;
  border-radius: 0.04rem;
}
.category {
  margin: 0.3rem;
}
.category li {
  display: inline-block;
  text-align: center;
  width: 25%;
}
.category li img {
  width: 2.47rem;
  height: 2.47rem;
}
@borderColor: #ecf0f1;
.service {
  .Primary {
    border-bottom: 0.01rem solid @borderColor;
    li {
      display: inline-block;
      text-align: center;
      width: 49.5%;
      img {
        width: 100%;
        height: 3.35rem;
      }
    }
    li:nth-of-type(odd) {
      border-right: 0.01rem solid @borderColor;
    }
  }
  .Secondary li {
    display: inline-block;
    text-align: center;
    width: 25%;
    img {
      width: 100%;
      height: 3.24rem;
    }
  }
}

.navbar {
  height: 1.09rem;
  line-height: 1.09rem;
  width: 100%;
  border-bottom: 0.01rem solid #ccc;
  position: relative;
  font-size: 0.41rem;
}

.navbar_item {
  text-align: center;
  display: inline-block;
  width: 25%;
}

.navbar_item_on {
  color: #12b7f5;
}

.navbar_title {
  font-weight: 500;
  display: inline-block;
}

.navbar_slider {
  position: absolute;
  content: " ";
  left: 0;
  // bottom: 0;
  width: 25%;
  height: 0.02rem;
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
    display: flex;
    align-items: center;
    overflow: hidden;
    font-size: 0.4rem;
    color: #6b6b6b;
    border-bottom: 0.01rem solid @borderColor;
    padding: 0.32rem 0.33rem 0.34rem 0.28rem;
    .icon,
    p {
      display: inline;
    }
    .Right {
      font-size: 0.4rem;
      padding-left: 0.16rem;
    }
  }
  .nearby-merchants {
    .nearby-merchants-list {
      margin: 0rem 0.35rem 0rem 0.27rem;
      .shop-item {
        position: relative;
        padding-top: 0.46rem;
        padding-bottom: 0.46rem;
        border-bottom: 0.01rem solid #ecf0f1;
        font-size: 0;
        .shop-item-logo {
          // width: 25%;
          img {
            // width: 100%;
            // height: 100%;
            width: 2.3rem;
            height: 2.3rem;
            border-radius: 10%;
            border: 0.01rem solid #d7d7d7;
          }
        }
        .shop-item-info-distance {
          font-size: 0.36rem;
          position: absolute;
          right: 0;
          color: #5c5c5c;
        }
        .shop-item-info {
          padding-left: 0.33rem;
          width: 66%;

          .shop-item-info-name {
            font-size: 0.44rem;
            color: #021218;
            margin-bottom: 0.35rem;
            width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .shop-item-info-score {
            color: #5c5c5c;
            margin-bottom: 0.35rem;
            font-size: 0.36rem;
            span {
              color: #ff5252;
              font-size: 0.4rem;
            }
          }
          .shop-item-info-maintype {
            color: #a2a2a2;
          }
          .shop-item-info-maintype {
            font-size: 0.38rem;
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
  .box_bottom {
    height: 0.87rem;
    background-color: rgba(18, 183, 245, 0.03);
    font-size: 0.32rem;
    text-align: center;
    line-height: 0.87rem;
  }
}
</style>

