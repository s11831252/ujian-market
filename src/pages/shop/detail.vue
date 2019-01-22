<template>
    <div class="page">
        <swipeWeb :swiperData="good_images"></swipeWeb>
        <div class="goods">
            <div class="goods-info">
                <p class="goods-item-price" v-if="goods_detail.gType==0">￥{{selectedItem.Price}}
                    <!-- <span class="original">原价{{selectedItem.MarketingPrice}}</span> -->
                </p>
                <p class="goods-item-price" v-else>议价</p>
                <p class="goods-name">{{goods_detail.gName}}</p>
                <div class="goods-item-info">
                    <span style="float:left;">月销
                        <p>{{goods_detail.Month_Sales}}</p>
                    </span>
                    <span>评论
                        <p>{{goods_detail.CommentCount}}</p>
                    </span>
                    <span style="float:right;">库存
                        <p>{{selectedItem.Stock}}</p>件</span>
                </div>
            </div>
            <div class="goods-items">
                <div class="goods-items-buy" v-if="goods_detail.gType==0">
                    <span>数量：</span>
                    <span v-for="(item,index) in goods_detail.Goods_Items" :key="index" >
                      <buy :goods="item" :image="goods_detail.Images[0].Thumbnail_url" :sName="sName" v-if="index==selectItem_index" ></buy>
                    </span>
                </div>
                <div class="goods-items-show" v-if="HasItems">
                    <span>规格：</span>
                    <ul>
                        <li :class="{'action':index==selectItem_index}" v-for="(item,index) in goods_detail.Goods_Items" :key="index" @click="selectItem(index)">{{item.ItemName}}</li>
                    </ul>
                </div>
            </div>
            <div class="goods-detail">
                <p class="goods-detail-title">
                    <span>商品参数</span>
                </p>
                <div class="goods-detail-prop">体积：
                    <span>长{{goods_detail.Length}}cm*宽{{goods_detail.Width}}cm*高{{goods_detail.Height}}cm</span>
                </div>
                <div class="goods-detail-prop">重量：
                    <span>{{goods_detail.Weight}}kg</span>
                </div>
                <div class="goods-detail-prop" :key="index" v-for="(item,index) in goods_detail.Goods_CustomAttr">{{item.AttrName}}：
                    <span>{{item.AttrValue}}</span>
                </div>
            </div>
            <div class="goods-detail">
                <p class="goods-detail-title">
                    <span>商品详情</span>
                </p>
                <div class="goods-detail-content">
                    <wxParse :content="goods_detail.gDetailed" @preview="preview" @navigate="navigate" />
                </div>
            </div>
        </div>
        <shoppingCar :sId="sId"></shoppingCar>
    </div>
</template>
<script>
import swipeWeb from "@/components/swiper";
import buy from "@/components/buy";
import shoppingCar from "@/components/shoppingCarToolbar";
import wxParse from 'mpvue-wxparse'
export default {
  data() {
    return {
      sId: "",
      sName: "",
      gId: "",
      goods_detail: {
        Price:"",
        MarketingPrice:"",
        Stock:"",
      },
      selectItem_index: 0
    };
  },
  computed: {
    good_images() {
      if (this.goods_detail && this.goods_detail.Images)
        return this.goods_detail.Images.map(item => {
          return item.Image_url;
        });
      else return [];
    },
    //判断是否有多规格
    HasItems(){
        if (this.goods_detail && this.goods_detail.Images) {
            return this.goods_detail.Goods_Items[0].ItemName?true:false;
        }else
        return false;
    },
    selectedItem() {
      if (this.goods_detail && this.goods_detail.Images) {
        return this.goods_detail.Goods_Items[this.selectItem_index];
      } else return {};
    }
  },
  methods: {
    selectItem(index) {
      this.selectItem_index = index;
    },
    preview(src, e) {
      // do something
    },
    navigate(href, e) {
      // do something
    }
  },
  components: {
    swipeWeb,
    buy,
    shoppingCar,
    wxParse
  },
   onLoad(query) {
    wx.showShareMenu({
      withShareTicket: true
    });
   },
  async mounted() {
    if (this.$route.query && this.$route.query.sId && this.$route.query.gId) {
      this.sId = this.$route.query.sId;
      this.gId = this.$route.query.gId;
      // console.log(this.$route.query.sName);
      this.sName= decodeURI(this.$route.query.sName);
      // console.log(this.sName);
      var rep = await this.$ShoppingAPI.Goods_Get({
        sId: this.sId,
        gId: this.gId
      });
      if (rep.ret == 0) {
        this.goods_detail = rep.data;
        //  console.log(this.goods_detail);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
.page{
  padding-bottom: 65px;
}
.goods {
  background: #ecf0f1;
  & > div {
    background: #fff;
    padding: 10px;
  }
  .goods-info {
    margin-bottom: 10px;
    .goods-item-price {
      font-size: 30px;
      color: #ff5252;
      .original {
        margin-left: 10px;
        color: #a2a2a2;
        font-size: 17px;
        text-decoration: line-through;
      }
    }
    .goods-name {
      color: #021218;
      font-size: 22px;
    }
    .goods-item-info {
      font-size: 17px;
      text-align: center;
      color: #a2a2a2;
      p {
        color: #ff5252;
        display: inline-block;
        margin-left: 5px;
      }
    }
  }
  .goods-items {
    margin-bottom: 10px;
    font-size: 18px;
    & > div > span {
      color: #5c5c5c;
    }
    .goods-items-show {
      ul {
        display: inline-block;
        li.action {
          border-color: #12b7f5;
          color: #12b7f5;
        }
        li {
          border: 1px solid #a2a2a2;
          margin: 5px 0 0 5px;
          padding: 1px 3px;
          display: inline-block;
        }
      }
    }
  }
  .goods-detail{
      .goods-detail-title{
          color: #5c5c5c;
          font-size: 18px;
          padding-bottom: 5px;
          border-bottom: 1px solid #12b7f5;
          span{
              border-left: 3px solid #12b7f5;
              padding-left:5px;
              line-height: 24px;
              
          }
      }
      .goods-detail-prop{
          font-size: 18px;
          color:#a2a2a2;
          margin: 5px 0;
      }
  }
}
</style>
