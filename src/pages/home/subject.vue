<template>
  <!--index-->
  <div class="index">
    <!--banner-->
    <div class="banner">
      <img src="/static/img/banner.png" alt>
    </div>
    <!--main-->
    <div class="main">
      <!--当前位置-->
      <div class="dqwz">
        <span class="border"></span>
        <p>当前位置：{{CurrentLocation.LocationAddress}}</p>
        <div class="tu1 icon">
          <div class="icon">&#xe65e;</div>
        </div>
        <div class="tu2">
          <div class="icon">&#xe601;</div>
        </div>
      </div>
      <!--推荐店铺-->
      <div class="tjdp">
        <img src="/static/img/tjdp_nav.png" alt>
        <ul>
          <li v-for="(item,index) in RecommendList" :key="index" @click="go({path:'/pages/shop/index',query:{sId:item.sId}})">
            <img :src="item.sLogo" alt>
            <p class="bt">{{item.sName}}</p>
            <p class="ft">店铺评分 :
              <span>{{item.Score}}</span>
            </p>
            <p class="ft2">{{item.Brief}}</p>
          </li>
        </ul>
      </div>
      <!--附近商家-->
      <div class="fjsj">
        <img src="/static/img/fjsj.png" alt>
        <div v-for="(item,index) in NearbyList" :key="index" @click="go({path:'/pages/shop/index',query:{sId:item.sId}})">
          <div class="nr">
            <div class="f1">
              <img :src="item.sLogo" alt>
            </div>
            <div class="f2">
              <div class="bt">
                <p>{{item.sName}}</p>
              </div>
              <p>
                店铺总综合评分：
                <span>{{item.Score}}</span>
              </p>
              <p>
                  <span class="label">{{item.MainTypeName}}</span>
              </p>
            </div>
            <div class="f3">{{item.Distance}}米</div>
          </div>
          <div class="bor">
            <ul>
              <li v-for="(item2,index2) in item.Goods_list" :key="index2" v-if="index2<3" @click.stop="go({path:'/pages/shop/detail',query:{sId:item.sId,gId:item2.gId}})">
                  <img v-if="item2.Images.length>0" :src="item2.Images[0].Thumbnail_url" alt>
                  <img v-else src="">
                  <p>{{item2.gName}}</p>
                  <p>
                    <span>￥{{item2.Price}}</span>
                  </p>
              </li>
            </ul>
          </div>
          <div class="fgx"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      title: "",
      MainType: "",
      RecommendList: [],
      NearbyList: []
    };
  },
  computed: {
    ...mapState({
      CurrentLocation: state => state.User.CurrentLocation
    })
  },
  onLoad(query) {
    // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    if (query.scene) this.MainType = decodeURIComponent(query.scene);
    wx.setNavigationBarTitle({ title: this.$route.query.title });
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  async mounted() {
    if (this.$route.query.title && this.$route.query.MainType) {
      this.title = this.$route.query.title;
      this.MainType = this.$route.query.MainType;
      var rep = await this.$ShoppingAPI.Shop_Get({
        PageIndex: 1,
        PageSize: 3,
        MainType: this.MainType
      });
      if (rep.ret == 0) {
        this.RecommendList = rep.data;
      }
      var rep2 = await this.$ShoppingAPI.Shop_Get({
        OrderType: "DISTANCE",
        PageIndex: 1,
        PageSize: 20,
        MainType: this.MainType,
        Lon: this.CurrentLocation.longitude,
        Lat: this.CurrentLocation.latitude
      });
      if (rep2.ret == 0) {
        this.NearbyList = rep2.data;
        
        for (let index = 0; index < this.NearbyList.length; index++) {
          const element = this.NearbyList [index];
          var rep3 = await this.$ShoppingAPI.Goods_GetByShop({sId:element.sId});
          if(rep3.ret==0)
          {
            element.Goods_list=rep3.data;
          }
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.index {
  width: 10.8rem;
  display: flex;
  flex-direction: column;
}

.banner {
  height: 4.5rem;
}

.banner img {
  height: 4.5rem;
  width: 10.8rem;
}

/*主体内容*/
.main {
  width: 10.8rem;
  flex: 1 0 auto;
  background-color: #eeeeee;
}

/*当前位置*/
.main .dqwz {
  width: 10.8rem;
  height: 1.15rem;
  background-color: #ffffff;
  margin-top: 0.21rem;
  display: flex;
}

.main .dqwz .border {
  width: 0.09rem;
  height: 0.47rem;
  margin: 0.34rem 0.19rem 0.34rem 0.27rem;
  flex: 0 0 auto;
  background-color: #12b7f5;
}

.main .dqwz p {
  font-family: MicrosoftYaHei;
  color: #3f3f3f;
  font-size: 0.4rem;
  width: 8.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  float: left;
  line-height: 1.15rem;
}

.main .dqwz .tu1 {
  flex: 0 0 auto;
  float: right;
}

.main .dqwz .tu1 .icon {
  width: 0.37rem;
  height: 0.48rem;
  font-size: 0.5rem;
  line-height: 1.15rem;
}

.main .dqwz .tu2 {
  flex: 0 0 auto;
  float: right;
}

.main .dqwz .tu2 .icon {
  width: 0.15rem;
  height: 0.29rem;
  font-size: 0.7rem;
  line-height: 1.15rem;
}

/*推荐店铺*/
.main .tjdp {
  width: 10.8rem;
  background-color: #ffffff;
  margin-top: 0.3rem;
  padding-bottom: 0.46rem;
}

.main .tjdp ul {
  width: 10.59rem;
  margin-top: 0.45rem;
  display: flex;
}

.main .tjdp > img {
  width: 10.23rem;
  height: 0.83rem;
  margin-top: 0.25rem;
  margin-left: 0.28rem;
}

.main .tjdp ul li {
  flex: 1;
  text-align: center;
  padding-left: 0.15rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.main .tjdp ul li img {
  width: 3.17rem;
  height: 3.17rem;
  margin-bottom: 0.22rem;
}

.main .tjdp ul li .bt {
  flex: 1;
  color: #353535;
  margin-bottom: 0.22rem;
  font-size: 0.4rem;
  line-height: 13px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.main .tjdp ul li .ft {
  color: #9b9b9b;
  font-size: 0.32rem;
  text-align: left;
  margin-bottom: 0.22rem;
}

.main .tjdp ul li .ft span {
  color: #ff5252;
  font-size: 0.32rem;
}

.main .tjdp ul li .ft2 {
  flex: 1;
  color: #363636;
  text-align: left;
  font-size: 0.28rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/*附近商家*/
.main .fjsj {
  width: 10.8rem;
  margin-top: 0.27rem;
  background-color: #ffffff;
}

.main .fjsj img {
  width: 10.23rem;
  height: 0.88rem;
  margin-top: 0.25rem;
  margin-left: 0.29rem;
}

.main .fjsj .nr {
  width: 10.8rem;
  display: flex;
  margin-top: 0.3rem;
}

.main .fjsj .nr .f1 {
  flex: 0 0 auto;
  margin-top: 0;
}

.main .fjsj .nr .f1 img {
  width: 1.59rem;
  height: 1.59rem;
}

.main .fjsj .nr .f2 {
  flex: 1 0 auto;
  margin-left: 0.42rem;
  margin-top: 0.1rem;
  display: flex;
  flex-direction: column;
}

.main .fjsj .nr .f2 .bt {
  float: left;
  justify-content: space-between;
}

.main .fjsj .nr .f2 .bt p {
  color: #021218;
  font-size: 0.44rem;
}

.main .fjsj .nr .f2 p {
  color: #9b9b9b;
  font-size: 0.3rem;
  margin-top: 0.08rem;
  justify-content: space-between;
}

.main .fjsj .nr .f2 span {
  color: #ff5252;
  font-size: 0.3rem;
}

.main .fjsj .nr .f2 .label {
  justify-content: space-between;
  height: 0.4rem;
  padding: 0.09rem;
  background-color: #fccb5c;
  color: #021218;
  font-size: 0.19rem;
}

.main .fjsj .nr .f3 {
  margin-top: 0.35rem;
  flex: 0 0 auto;
  font-size: 0.36rem;
  color: #5c5c5c;
  float: right;
  padding-right: 0.4rem;
}

.main .fjsj ul {
  width: 10.55rem;
  margin-right: 0.22rem;
  display: flex;
  margin-top: 0.08rem;
}

.main .fjsj ul li {
  flex: 1;
}

.main .fjsj ul li p {
  color: #454545;
  font-size: 0.32rem;
  text-align: left;
  padding-left: 0.28rem;
  padding-top: 0.05rem;
}

.main .fjsj ul li img {
  width: 3.17rem;
  height: 3.17rem;
  border: #e8e8e8 solid 0.01rem;
}

.main .fjsj ul li span {
  color: #ff0000;
  font-size: 0.26rem;
  text-align: left;
}

.main .fjsj .fgx {
  width: 10.26rem;
  text-align: center;
  margin-left: 0.25rem;
  height: 0.01rem;
  margin-top: 0.42rem;
  padding-bottom: 1%;
  border-top: #e8e8e8 solid 0.01rem;
}

.main .fjsj .fgx2 {
  width: 10.26rem;
  text-align: center;
  height: 0.01rem;
  margin-top: 0.42rem;
  padding-bottom: 1%;
}

/*bor*/
.main .fjsj .bor ul {
  width: 10.55rem;
  margin-right: 0.22rem;
  display: flex;
  flex-direction:row;
  margin-top: 0.08rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.main .fjsj .bor ul li {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.main .fjsj .bor ul li p {
  color: #454545;
  font-size: 0.32rem;
  text-align: left;
  flex: 1;
  padding-left: 0.28rem;
  padding-top: 0.05rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.main .fjsj .bor ul li img {
  width: 3.17rem;
  height: 3.17rem;
  padding: 0.02rem;
  border: #e8e8e8 solid 0.01rem;
}

.main .fjsj .bor ul li span {
  color: #ff0000;
  font-size: 0.26rem;
  text-align: left;
}

.main .fjsj .bor .fgx {
  width: 10.26rem;
  text-align: center;
  margin-left: 0.25rem;
  height: 0.01rem;
  margin-top: 0.42rem;
  padding-bottom: 1%;
  border-top: #e8e8e8 solid 0.01rem;
}

.main .fjsj .bor .fgx2 {
  width: 10.26rem;
  text-align: center;
  height: 0.01rem;
  margin-top: 0.42rem;
  padding-bottom: 1%;
}
</style>
