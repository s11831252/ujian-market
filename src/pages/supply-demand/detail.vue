<!--
 * @Author: SuChonghua
 * @Date: 2021-12-07 18:15:24
 * @LastEditTime: 2021-12-29 16:24:58
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\detail.vue
-->
<template>
  <div class="root">
    <div class="main" v-if="supplyModel">
      <div class="title">
        <i v-if="supplyModel.info.listType == 1 || supplyModel.info.listType == 5" class="corp">企</i>
        <i v-else-if="supplyModel.info.listType == 2" class="pro">项</i>
        <i v-else-if="supplyModel.info.listType == 4" class="shop">商</i>
        <i v-else-if="supplyModel.info.listType == 3" class="personal">个</i>
        <span>{{ supplyModel.info.title }}</span>
      </div>
      <div class="address">
        <span class="txt">地址:</span>
        <span>{{ address.ext.extContent }}</span>
      </div>
      <div class="content">{{ supplyModel.info.content }}</div>
      <ul class="img-list">
        <li v-for="(item, index) in imageList" :key="index">
          <img :src="item.ext.extContent" />
        </li>
      </ul>
      <ul class="img-list">
        <li v-for="(item, index) in goodsList" :key="index">
          <img :src="item.goods.imageLogo" />
          <div class="title">{{ item.goods.gName }}</div>
          <div class="num">已售 {{ item.goods.sales }}件</div>
          <div class="price">¥ {{ item.goods.gType == 1 ? "议价商品" : item.goods.price_min }}</div>
        </li>
      </ul>
      <div class="other-info">
        <div class="phone">
          <i class="icon">&#xe60a;</i>
          <span>{{ contact.ext.extContent }}</span>
        </div>
        <div class="public-info">
          <span class="publisher">{{ publisher.ext.extContent }}</span>
          <span class="public-date">发布于{{ sendTime }} · </span>
          <span class="viewcount">浏览{{ supplyModel.viewCount }}</span>
        </div>
      </div>
      <div class="br"></div>
      <div class="shop-info" v-if="shopinfo && supplyModel.info.listType == 4">
        <div class="logo">
          <img :src="shopinfo.shop.sLogo" />
        </div>
        <div class="info">
          <div class="shop-name">{{ shopinfo.shop.sName }}</div>
          <div class="txt">
            <span class="point">店铺评分：<small>{{ shopinfo.shop.score }}</small></span>
            <span class="mainproduct">主营：<small>{{ shopinfo.shop.mainTypeName }}</small></span>
          </div>
        </div>
      </div>
      <div class="shop-info" v-if="corpinfo && (supplyModel.info.listType == 1 || supplyModel.info.listType == 5)">
        <div class="logo">
          <img :src="corpinfo.enterprise.eLogo" />
        </div>
        <div class="info">
          <div class="shop-name">{{ corpinfo.enterprise.eName }}</div>
          <div class="txt">
            <span>地址：<small>{{ corpinfo.enterprise.address }}</small></span>
          </div>
        </div>
      </div>
      <div class="project-info" v-if="(projectinfo && supplyModel.info.listType == 2)">
        <div class="name">
          <i class="icon">&#xe6c8;</i>
          <div class="txt">{{ projectName.ext.extContent }}</div>
        </div>
        <ul class="info">
          <li v-for="(item,index) in projectinfo" :key="index">
            <span class="label"><small>·</small>{{item.ext.extTitle}}</span>
            <span class="value">{{item.ext.extContent}}</span>
          </li>
        </ul>
      </div>
    </div>
    <button class="msg">查看私信</button>
  </div>
</template>
<script>
import utils from '../../utils/index'
export default {
  data() {
    return {
      supplyModel: null,
    };
  },
  computed: {
    imageList() {
      if (!this.supplyModel || !this.supplyModel.ext || this.supplyModel.ext.length == 0) return [];

      return this.supplyModel.ext.filter((item) => {
        return item.ext.extType == 1;
      });
    },
    goodsList() {
      if (!this.supplyModel || !this.supplyModel.ext || this.supplyModel.ext.length == 0) return [];

      return this.supplyModel.ext.filter((item) => {
        return item.ext.extType == 6;
      });
    },
    shopinfo() {
      if (!this.supplyModel || !this.supplyModel.ext || this.supplyModel.ext.length == 0) return null;

      return this.supplyModel.ext.find((item) => {
        return item.ext.extType == 5;
      });
    },
    publisher() {
      if (!this.supplyModel || !this.supplyModel.ext || this.supplyModel.ext.length == 0) return null;

      return this.supplyModel.ext.find((item) => {
        return item.ext.extType == 2;
      });
    },
    contact() {
      if (!this.supplyModel || !this.supplyModel.ext || this.supplyModel.ext.length == 0) return null;

      return this.supplyModel.ext.find((item) => {
        return item.ext.extType == 3;
      });
    },
    corpinfo() {
      if (!this.supplyModel || !this.supplyModel.ext || this.supplyModel.ext.length == 0) return null;
      return this.supplyModel.ext.find((item) => {
        return item.ext.extType == 4;
      });
    },
    projectName() {
      if (!this.supplyModel || !this.supplyModel.ext || this.supplyModel.ext.length == 0) return null;
      return this.supplyModel.ext.find((item) => {
        return item.ext.extType == 7&&item.ext.extTitle == "项目名称";
      });
    },
    projectinfo() {
      if (!this.supplyModel || !this.supplyModel.ext || this.supplyModel.ext.length == 0) return null;
      return this.supplyModel.ext.filter((item) => {
        return item.ext.extType == 7&&item.ext.extTitle != "地址"&&item.ext.extTitle != "项目名称";
      });
    },
    address() {
      if (!this.supplyModel || !this.supplyModel.ext || this.supplyModel.ext.length == 0) return null;
      return this.supplyModel.ext.find((item) => {
        return item.ext.extType == 7 && item.ext.extTitle == "地址";
      });
    },
    sendTime(){
      if (!this.supplyModel ) return "";

      var time =  this.supplyModel.info.sendTime.replace(/-/g, "/")
      var date = new Date(time);
      console.log(date)
      return utils.formatTime(date,"yyyy/MM/dd")
    }
  },
  async mounted() {
    if (this.$route.query.listId) {
      var rep = await this.$SupplyAndDemandAPI.SupplyAndDemand_Detail(this.$route.query.listId);
      if (rep.ret == 0) {
        this.supplyModel = rep.data;
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.root {
  background-color: #edf0f5;

  .main {
    background-color: #fff;
    padding-top: 0.6rem;
    color: #333333;
    &>div,&>ul{
      margin:0 0.5rem;
    }
    .title {
      font-size: 0.48rem;
      line-height: 0.54rem;
      display: flex;
      align-items: flex-start;
      i {
        display: inline-block;
        font-size: 0.29rem;
        width: 0.48rem;
        height: 0.49rem;
        line-height: 0.49rem;
        text-align: center;
        border-radius: 0.07rem;
        color: #ffffff;
        margin-right: 0.14rem;
        flex-shrink: 0;
      }
      span {
        font-weight: bold;
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
    .address {
      background-color: #fff;
      padding-top: 0.55rem;
      padding-bottom: 0.41rem;
      border-bottom: solid 0.03rem #f2f2f2;
      display: flex;
      align-items: flex-start;
      color: #8c8c8c;
      line-height: 0.54rem;
      font-size: 0.36rem;
      span.txt {
        flex-shrink: 0;
        margin-right: 0.15rem;
      }
    }
    .content {
      background-color: #fff;
      padding-top: 0.36rem;
      padding-bottom: 0.93rem;
      font-size: 0.36rem;
      line-height: 0.5rem;
      color: #333333;
    }
    .img-list {
      display: flex;
      align-items: center;
      background-color: #fff;
      padding: 0 0.16rem;
      padding-top: 0.3rem;
      li {
        img {
          width: 2.82rem;
          height: 2.55rem;
          border-radius: 0.15rem;
        }
        .title {
          margin-top: 0.15rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 0.33rem;
          color: #111111;
        }
        .num {
          margin-top: 0.22rem;
          color: #999999;
          font-size: 0.25rem;
        }
        .price {
          margin-top: 0.22rem;
          color: #f19149;
          font-size: 0.42rem;
          margin-bottom: 0.33rem;
        }
      }
      li:nth-of-type(1n + 2) {
        margin-left: 0.55rem;
      }
    }
    .other-info {
      background-color: #fff;
      padding: 0.47rem 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .phone {
        display: flex;
        align-items: center;
        .icon {
          width: 0.36rem;
          height: 0.36rem;
          border-radius: 50%;
          color: #fff;
          background-color: #2e93e5;
          font-size: 0.25rem;
          line-height: 0.36rem;
          text-align: center;
          margin-right: 0.08rem;
        }
        span {
          font-size: 0.35rem;
        }
      }
      .public-info {
        color: #8c8c8c;
        font-size: 0.35rem;
        .publisher {
          margin-right: 0.12rem;
        }
      }
    }
    .br{
      width: 100%;
      height: 0.27rem;
      background-color: #edf0f5;
      margin: 0;
    }
    .shop-info {
      display: flex;
      align-items: center;
      background-color: #fff;
      padding: 0.43rem 0.55rem 0.41rem 0.48rem;
      margin: 0;
      .logo {
        margin-right: 0.27rem;
        img {
          width: 1.05rem;
          height: 1.05rem;
          border-radius: 0.16rem;
        }
      }
      .info {
        .shop-name {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 0.39rem;
          color: #333333;
          margin-bottom: 0.26rem;
        }
        .txt {
          display: flex;
          align-items: center;
          span {
            display: flex;
            align-items: center;
            font-size: 0.35rem;
            color: #666666;
          }
          span.point {
            small {
              font-size: 0.35rem;
              color: #f24a56;
            }
          }
          span.mainproduct {
            margin-left: 0.35rem;
            small {
              font-size: 0.35rem;
              color: #12b7f5;
            }
          }
        }
      }
    }
    .project-info{
      background-color: #fff;
      .name{
        padding: 0.48rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: solid #ebebeb 0.02rem;
        .icon{
          font-size: 0.5rem;
          color: #097af0;
          margin-right: 0.2rem;
          flex-shrink:0;
        }
        .txt{
          font-size: 0.39rem;
          color: #333333;
          flex-grow:1;
        }
      }
      .info{
        li{
          padding: 0.41rem  1.04rem 0.41rem 0.95rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #333333;
          font-size: 0.33rem;
          border-bottom: solid #ebebeb 0.02rem;
          .label{
            flex-shrink:0;
            small{
              font-size: 0.5rem;
              margin-right: 0.2rem;
              display:inline-block;
            }
          }
        }
      }
    }
  }
  button.msg {
    margin-top: 1.59rem;
    width: 9.89rem;
    height: 1.21rem;
    background-color: #00b7ee;
    border-radius: 0.6rem;
    font-size: 0.5rem;
    line-height: 1.21rem;
    color: #ffffff;
  }
}
</style>