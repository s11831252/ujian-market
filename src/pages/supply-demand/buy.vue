<!--
 * @Author: SuChonghua
 * @Date: 2021-10-13 10:28:51
 * @LastEditTime: 2022-01-07 17:53:00
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\buy.vue
-->
<template>
  <div class="root">
    <div class="top">
      <i class="icon">&#xe651;</i><span>当前剩余个人发布点 {{ selfMoney }} </span><span> 企业发布点 {{ enterpriseMoney }}</span>
    </div>
    <div class="tab-select">
      <div class="item" :class="{ action: type == 2 }" @click="type = 2">
        企业发布点
        <img src="../../../static/img/buy_tab1.png" />
      </div>
      <div class="item" :class="{ action: type == 1 }" @click="type = 1">
        个人发布点
        <img src="../../../static/img/buy_tab2.png" />
      </div>
    </div>
    <img class="fenjie" src="../../../static/img/fenjie.png" />
    <div class="grade-list">
      <div class="item" v-for="(item, index) in pointsPriceList" :key="index" :class="{ action: selectItem && selectItem.price == item.price }" @click="selectGrade(item)">
        <div class="price">
          <i>￥</i><span>{{ item.price }}</span>
        </div>
        <div class="tip">{{ item.points }}点{{ type == 1 ? "个人" : "企业" }}发布点</div>
        <div class="label" v-if="discount < 1">享受{{ discount * 10 }}折特惠</div>
      </div>
      <!-- <div class="item" :class="{action:selectItem.price==600}" @click="selectGrade(600)">
                <div class="price"><i>￥</i><span>600</span></div>
                <div class="tip">10点企业发布点</div>
                <div class="label">享受0折特惠</div>
            </div>
            <div class="item" :class="{action:selectItem.price==1200}" @click="selectGrade(1200)">
                <div class="price"><i>￥</i><span>1200</span></div>
                <div class="tip">20点企业发布点</div>
                <div class="label">享受0折特惠</div>
            </div>
            <div class="item" :class="{action:selectItem.price==2800}" @click="selectGrade(2800)">
                <div class="price"><i>￥</i><span>2800</span></div>
                <div class="tip">50点企业发布点</div>
                <div class="label">享受0折特惠</div>
            </div> -->
    </div>
    <div class="getcode" v-if="selectItem" @click="go({ path: '/pages/supply-demand/discount-code', query: { points: selectItem.points, type: type } })"><span>获取推荐码</span><i class="icon">&#xe638;</i></div>
    <div class="break"></div>
    <div class="pay-list">
      <div class="item action">
        <i class="icon left">&#xe66b;</i>
        <span>U建钱包支付</span>
        <small>（钱包余额¥{{ balance }}）</small>
        <i class="icon right">&#xe633;</i>
      </div>
    </div>
    <div class="break"></div>
    <div class="bottom" v-if="selectItem">
      <div class="total">
        <p class="price">
          <span class="txt">总计：</span>
          <span class="val"
            ><small>￥</small><span>{{ discount_Price }}</span></span
          >
          <span class="discount" v-if="selectItem && selectItem.price - discount_Price > 0">已优惠¥{{ selectItem.price - discount_Price }}</span>
        </p>
        <p class="tip">购买{{ selectItem.points }}点{{ type == 1 ? "个人" : "企业" }}发布点</p>
      </div>
      <div class="detail" :class="{ open: openDetail }" @click="openDetail = true">
        <span>明细</span>
        <i class="icon">&#xe712;</i>
      </div>
      <button @click="modalOpen = true">确认支付</button>
    </div>
    <div class="detail-box" :class="{ open: openDetail }" v-if="selectItem">
      <div class="mask"></div>
      <div class="wrapper" @click="openDetail = false">
        <div class="wrapper_body" @click.stop>
          <div class="box-top"><span>支付明细</span><i class="icon" @click="openDetail = false">&#xe613;</i></div>
          <div class="box-bottom">
            <div class="title">套餐明细</div>
            <div class="detail-info">
              <span class="name">{{ selectItem.points }}点{{ type == 1 ? "个人" : "企业" }}发布点</span>
              <span class="price"
                ><small v-if="selectItem && selectItem.price - discount_Price > 0">￥{{ selectItem.price }}</small
                >￥{{ discount_Price }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <vaildCodeBox :openModal="modalOpen" @close="modalOpen = false" v-if="selectItem" :price="selectItem.price" :inputBefore="codeBefore" :inputComplete="codeComplete"></vaildCodeBox>
  </div>
</template>
<script>
import vaildCodeBox from "../../components/validCodeBox";

export default {
  components: {
    vaildCodeBox,
  },
  data() {
    return {
      modalOpen: false,
      discount: 1,
      discount_key: null,
      discount_code: null,
      selectItem: null,
      openDetail: false,
      balance: 0,
      type: 1,
      selfMoney: 0,
      enterpriseMoney: 0,
      pointsPriceList: [
        {
          points: 4,
          price: 300,
        },
        {
          points: 10,
          price: 600,
        },
        {
          points: 20,
          price: 1200,
        },
        {
          points: 50,
          price: 2800,
        },
      ],
    };
  },
  computed: {
    //根据折扣计算优惠价
    discount_Price() {
      if (this.selectItem) {
        if (this.discount) {
          return (this.selectItem.price * this.discount).toFixed(0);
        }
      }
      return 0;
    },
  },
  methods: {
    selectGrade(item) {
      this.selectItem = item;
    },
    async codeBefore() {
      var rep = await this.$SupplyAndDemandAPI.SupplyAndDemand_SendPayCode({});
      if (rep.ret == 0) {
        return true;
      }
    },
    async codeComplete(code) {
      var that = this;
      if (this.selectItem) {
        if (this.discount_key) {
          this.$SupplyAndDemandAPI
            .HallMoney_Buy({
              money: this.discount_Price,
              undisMoney: this.selectItem.price,
              key: this.discount_key,
              code: this.discount_code,
              type: this.type,
              verificationCode: code,
            })
            .then((rep) => {
              if (rep.ret == 0 && rep.data) {
                that.replace({ path: "/pages/supply-demand/pay-ok", query: { points: that.selectItem.points, type: this.type } });
              } else if (rep.ret == 0) {
                that.toast(rep.msg);
              }
            });
        } else {
          this.$SupplyAndDemandAPI
            .HallMoney_Buy({
              money: this.discount_Price,
              undisMoney: this.selectItem.price,
              type: this.type,
              verificationCode: code,
            })
            .then((rep) => {
              if (rep.ret == 0 && rep.data) {
                that.replace({ path: "/pages/supply-demand/pay-ok", query: { points: that.selectItem.points, type: this.type } });
              } else if (rep.ret == 0) {
                that.toast(rep.msg);
              }
            });
        }
        that.modalOpen = false;
      } else {
        this.toast("请选择套餐");
      }
    },
  },
  async mounted() {
    // console.log(this.detail,this.postData)
    if (this.$route.query.key && this.$route.query.code) {
      this.discount_key = this.$route.query.key;
      this.discount_code = this.$route.query.code;
      this.$SupplyAndDemandAPI.Rank_GetDiscountMoney(this.discount_key, this.discount_code).then((rep) => {
        if (rep.ret == 0) {
          this.discount = rep.data;
          // this.toast(`成功获得${rep.data*10}折优惠`);
        }
      });
    }
    if(this.$route.query.type)
    {
      this.type = parseInt(this.$route.query.type)
    }
    if(this.$route.query.points)
    {
      var _query_points = parseInt(this.$route.query.points);
      var _item =  this.pointsPriceList.find(item=>{
        return item.points == _query_points;
      })
      if(_item)
        this.selectGrade(_item);
      else
        this.selectGrade(this.pointsPriceList[0]);
    }else
    {
      this.selectGrade(this.pointsPriceList[0]);
    }
    
    var rep1 = await this.$SupplyAndDemandAPI.HallMoney_Balance();
    if (rep1.ret == 0) {
      this.selfMoney = rep1.data.selfMoney;
      this.enterpriseMoney = rep1.data.enterpriseMoney;
    }
    var rep2 = await this.$UJAPI.Balance_Purse();
    if (rep2.ret == 0) {
      this.balance = rep2.data;
    }
  },
};
</script>
<style lang="scss" scoped>
.root {
  .top {
    margin-top: 0.74rem;
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    color: #333333;
    font-size: 0.4rem;
    i {
      margin-left: 0.58rem;
      margin-right: 0.13rem;
    }
    span {
      margin-right: 0.28rem;
    }
  }
  .tab-select {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 0.58rem;
    color: #75430e;
    font-size: 0.48rem;
    .item {
      position: relative;
      width: 4.64rem;
      height: 1.6rem;
      line-height: 1.6rem;
      text-align: center;
      border-radius: 0.3rem;
      border: solid 0.03rem #dbdad8;
      img {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 1.57rem;
        height: 0.92rem;
        opacity: 0.25;
      }
    }
    .item.action {
      background-image: linear-gradient(-25deg, #fff9ef 0%, #fff9f4 100%);
      border-radius: 0.3rem;
      border: solid 0.03rem #cb9952;
    }
  }
  .fenjie {
    height: 0.48rem;
    width: 100%;
  }
  .grade-list {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 0.8rem;
    margin-bottom: 0.39rem;
    .item {
      width: 4.22rem;
      height: 2.51rem;
      position: relative;
      display: flex;
      align-items: center;
      align-content: center;
      flex-wrap: wrap;
      justify-content: center;
      margin-left: 0.41rem;
      margin-bottom: 0.38rem;
      background-color: #ffffff;
      border-radius: 0.3rem;
      border: solid 0.03rem #dbdad8;
      &:nth-of-type(2n + 1) {
        margin-left: 0;
      }
      .price {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        i {
          font-size: 0.42rem;
        }
        span {
          font-size: 0.9rem;
        }
      }
      .tip {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666666;
        font-size: 0.32rem;
      }
      .label {
        display: none;
        position: absolute;
        left: 0;
        top: -0.24rem;
        width: 2.75rem;
        height: 0.7rem;
        font-size: 0.38rem;
        text-align: center;
        line-height: 0.7rem;
        color: #fff;
        background-image: linear-gradient(65deg, #f84a4c 0%, #fe663f 54%, #fe2724 100%);
        border-radius: 0.3rem 0rem 0.3rem 0rem;
      }
    }
    .item.action {
      width: 4.16rem;
      height: 2.45rem;
      background-color: #fff9ef;
      border-color: rgba(197, 131, 45, 0.2);
      border-width: 0.06rem;
      .label {
        display: block;
      }
    }
  }
  .break {
    width: 100%;
    height: 0.19rem;
    background-color: #eff3f6;
  }
  .pay-list {
    .item {
      display: flex;
      align-items: center;
      margin: 0.65rem 0;
      i.left {
        width: 0.69rem;
        height: 0.69rem;
        line-height: 0.69rem;
        margin-left: 0.48rem;
        margin-right: 0.4rem;
        font-size: 0.69rem;
        background-color: #3b88f2;
        color: #fff;
        border-radius: 0.08rem;
      }
      i.right {
        background-image: #fff;
        color: #fff;
        border-radius: 50%;
        width: 0.61rem;
        height: 0.61rem;
        line-height: 0.61rem;
        text-align: center;
      }
      span {
        font-size: 0.42rem;
        color: #000000;
      }
      small {
        width: 50%;
        font-size: 0.35rem;
        color: #666666;
      }
    }
    .item.action {
      i.right {
        background-image: linear-gradient(174deg, #f5cb95 0%, #cb9952 100%);
      }
    }
  }
  .getcode {
    font-size: 0.4rem;
    color: #666666;
    margin: 0 1rem 0.48rem 0rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    i {
      margin-left: 0.18rem;
      font-size: 0.3rem;
    }
  }
  .bottom {
    display: flex;
    border-top: 0.03rem solid #f4f4f4;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    .total {
      flex-grow: 1;
      margin-left: 0.38rem;
      .price {
        display: flex;
        align-items: center;
        .txt {
          font-size: 0.52rem;
          color: #222222;
        }
        .val {
          color: #bf822f;
          display: flex;
          align-items: center;
          small {
            font-size: 0.4rem;
          }
          span {
            font-weight: bold;
            font-size: 0.8rem;
            line-height: 0.25rem;
          }
        }
        .discount {
          margin-left: 0.14rem;
          font-size: 0.28rem;
          color: #989898;
        }
      }
      .tip {
        font-size: 0.28rem;
        color: #989898;
      }
    }
    .detail {
      display: flex;
      align-items: center;
      width: 1.64rem;
      font-size: 0.42rem;
      color: #bf822f;
      padding-bottom: 0.3rem;
      i {
        transition: transform 300ms ease-out;
        transform: rotate(0deg);
      }
    }
    .detail.open {
      i.icon {
        transform: rotate(180deg);
      }
    }
    button {
      width: 3.67rem;
      height: 1.56rem;
      line-height: 1.56rem;
      text-align: center;
      background-image: linear-gradient(-38deg, #353535 0%, #4e4e4e 100%);
      font-size: 0.54rem;
      color: #ecc187;
    }
  }
  .detail-box {
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
      align-items: flex-end;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      transform: translateY(100%);
      visibility: hidden;
      opacity: 0;
      transition: opacity 700ms ease-out, transform 300ms ease-out, visibility 700ms ease-out;
      .wrapper_body {
        width: 100%;
        background-color: #fff;
        .box-top {
          font-size: 0.48rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.48rem;
          border-bottom: 0.02rem solid #dbdad8;
        }
        .box-bottom {
          font-size: 0.48rem;
          padding: 0.48rem;
          padding-bottom: 1.6rem;
          .title {
            text-align: left;
            font-size: 0.48rem;
            font-weight: 500;
            margin-bottom: 0.4rem;
          }
          .detail-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .name {
              font-size: 0.4rem;
            }
            .price {
              font-size: 0.38rem;
              color: #999;
              display: flex;
              align-items: center;
              small {
                color: #dbdad8;
                font-size: 0.35rem;
                text-decoration: line-through;
              }
            }
          }
        }
      }
    }
  }
  .detail-box.open {
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