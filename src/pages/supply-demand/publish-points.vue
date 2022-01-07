<!--
 * @Author: SuChonghua
 * @Date: 2021-12-31 16:27:28
 * @LastEditTime: 2022-01-07 11:07:02
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\publish-points.vue
-->
<template>
  <div class="root">
    <div class="head">
      <div class="position">
        <i class="icon"></i>
        <span></span>
      </div>
      <div class="menu">
        <i class="icon" @click="demandBox_open = true">&#xe66d;</i>
      </div>
    </div>
    <div class="statistical">
      <div class="item">
        <div class="label">
          <i class="icon">&#xe662;</i>
          <span class="txt">个人发布点</span>
        </div>
        <span class="value">{{ selfMoney }}</span>
      </div>
      <div class="item">
        <div class="label">
          <i class="icon">&#xeb19;</i>
          <span class="txt">企业发布点</span>
        </div>
        <span class="value">{{ enterpriseMoney }}</span>
      </div>
      <div class="item">
        <div class="label">
          <i class="icon">&#xe651;</i>
          <span class="txt">店铺发布点</span>
        </div>
        <span class="button" v-if="showTip" @click="demandBox_open = true">点击购买发布点</span>
        <span class="button" v-else @click="go({ path: '/pages/supply-demand/buy' })">点击购买发布点</span>
      </div>
    </div>
    <div class="block" v-for="(i, index) in list" :key="index">
      <div class="total-box">
        <div class="month">{{i.month}}<small>月</small></div>
        <div class="total">
          <span>发布{{i.publishCount}}条</span>
          <span>消耗{{i.publishTotal}}个发布点</span>
          <span>增加{{i.rechargeTotal}}个发布点</span>
        </div>
      </div>
      <ul class="list">
        <li class="item" v-for="(item, index2) in i.data" :key="index2">
          <i class="icon" v-if="item.listId == -1">&#xe66e;</i>
          <img v-else :src="item.logoImage" />
          <div class="item-info">
            <div class="left">
              <span class="title" v-if="item.listId == -1">{{ item.enterpriseMoney > 0 ? "企业" : "个人" }}发布点充值</span>
              <span class="title" v-else>{{ item.title }}</span>

              <div class="other">
                <span class="type" v-if="item.listType == 1">企业需求</span>
                <span class="type" v-else-if="item.listType == 2">项目需求</span>
                <span class="type" v-else-if="item.listType == 3">个人供应</span>
                <span class="type" v-else-if="item.listType == 4">店铺供应</span>
                <span class="type" v-else-if="item.listType == 5">企业供应</span>

                <span class="time">{{ item.addTime }}</span>
              </div>
            </div>
            <div class="points">{{ item.listId == -1 ? "+" : "" }}{{ item.enterpriseMoney || item.selfMoney }}</div>
          </div>
        </li>
        <!-- <li class="item">
          <i class="icon"></i>
          <div class="item-info">
            <div class="left">
              <span class="title">急需各种钢材用品螺纹钢等...</span>
              <div class="other">
                <span class="type">企业需求</span>
                <span class="time">今天 09:09</span>
              </div>
            </div>
            <div class="points">-1</div>
          </div>
        </li> -->
      </ul>
    </div>
    <div class="release-demand-box" :class="{ open: demandBox_open }">
      <div class="mask"></div>
      <div class="wrapper" @click="demandBox_open = false">
        <div class="wrapper_body" @click.stop>
          <span class="title">发布点说明</span>
          <ul class="list">
            <li>
              <span class="">1、</span>
              <span>发布点可用于支付发布供需的费用，个人供应扣除1点个人发布点/条，企业供应/需求、店铺供应、项目供应/需求扣除1点企业发布点/条。</span>
            </li>
            <li>
              <span>2、</span>
              <span>每条供需信息的展示时间为7天。</span>
            </li>
          </ul>
          <div class="button-group">
            <button class="cancel" @click="demandBox_open = false">取消</button>
            <button @click="go({ path: '/pages/supply-demand/buy' });demandBox_open = false">购买服务</button>
          </div>
        </div>
        <div class="wrapper_foot" @click.stop>
          <i class="icon" v-if="showTip" @click="setShowTip(false)">&#xe62d;</i>
          <i class="icon" v-else @click="setShowTip(true)">&#xe618;</i>
          <span>不再弹出</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import utils from '../../utils/index'

export default {
  data() {
    return {
      list: [],
      demandBox_open: false,
      enterpriseMoney: 0,
      selfMoney: 0,
      pageIndex:1,
      loadMore:true
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.User.UserInfo,
      showTip: (state) => state.SupplyDemand.showTip,
    }),
  },
  methods: {
    getBook(){
      var that = this;
      if(!this.loadMore)
      return ;
      this.$SupplyAndDemandAPI.HallMoney_GetBooks({ userId: this.userInfo.UserId, pageIndex: this.pageIndex }).then((rep) => {
        if (rep.ret == 0&&rep.data&&rep.data.length>0) {
          //进一步计算统计
          //格式化日期获取年/月
        var _date = new Date(rep.data[0].addTime.replace(/-/g, "/"));
        var publishTotalArr = rep.data.filter(i=>i.listId>0).map(i=>{
          return i.selfMoney+i.enterpriseMoney
        });
        var rechargeArr = rep.data.filter(i=>i.listId==-1).map(i=>{
          return i.selfMoney+i.enterpriseMoney
        });
        //消耗的发布点
        var publishTotal = publishTotalArr.reduce(function(prev, cur, index, arr) {
          console.log(prev, cur, index);
          return prev + cur;
        });
        //充值的发布点
        var rechargeTotal = rechargeArr.reduce(function(prev, cur, index, arr) {
          console.log(prev, cur, index);
          return prev + cur;
        });
          var _item = {
            month : _date.getMonth()+1,
            year:_date.getFullYear(),
            publishCount : rep.data.filter(i=>i.listId>0).length,
            publishTotal:(-publishTotal),
            rechargeTotal,
            data:rep.data
          }
          this.list.push(_item);
        }else
        {
          this.loadMore=false
        }
      });
    },
    ...mapActions(["getPointsPrice"]),
    ...mapMutations(["setShowTip"]),
  },
  onReachBottom(){
    this.pageIndex++;
    this.getBook();
  },
  mounted() {
    var that = this;
    this.getBook();
    this.$SupplyAndDemandAPI.HallMoney_Balance().then((rep) => {
      if (rep.ret == 0) {
        that.enterpriseMoney = rep.data.enterpriseMoney;
        that.selfMoney = rep.data.selfMoney;
      }
    });
  },
};
</script>
<style lang="scss" scoped>
.root {
  background-color: #edf0f5;
  padding-bottom:0.37rem;
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
  .statistical {
    margin: 0.37rem 0.32rem;
    height: 2.11rem;
    background-color: #ffffff;
    border-radius: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    .item {
      flex-grow: 1;
      text-align: center;
      padding: 0 0.44rem;
      .label {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.34rem;
        color: #444;
        margin-bottom: 0.39rem;
        i {
          margin-right: 0.12rem;
        }
      }
      .value {
        font-size: 0.6rem;
        color: #097af0;
      }
      .button {
        font-size: 0.36rem;
        color: #ee6b59;
      }
    }
    .item:nth-of-type(1n + 2) {
      border-left: solid 0.02rem #f2f2f2;
    }
  }

  .block {
    margin: 0 0.33rem;
    padding: 0.64rem 0.35rem;
    padding-bottom: 0;
    background-color: #ffffff;
    border-radius: 0.2rem;
    margin-bottom: 0.37rem;
    .total-box {
      padding-left: 0.42rem;
      padding-bottom: 0.37rem;
      .month {
        color: #333333;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        small {
          font-size: 0.42rem;
        }
      }
      .total {
        display: flex;
        align-items: center;
        color: #333333;
        font-size: 0.38rem;
        span {
          margin-right: 0.37rem;
        }
      }
    }
    .list {
      .item {
        border-top: solid 0.03rem #f2f2f2;
        padding-left: 0.42rem;
        padding-right: 0.5rem;
        display: flex;
        align-items: center;
        padding: 0.57rem 0;
        img,
        .icon {
          width: 1.07rem;
          height: 1.07rem;
          border-radius: 0.05rem;
          margin-right: 0.28rem;
          flex-shrink: 1;
        }
        .icon {
          background-color: #097af0;
          color: #fff;
          font-size: 0.56rem;
          text-align: center;
          line-height: 1.07rem;
        }
        .item-info {
          display: flex;
          align-items: center;
          .left {
            flex-shrink: 1;
            width: 5.58rem;
            .title {
              color: #666666;
              font-size: 0.44rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-bottom: 0.28rem;
            }
            .other {
              display: flex;
              align-items: center;
              color: #999999;
              font-size: 0.38rem;
              .type {
                margin-right: 0.46rem;
              }
            }
          }
          .points {
            flex-grow: 1;
            margin-left: 1.35rem;
            color: #333333;
            font-size: 0.65rem;
          }
        }
      }
    }
  }
  .release-supply-box,
  .release-demand-box {
    .mask {
      position: fixed;
      z-index: 10;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: none;
      opacity: 0;
      transform: scale3d(1, 1, 0);
      transition: all 0.3s ease-in;
    }
    .wrapper {
      position: fixed;
      z-index: 10;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      text-align: center;
      font-size: 0;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      flex-direction: column;
      align-items: center;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      transform: translateY(-100%);
      visibility: hidden;
      opacity: 0;
      transition: opacity 700ms ease-out, transform 300ms ease-out, visibility 700ms ease-out;
      .wrapper_body {
        width: 9.18rem;
        border-radius: 0.2rem;
        text-align: center;
        background-color: #fff;
        .title {
          font-size: 0.6rem;
          color: #757575;
          display: block;
          margin: 0 auto;
          margin-top: 0.74rem;
          margin-bottom: 0.84rem;
        }
        ul.list {
          font-size: 0.42rem;
          color: #757575;
          margin: 0 0.81rem 0 0.57rem;
          margin-bottom: 0.8rem;
          li {
            text-align: left;
            margin-bottom: 0.28rem;
            display: flex;
          }
        }
        .button-group {
          border-top: solid 0.03rem #d0d0d0;
          display: flex;
          justify-content: center;
          align-items: center;
          button {
            height: 1.31rem;
            line-height: 1.31rem;
            font-size: 0.46rem;
            text-align: center;
            color: #12b7f5;
            background-color: #fff;
            // flex-grow:1;
            width: 46.5%;
          }
          button.cancel {
            color: #808080;
          }
          button:nth-of-type(1n + 2) {
            border-left: solid 0.03rem #d0d0d0;
          }
        }
      }
      .wrapper_foot {
        margin-top: 0.69rem;
        background-color: transparent;
        color: #ffffff;
        font-size: 0.42rem;
        display: flex;
        align-items: center;
        justify-content: center;
        i {
          margin-right: 0.17rem;
        }
      }
    }
  }
  .release-supply-box.open,
  .release-demand-box.open {
    .mask {
      display: block;
      opacity: 1;
      transform: scale3d(1, 1, 1);
    }
    .wrapper {
      transform: none;
      visibility: visible;
      opacity: 1;
    }
  }
}
</style>