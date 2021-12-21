<!--
 * @Author: SuChonghua
 * @Date: 2021-12-14 16:56:02
 * @LastEditTime: 2021-12-21 16:34:50
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\selectGoods.vue
-->
<template>
  <div class="shop-detail" v-if="shopDetail">
    <div class="shop-detail-head">
      <div class="shop-simple-info">
        <p class="shop-detail-name">{{ shopDetail.sName }}</p>
      </div>
    </div>
    <div class="shop-detail-tab">
      <div class="navbar-body">
          <div class="shop-detail-tab-goods">
            <ul class="shop-detail-tab-goods-types">
              <li v-for="(item, index) in $GoodsType" :key="index" :class="{ active: item.TypeId == activeType }" @click="changeGoodsType(item.TypeId)">
                <p>{{ item.TypeName }}</p>
              </li>
            </ul>
            <ul class="shop-detail-tab-goods-list">
              <li v-for="(item, index) in goodList" :key="index" class="shop-detail-tab-goods-detail">
                <indexGoodDetail :goodsInfo="item" :sName="shopDetail.sName" @selected="selected"></indexGoodDetail>
              </li>
            </ul>
          </div>
      </div>
    </div>
    <div class="select-box">
      <i class="icon">&#xe60e;</i>
      <span class="txt">已选择<small>{{selectGoods.length}}</small>件商品</span>
      <button>确定</button>
    </div>
  </div>
</template>
<script>
import indexGoodDetail from "./selectGoods-item.vue";
import { mapState,mapMutations} from "vuex";

export default {
  data() {
    return {
      sId: "",
      shopDetail: null,
      shopGoods: [],
      GoodsType: [],
      activeType: 0,
    };
  },
  components: {
    indexGoodDetail,
  },
  computed: {
    $GoodsType() {
      var that = this;
      var list = that.GoodsType.filter((item) => {
        if (item.TypeId > 0 && that.shopGoods) {
          var goods = that.shopGoods.find((v) => {
            return v.TypeId.indexOf(item.TypeId) >= 0;
          });
          return goods != null;
        } else {
          var goods = that.shopGoods.find((v) => {
            return v.TypeId.length == 0;
          });
          return goods != null;
        }
      });
      return list;
    },
    goodList() {
      var that = this;
      if (that.shopGoods) {
        return that.shopGoods.filter((item) => {
          if (that.activeType > 1) return item.TypeId.indexOf(that.activeType) > -1;
          else return item.TypeId.length == 0;
        });
      } else return [];
    },
    ...mapState({
      UserInfo: (state) => state.User.UserInfo,
      Config: (state) => state.Global.Config,
      selectGoods:(state)=>state.SupplyDemand.selectGoods,
    }),
  },
  methods: {
    changeGoodsType(typeid) {
      this.activeType = typeid;
    },
    selected(item){
      var that = this;
      that.setSelecGoods(item);
    },
    ...mapMutations(["setSelecGoods"])
  },
  async mounted() {
    let that = this;
    this.activeIndex = 0;
    if (this.sId || (this.$route.query && this.$route.query.sId.length > 0)) {
      this.sId = this.sId || this.$route.query.sId;
      var rep = await this.$ShoppingAPI.Shop_GetDetails({ sId: this.sId }); //获取店铺详情

      if (rep.ret == 0) {
        this.shopDetail = rep.data;
      }

      var rep3 = await this.$ShoppingAPI.Goods_GetByShop({ sId: this.shopDetail.sId }); //获取店铺商品
      if (rep3.ret == 0) {
        this.shopGoods=rep3.data;
      }
      var rep2 = await this.$ShoppingAPI.CustomGoodsType_Get({ sId: this.shopDetail.sId }); //获取店铺商品分类
      if (rep2.ret == 0) {
        this.GoodsType = rep2.data;
        this.GoodsType.push({ Sort: "0", TypeId: "-1", TypeName: "其他" });
        if (this.$GoodsType != null) 
            this.changeGoodsType(this.$GoodsType[0].TypeId);
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.shop-detail {
  padding-bottom: 65px;
  .shop-detail-head {
    padding: 0.59rem 0.29rem;
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


  .select-box{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;

    height: 1.86rem;
    background-color: #403e3f;
    .icon{
      width: 1.02rem;
      height: 1.04rem;
      color:#403e3f ;
      background-color: #f19149;
      border-radius: 50%;
      flex-shrink:0;
      font-size: 0.6rem;
      margin-left: 0.67rem;
      margin-right: 0.37rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .txt{
      display: flex;
      align-items: center;
      flex-grow:1;
      font-size: 0.4rem;
      color: #ffffff;
      small{
        color: #f19149;
        font-size: 0.6rem;
      }
    }
    button{
      flex-shrink:0;
      width: 1.4rem;
      height: 0.67rem;
      border-radius: 0.15rem;
      border: solid 0.02rem #f19149;
      color: #ffffff;
      font-size: 0.36rem;
      margin-right: 0.54rem;
    }
  }
}

</style>

