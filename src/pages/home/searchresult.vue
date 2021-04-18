<template>
  <div class="search">
    <div class="top">
      <div class="sousuo">
        <i class="icon ss" alt>&#xe6e3;</i>
        <input class="shuru" v-model="keyword" placeholder="输入商品关键词" placeholder-style="color:#d0f1fd;" />
        <i class="icon false" alt @click="clearKeyword">&#xe603;</i>
      </div>
      <!-- <img src="img/more_icon.png" class="more" alt="" /> -->
      <span class="more" @click="tabClick(Tabs[activeIndex])">搜索</span>
    </div>
    <div class="main">
      <div class="nav">
        <ul>
          <li v-for="(item,index) in Tabs" :key="index" :id="index" :class="{'action':activeIndex == index}" @click="tabClick(item,$event)">
            <p>{{item.name}}</p>
          </li>
        </ul>
      </div>
      <div class="navbar_slider" :class="navbarSliderClass"></div>
      <div class="demo" v-for="(item,index) in GoodList" :key="index">
        <div class="shop" @click="go({path:'/pages/shop/index',query:{sId:item.sId}})" >
          <img :src="item.sLogo" alt @ />
          <div class="name">
            <div class="title">
              <p class="shopname">
                <span class="txt">{{item.sName}}</span>
                <span class="liveroom" v-if="item.LiveRoomId&&Config.showBuy" @click.stop="go({ path: '/pages/live/room', query: {roomId: item.LiveRoomId} })">
                    <i class="icon rectbox">
                      <span class="rect"></span>
                      <span class="rect rect2"></span>
                      <span class="rect rect3"></span>
                    </i>
                    <span>直播中</span>
                </span>
              <p class="space">{{item.Distance}}米</p>
            </div>
            <div class="intruduce">
              <p class="score">
                店铺综合评分：
                <b>{{item.Score}}</b>
              </p>
              <p class="ft">主营：{{item.MainTypeName}}</p>
            </div>
          </div>
        </div>
        <div v-for="(item2,index2) in item.Goods_list" :key="index2">
          <resultItem :goods="item2" :sid="item.sId" :keyword="keyword"></resultItem>
        </div>
        <!-- <div class="shop_nr" v-for="(item2,index2) in item.Goods_list" :key="index2" @click="go({path:'/pages/shop/detail',query:{sId:item.sId,gId:item2.gId}})">
                    <div class="dian"></div>
                    <div class="nr_right">
                        <img :src="item2.Images[0].Thumbnail_url" alt="" />
                        <div class="contents">
                            <p class="bt" v-html="item2.gName"></p>
                            <div class="ft"><b>月售 {{item2.Month_Sales}}</b>
                                <p class="comment">评论 {{item2.CommentCount}}</p>
                            </div>
                            <p class="money">￥{{item2.Price}}</p>
                        </div>
                    </div>
                    <div class="fgx"></div>
        </div>-->
        <div class="bottom"></div>
      </div>
    </div>
  </div>
</template>
<script>
import resultItem from "@/pages/home/searchresult-item";
import { mapState } from "vuex";

export default {
  components: {
    resultItem
  },
  data() {
    return {
      keyword: "",
      activeIndex: 0,
      GoodList: [],
      Tabs: [
        {
          name: "综合",
          index: 0,
          parm: {
            PageIndex: 1,
            PageSize: 20,
            OrderType: "",
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
          name: "价格",
          index: 3,
          parm: {
            PageIndex: 1,
            PageSize: 20,
            OrderType: "PRICE",
            hasPage: true
          },
          checked: true
        },
        {
          name: "距离",
          index: 4,
          parm: {
            PageIndex: 1,
            PageSize: 20,
            OrderType: "DISTANCE",
            hasPage: true
          },
          checked: true
        }
      ]
    };
  },
  methods: {
    clearKeyword() {
      this.keyword = "";
    },
    async tabClick(tab, e) {
      if (e) {
        let _tab = this.Tabs[this.activeIndex];
        _tab.parm.PageIndex = 1;
        _tab.parm.hasPage = true;
        this.activeIndex = e.currentTarget.id;
      }
      var param = {
        PageIndex: tab.parm.PageIndex,
        PageSize: tab.parm.PageSize,
        OrderType: tab.parm.OrderType,
        Keyword: this.keyword,
        isGood:false,
        isDetail:false,
      };
      if (this.CurrentLocation && this.CurrentLocation.longitude && this.CurrentLocation.latitude) {
        (param.Lon = this.CurrentLocation.longitude), (param.Lat = this.CurrentLocation.latitude);
      }
      var rep = await this.$ShoppingAPI.Goods_Search(param);
      if (rep.ret == 0) {
        this.GoodList = rep.data;
      }
    }
  },
  //上拉刷新
  onPullDownRefresh() {
    this.activeIndex = 0;
    this.Tabs[0].parm.PageIndex = 1;
    this.Tabs[0].parm.hasPage = true;
    this.tabClick(this.Tabs[0]);
    wx.stopPullDownRefresh();
  },
  //下拉触底加载
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
      if (this.CurrentLocation && this.CurrentLocation.longitude && this.CurrentLocation.latitude) {
        (param.Lon = this.CurrentLocation.longitude), (param.Lat = this.CurrentLocation.latitude);
      }
      var rep = await this.$ShoppingAPI.Goods_Search(param);
      if (rep.ret == 0) {
        if (rep.data && rep.data.length) {
          for (let index = 0; index < rep.data.length; index++) {
            const element = rep.data[index];
            that.GoodList.push(element);
          }
        } else {
          tab.parm.hasPage = false;
        }
      }
    }
  },
  computed: {
    navbarSliderClass() {
      return "navbar_slider_" + this.activeIndex;
    },

    ...mapState({
      Config: state => state.Global.Config,
      CurrentLocation: state => state.User.CurrentLocation
    })
  },
  onLoad(query) {
    // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    // if (query.scene)
    // console.log(query.scene)
    //this.sId = decodeURIComponent(query.scene);
  },
  mounted() {
    if (this.keyword || (this.$route.query.keyword && this.$route.query.keyword.length > 0)) {
      this.keyword = this.$route.query.keyword;

      this.tabClick(this.Tabs[0]);
    }
  }
};
</script>
<style lang="less" scoped>
.search .top {
  width: 10.8rem;
  padding-bottom: 0.14rem;
  padding-top: 0.14rem;
  background-color: #12b7f5;
  overflow: hidden;
  position: fixed;
  top: 0;
}

.search .top .back {
  width: 0.28rem;
  height: 0.5rem;
  margin-left: 0.28rem;
  margin-top: 0.28rem;
  float: left;
}

.search .top .sousuo {
  width: 7.62rem;
  height: 0.97rem;
  margin-left: 0.8rem;
  border: solid 1px #d0f1fd;
  border-radius: 0.5rem;
  overflow: hidden;
  float: left;
  /*input提示文字颜色*/
}
input::-webkit-input-placeholder {
  color: #d0f1fd;
}

.search .top .sousuo .ss {
  width: 0.58rem;
  height: 0.58rem;
  font-size: 0.58rem;
  margin-top: 0.21rem;
  margin-left: 0.52rem;
  float: left;
  color: #d0f1fd;
}

.search .top .sousuo ::-webkit-input-placeholder {
  color: #d0f1fd;
}

.search .top .sousuo ::-o--input-placeholder {
  color: #d0f1fd;
}

.search .top .sousuo ::-moz-input-placeholder {
  color: #d0f1fd;
}

.search .top .sousuo ::-ms-input-placeholder {
  color: #d0f1fd;
}

.search .top .sousuo .shuru {
  height: 0.95rem;
  background-color: #12b7f5;
  width: 5rem;
  display: block;
  font-size: 0.46rem;
  color: #d0f1fd;
  white-space: nowrap;
  float: left;
  line-height: 1.05rem;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 0.3rem;
}

.search .top .sousuo .false {
  width: 0.42rem;
  height: 0.42rem;
  margin-top: 0.09rem;
  margin-right: 0.45rem;
  float: right;
  color: #d0f1fd;
  font-size: 0.76rem;
}

.search .top .more {
  //   width: 0.6rem;
  height: 0.6rem;
  float: right;
  margin-right: 0.4rem;
  margin-top: 0.22rem;
  font-size: 0.46rem;
  color: #d0f1fd;
}
.search .main {
  background-color: #ffffff;
  padding-top: 1.28rem;
}

.search .main .nav {
  padding: 0.32rem 0 0.05rem 0;
}

.search .main .nav ul {
  list-style-type: none;
  border-bottom: solid 0.01rem #ecf0f1;
  text-align: center;
}

.search .main .nav ul li.action p {
  color: #12b7f5;
}

.search .main .nav ul li {
  padding-bottom: 0.24rem;
  width: 20%;
  display: inline-block;
}

.search .main .nav ul li p {
  color: #021218;
  font-size: 0.4rem;
  font-family: "MicrosoftYaHei";
}

.search .main .demo .shop {
  padding-top: 0.45rem;
  height: 1.3rem;
  padding-bottom: 0.6rem;
  padding-left: 0.28rem;
}

.search .main .demo .shop img {
  width: 1.07rem;
  height: 1.07rem;
  float: left;
  padding-top: 0.12rem;
  padding-bottom: 0.15rem;
}

.search .main .demo .shop .name {
  width: 8.83rem;
  margin-left: 0.33rem;
  margin-top: 0;
  float: left;
}

.search .main .demo .shop .name .title {
  height: 0.6rem;
}

.search .main .demo .shop .name .title .shopname {
  color: #021218;
  font-size: 0.44rem;
  font-family: "MicrosoftYaHei";
  float: left;
  display: flex;
  justify-content: space-between;
  .txt {
    display: inline-block;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-grow: 1;
    width: 5.8rem;
  }
  .liveroom {
      font-size: 0.32rem;
      border-radius: 0.23rem;
      text-align: center;
      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 0.46rem;
        line-height: 0.46rem;
        border-radius: 50%;
        background-color: #fc8749;
        color: #fff0ee;
      }
      padding-right: 0.23rem;
      color: #fff;
      background-color: #f85d4a;
      display: flex;
      justify-content: center;
      align-items: center;
    }
}

.search .main .demo .shop .name .title .space {
  color: #5c5c5c;
  font-size: 0.36rem;
  font-family: "MicrosoftYaHei";
  float: right;
  line-height: 0.58rem;
}

.search .main .demo .shop .name .intruduce {
  height: 0.7rem;
  margin-top: 0.16rem;
  width: 8.83rem;
}

.search .main .demo .shop .name .intruduce .score {
  margin-right: 1.66rem;
  color: #5c5c5c;
  font-size: 0.38rem;
  font-family: "MicrosoftYaHei";
  float: left;
}

.search .main .demo .shop .name .intruduce .score b {
  display: inline-block;
  font-weight: normal;
  color: #ff5252;
}

.search .main .demo .shop .name .intruduce .ft {
  color: #a2a2a2;
  font-size: 0.38rem;
  font-family: "MicrosoftYaHei";
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.search .main .demo .bottom {
  height: 0.2rem;
  background-color: #f2f0f0;
}

.navbar_slider {
  position: absolute;
  content: " ";
  left: 0;
  // bottom: 0;
  width: 20%;
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
.navbar_slider_4 {
  transform: translateX(400%);
}
</style>
