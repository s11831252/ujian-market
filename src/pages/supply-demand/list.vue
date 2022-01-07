<!--
 * @Author: SuChonghua
 * @Date: 2021-12-29 17:07:53
 * @LastEditTime: 2021-12-31 15:43:53
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\list.vue
-->
<template>
  <div class="root">
    <div class="head">
      <div class="position">
        <i class="icon">&#xe64d;</i>
        <span>{{ currentLocation.city }}行业市场</span>
      </div>
      <div class="menu">
        <i class="icon" @click="go({ path: '/pages/supply-demand/manage' })">&#xe66c;</i>
        <i class="icon">&#xe6f1;</i>
      </div>
    </div>
    <button class="post" @click="go({ path: '/pages/supply-demand/release' })">发布供求</button>
    <ul class="list">
        <li v-for="(item,index) in List" :key="index" @click="go({path:'/pages/supply-demand/detail',query:{listId:item.listId}})">
            <div class="title">
                <i v-if="item.listType == 1 || item.listType == 5" class="corp">企</i>
                <i v-else-if="item.listType == 2" class="pro">项</i>
                <i v-else-if="item.listType == 4" class="shop">商</i>
                <i v-else-if="item.listType == 3" class="personal">个</i>
                <span>{{item.title}}</span>
            </div>
            <div class="content">
                <div class="left">
                    <p class="txt">{{item.content}}</p>
                    <div class="other-info">
                      <span class="sendTime">发布与50分钟前</span>
                      <span class="address"><i class="icon">&#xe65e;</i>{{item.cityName}}</span>
                    </div>
                </div>
                <div class="logo">
                    <span class="type demand" v-if="item.listType==1||item.listType==2">需求</span>
                    <span class="type supply" v-else>供应</span>
                    <img :src="item.logoImage">
                </div>
            </div>
        </li>
    </ul>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  data(){
    return {
      List:[],
    }
  },
  methods:{
    // getLocation(){
    //   var that = this;
    //   if (this.isMP) {
    //     wx.getLocation({
    //       type: "gcj02",
    //       success(res) {
    //         that.$ShoppingAPI.baidu_geocoder({ location: `${res.latitude},${res.longitude}` }).then(rep2 => {
    //           if (rep2.status == 0) {
    //             // that.LocationAddress = rep2.result.formatted_address;
    //             // that.latitude = rep2.result.location.lat;
    //             // that.longitude = rep2.result.location.lng;
    //             that.UpdateLocation({
    //               country:rep2.result.addressComponent.country,
    //               province:rep2.result.addressComponent.province,
    //               city:rep2.result.addressComponent.city,
    //               district:rep2.result.addressComponent.district,
    //               LocationAddress: rep2.result.formatted_address,
    //               latitude: rep2.result.location.lat,
    //               longitude: rep2.result.location.lng
    //             });
    //             that.init();
    //           }
    //         });
    //       },
    //       fail() {

    //       },
    //       complete() {

    //       }
    //     });
    //   } else {
    //     var mapjs = require("../../utils/map").default;
    //     mapjs.init("yCCZ5HnYGnUoRQNfd0YkTHg8lluFGQRZ").then(Bmap => {
    //       var geolocation = new Bmap.Geolocation();
    //       geolocation.getCurrentPosition(function(r) {
    //         if (this.getStatus() == BMAP_STATUS_SUCCESS) {
    //           // if (r.accuracy != null) {
    //           //   that.toast("您已拒绝地理位置授权");
    //           //   //用户决绝地理位置授权
    //           //   return;
    //           // } else
    //           // {
    //           // }
    //           const myGeo = new BMap.Geocoder();
    //           myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), data => {
    //             if (data.addressComponents) {
    //               const result = data.addressComponents;
    //               const location = {
    //                 creditLongitude: r.point.lat, // 经度
    //                 creditLatitude: r.point.lng, // 纬度
    //                 creditProvince: result.province || "", // 省
    //                 creditCity: result.city || "", // 市
    //                 creditArea: result.district || "", // 区
    //                 creditStreet: (result.street || "") + (result.streetNumber || "") // 街道
    //               };
    //               // console.log(location);
    //               that.UpdateLocation({
    //                 country:"",
    //                 province:location.creditProvince,
    //                 city:creditCity.creditCity,
    //                 district:location.creditArea,
    //                 LocationAddress: location.creditProvince + location.creditCity + location.creditArea + location.creditStreet,
    //                 latitude: location.creditLongitude,
    //                 longitude: location.creditLatitude
    //               });
    //               that.init();
    //             }
    //           });
    //         }
    //       });
    //     });
    //   }
    // },
    init(){
      var that = this;
      if(this.$route.query.type=="supply")
      {
        wx.setNavigationBarTitle({ title: `今日供应` });

        this.$SupplyAndDemandAPI.SupplyAndDemand_GetList({
          lng: this.currentLocation.longitude,
          lat: this.currentLocation.latitude,
          pageIndex: 1,
          pageSize: 5,
          type: 1,
          isSelf: 0,
          status: 1,
        }).then(rep=>{
          if (rep.ret == 0) {
            this.List=rep.data;
            this.Count= rep.count;
          }
        });
      }else if(this.$route.query.type=="demand")
      {
        wx.setNavigationBarTitle({ title: `今日需求` });
        this.$SupplyAndDemandAPI.SupplyAndDemand_GetList({
          lng: this.currentLocation.longitude,
          lat: this.currentLocation.latitude,
          pageIndex: 1,
          pageSize: 5,
          type: 2,
          isSelf: 0,
          status: 1,
        }).then(rep=>{
          if (rep.ret == 0) {
            this.List=rep.data;
            this.Count= rep.count;
          }
        });
      }
    },
    // ...mapMutations([
    //   "UpdateLocation", //`this.$store.commit('UpdateLocation')`
    // ])
  },
  computed: {

    ...mapState({
      userInfo: (state) => state.User.UserInfo,
      currentLocation: (state) => state.User.CurrentLocation,
    }),
  },
  async mounted() {
    let that = this;
    this.init();
    // this.extraDataHandler();
    // this.wx_login(async () => {
    //   that.getLocation();
    // })
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
  .list{
    margin: 0 0.31rem;
      li{
        background-color: #fff;
        padding: 0.52rem 0.41rem;
        border-radius: 0.2rem;
        margin-top: 0.29rem;
          .title{
            display: flex;
            align-items: center;
            span {
                font-weight: bold;
                color: #333333;
                font-size: 0.44rem;
                flex-grow:1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                text-align: left;
            }
            i{
              margin-right: 0.09rem;
              font-size: 0.27rem;
              color: #fff;
              flex-shrink:0;
              width: 0.42rem;
              height: 0.42rem;
              line-height: 0.42rem;
            }
            i.corp {
                box-shadow: 0rem 0.01rem 0.01rem 0rem rgba(204, 35, 55, 0.59);
                background-image: linear-gradient(86deg, #fe475d 0%, #ff6f88 100%);
            }
            i.pro {
                background-image: linear-gradient(85deg, #138df5 0%, #13b6f5 100%);
            }
            i.shop {
                background-image: linear-gradient(85deg, #fe7a1f 0%, #ffa22b 100%);
            }
            i.personal {
                background-image: linear-gradient(85deg, #02c869 0%, #27e07c 100%);
            }
          }
          .content{
            display: flex;
            align-items: center;
            .left{
              margin-right: 0.53rem;
              .txt{
                font-size: 0.42rem;
                // line-height: 0.6rem;
                letter-spacing: 0rem;
                color: #1a1a1a;
                margin-bottom: 0.36rem;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                text-align: left;
              }
              .other-info{
                display: flex;
                align-items: center;
                justify-content: space-between;
                .sendTime{
                  background-color: #fee0e0;
                  border-radius: 0.1rem;
                  height: 0.58rem;
                  line-height: 0.58rem;
                  font-size: 0.35rem;
                  color: #ec362b;
                  text-align: center;
                  padding: 0 0.3rem;
                }
                .address{
                    font-size: 0.4rem;
                    line-height: 0.54rem;
                    color: #888888;
                    display: flex;
                    align-items: center;
                  .icon{
                    color: #08bb91;
                    margin-right: 0.13rem;
                  }
                }

              }
            }
            .logo{
              width: 2.08rem;
              height: 2.08rem;
              position: relative;
              img{
                width: 2.08rem;
                height: 2.08rem;
              }
              .type{
                position: absolute;
                top: -0.09rem;
                right: -0.09rem;
                border-radius: 0.09rem 0.09rem 0 0.09rem;
                width: 0.82rem;
                height: 0.42rem;
                line-height: 0.42rem;
                color: #fff;
                text-align: center;
                font-size: 0.28rem;
                border-radius: 0.12rem 0.12rem 0rem 0.12rem;
              }
                .type.supply{
                  background-image: linear-gradient(-31deg, #4d77ff 0%, #4da9ff 100%);
                }
                .type.demand{
                  background-image: linear-gradient(-31deg,#ff7f4d 0%,#ffa54d 100%);
                }
            }
          }
      }
  }
}
</style>