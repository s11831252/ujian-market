<!--
 * @Author: SuChonghua
 * @Date: 2021-09-18 18:20:32
 * @LastEditTime: 2021-12-13 16:24:38
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\home.vue
-->
<template>
  <div class="root">
    <div class="head">
      <div class="position">
        <i class="icon">&#xe64d;</i>
        <span>{{currentLocation.city}}行业市场</span>
      </div>
      <div class="menu">
        <i class="icon" @click="go({ path: '/pages/supply-demand/manage' })">&#xe66c;</i>
        <i class="icon">&#xe6f1;</i>
      </div>
    </div>
    <button class="post" @click="go({ path: '/pages/supply-demand/release' })">发布供求</button>
    <div class="demand-box">
      <div class="demand-head">
        <span class="title">市场需求 ({{demandCount>99?demandCount+'+':demandCount}})</span>
        <span class="all">全部<i class="icon">&#xe601;</i></span>
      </div>
      <ul class="demand-list" v-if="demandList&&demandList.length>0">
        <homeItem v-for="(item,index) in demandList" :key="index" :item="item"></homeItem>
      </ul>
      <div class="demand-list" v-else>
        <img src="../../../static/img/sdhome404.png">
        <h1>暂无需求信息</h1>
      </div>
    </div>
    <ul class="banner">
      <li v-for="(item,index) in BannerList" :key="index">
        <img :src="item.imageUrl" />
        <span class="title">{{item.title}}</span>
      </li>
    </ul>
    <div class="demand-box">
      <div class="demand-head">
        <span class="title">今日供应 ({{supplyCount>99?supplyCount+'+':supplyCount}})</span>
        <span class="all">全部<i class="icon">&#xe601;</i></span>
      </div>
      <ul class="demand-list" v-if="supplyList&&supplyList.length>0">
        <homeItem v-for="(item,index) in supplyList" :key="index" :item="item"></homeItem>
      </ul>
      <div class="demand-list" v-else>
        <img src="../../../static/img/sdhome404.png">
        <h1>暂无需求信息</h1>
      </div>
    </div>
    <div class="recommend-box">
      <div class="title">好店推荐</div>
      <ul class="recommend-list">
        <li v-for="(item,index) in ShopList" :key="index" @click="go({path:'/pages/shop/index',query:{sId:item.sId}})">
          <div class="logo"><img :src="item.sLogo" /></div>
          <div class="info">
            <span class="name">{{item.sName}}</span>
            <span class="maintype">
              <span class="label">主营：</span>
              <span>{{item.mainTypeName}}</span>
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState,mapMutations } from "vuex";
import homeItem from './home-item.vue'
export default {
  components:{
    homeItem
  },
  data(){
    return {
      supplyList:[],
      supplyCount:0,
      demandList:[],
      demandCount:0,
      BannerList:[],
      ShopList:[]
    }
  },
  methods:{
    getLocation(){
      var that = this;
      if (this.isMP) {
        wx.getLocation({
          type: "gcj02",
          success(res) {
            console.log(res)
            that.$ShoppingAPI.baidu_geocoder({ location: `${res.latitude},${res.longitude}` }).then(rep2 => {
              if (rep2.status == 0) {
                // that.LocationAddress = rep2.result.formatted_address;
                // that.latitude = rep2.result.location.lat;
                // that.longitude = rep2.result.location.lng;
                that.UpdateLocation({
                  country:rep2.result.addressComponent.country,
                  province:rep2.result.addressComponent.province,
                  city:rep2.result.addressComponent.city,
                  district:rep2.result.addressComponent.district,
                  LocationAddress: rep2.result.formatted_address,
                  latitude: rep2.result.location.lat,
                  longitude: rep2.result.location.lng
                });
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
              myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), data => {
                if (data.addressComponents) {
                  const result = data.addressComponents;
                  const location = {
                    creditLongitude: r.point.lat, // 经度
                    creditLatitude: r.point.lng, // 纬度
                    creditProvince: result.province || "", // 省
                    creditCity: result.city || "", // 市
                    creditArea: result.district || "", // 区
                    creditStreet: (result.street || "") + (result.streetNumber || "") // 街道
                  };
                  // console.log(location);
                  that.UpdateLocation({
                    country:"",
                    province:location.creditProvince,
                    city:creditCity.creditCity,
                    district:location.creditArea,
                    LocationAddress: location.creditProvince + location.creditCity + location.creditArea + location.creditStreet,
                    latitude: location.creditLongitude,
                    longitude: location.creditLatitude
                  });
                }
              });
            }
          });
        });
      }
    },
    ...mapMutations([
      "UpdateLocation", //`this.$store.commit('UpdateLocation')`
    ])
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.User.UserInfo,
      currentLocation: (state) => state.User.CurrentLocation,
    }),
  },
  async mounted() {
    this.getLocation();
    var rep = await this.$SupplyAndDemandAPI.SupplyAndDemand_GetList({
      lng: this.currentLocation.longitude,
      lat: this.currentLocation.latitude,
      pageIndex: 1,
      pageSize: 5,
      type: 2,
      isSelf: 0,
      status: 1,
    });
    if (rep.ret == 0) {
      this.demandList=rep.data;
      this.demandCount= rep.count;
    }
    var rep = await this.$SupplyAndDemandAPI.SupplyAndDemand_GetList({
      lng: this.currentLocation.longitude,
      lat: this.currentLocation.latitude,
      pageIndex: 1,
      pageSize: 5,
      type: 1,
      isSelf: 0,
      status: 1,
    });
    if (rep.ret == 0) {
      this.supplyList=rep.data;
      this.supplyCount= rep.count;
    }
    var rep = await this.$SupplyAndDemandAPI.Home_GetBanner();
    if(rep.ret==0)
    {
      this.BannerList=rep.data;
    }
    var rep = await this.$SupplyAndDemandAPI.Home_GetShop();
    if(rep.ret==0)
    {
      this.ShopList=rep.data;
    }
  },
};
</script>
<style lang="scss" scoped>
.root {
  text-align: center;
  background-color: #edf0f5;
  padding-bottom: 0.5rem;
  .head {
    background-color: #12b7f5;
    height: 1.16rem;
    display: flex;
    align-items: center;
    padding-left: 1.07rem;
    font-size: 0.43rem;
    color: #fff;
    .position {
      width: 85%;
      display: flex;
      align-items: center;
      i {
        margin-right: 0.15rem;
      }
    }
    .menu {
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        margin-right: 0.43rem;
      }
    }
  }
  button.post {
    margin: 0.38rem 0.35rem;
    color: #ffffff;
    background-color: #12b7f5;
    font-size: 0.5rem;
    padding: 0.52rem 0;
    text-align: center;
    border-radius: 0.2rem;
    line-height: 0.7rem;
    letter-spacing: 0.03rem;
  }
  .demand-box {
    background-color: #fff;
    margin: 0 0.32rem;
    padding: 0.55rem 0.45rem 0 0.45rem;
    border-radius: 0.2rem;
    .demand-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.37rem;
      border-bottom: 0.02rem solid #f2f2f2;
      span {
        display: flex;
        align-items: center;
        color: #333333;
        font-size: 0.4rem;
      }
      span.all {
        font-size: 0.38rem;
        line-height: 0.4rem;
        color: #999999;
      }
    }
    // .demand-list {
    //   li {
    //     display: flex;
    //     align-items: center;
    //     padding: 0.45rem 0;
    //     border-bottom: 0.02rem solid #f2f2f2;
    //     span {
    //       flex-grow: 1;
    //       flex-shrink: 0;
    //     }
    //     .time {
    //       width: 1.08rem;
    //       height: 0.47rem;
    //       line-height: 0.47rem;
    //       background-color: #f3f8fe;
    //       color: #75aefb;
    //       border-radius: 0.06rem;
    //       margin-right: 0.28rem;
    //       font-size: 0.29rem;
    //     }
    //     .type {
    //       width: 0.42rem;
    //       height: 0.42rem;
    //       font-size: 0.29rem;
    //       border-radius: 0.07rem;
    //       margin-right: 0.12rem;
    //       display: flex;
    //       justify-content: center;
    //       align-items: center;
    //       color: #fff;
    //     }
    //     .type.e {
    //       background-image: linear-gradient(86deg, #fe475d 0%, #ff6f88 100%);
    //     }
    //     .type.p {
    //       background-image: linear-gradient(85deg, #138df5 0%, #13b6f5 100%);
    //     }
    //     .type.s {
    //       background-image: linear-gradient(85deg, #fe7b20 0%, #ff9f29 100%);
    //     }
    //     .type.g {
    //       background-image: linear-gradient(85deg, #09cc6c 0%, #22dd7a 100%);
    //     }
    //     .title {
    //       overflow: hidden;
    //       text-overflow: ellipsis;
    //       white-space: nowrap;
    //       flex-shrink: 1;
    //       font-size: 0.43rem;
    //       color: #4d4d4d;
    //     }
    //   }
    // }
    div.demand-list{
        text-align: center;
        img{
          width: 5.11rem;
          height: 2.77rem;
          margin: 0.98rem 0 0.72rem 0;
        }
        h1{
          font-size: 0.43rem;
          color: #4d4d4d;
          padding-bottom: 1.7rem;
        }
    }
  }
  .banner {
    display: flex;
    justify-content: space-around;
    margin: 0.26rem 0.26rem;
    padding: 0.35rem 0.35rem 0.49rem 0;
    background-color: #fff;
    color: #333333;
    border-radius: 0.26rem;
    li {
      text-align: center;
      width: 2.98rem;
      margin-left: 0.35rem;
      img {
        width: 2.98rem;
        height: 1.72rem;
        margin-bottom: 0.31rem;
      }
      span {
        display: block;
        font-size: 0.3rem;
        line-height: 0.47rem;
      }
    }
  }
  .recommend-box {
    padding: 0.38rem 0.34rem;
    margin: 0.29rem 0.29rem;
    background-color: #ffffff;
    border-radius: 0.26rem;
    .title {
      text-align: left;
      margin-left: 0.1rem;
      font-size: 0.4rem;
      color: #333333;
      margin-bottom: 0.33rem;
    }
    .recommend-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      li {
        display: flex;
        align-items: center;
        background-color: #f3fcff;
        border-radius: 0.26rem;
        margin-bottom: 0.18rem;
        padding: 0.13rem 0.2rem 0.13rem 0.15rem;
        .logo {
          margin-right: 0.14rem;
          img {
            width: 1.05rem;
            height: 1.05rem;
            border-radius: 0.13rem;
          }
        }
        .info {
          .name {
            width: 3.2rem;
            text-align: left;
            display: block;
            color: #343434;
            font-size: 0.33rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .maintype {
            text-align: left;
            display: block;
            font-size: 0.28rem;
            color: #1abaf5;
            .label {
              color: #999999;
            }
          }
        }
      }
    }
  }
}
</style>