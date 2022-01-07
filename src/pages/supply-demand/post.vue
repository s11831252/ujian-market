<!--
 * @Author: SuChonghua
 * @Date: 2021-11-10 18:05:10
 * @LastEditTime: 2022-01-06 17:30:56
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\post.vue
-->
<template>
  <div class="root" v-if="detail">
    <div class="main">
      <div class="img-box">
        <img class="img" :src="imageFirst" />
        <span v-if="detail.info.listType==1||detail.info.listType==2" class="lab demand">需求</span>
        <span v-else-if="detail.info.listType==3||detail.info.listType==4||detail.info.listType==5" class="lab supply">供应</span>
      </div>
      <div class="info">
        <div class="title">
          <small class="e" v-if="detail.info.listType==1||detail.info.listType==5">企</small>
          <small class="p" v-if="detail.info.listType==2">项</small>
          <small class="s" v-if="detail.info.listType==4">商</small>
          <small class="g" v-if="detail.info.listType==3">个</small>
          <span>{{detail.info.title}}</span>
        </div>
        <div class="content">{{detail.info.content}}</div>
        <div class="position"><i class="icon">&#xe65e;</i>{{detail.info.cityName}}</div>
      </div>
    </div>
    <div class="tip">
      <p>发布费用为 <span>5元</span>或<span>1个{{detail.info.listType==1||detail.info.listType==2?'企业':'个人'}}发布点</span>，信息展示时间为<span>7天</span></p>
    </div>
    <div class="break"></div>
    <div class="pay-list" v-if="detail.info.listType==1||detail.info.listType==2">
      <div class="item" :class="{action:postData.type == 4}" @click="postData.type = 4">
        <i class="icon left">&#xe66b;</i>
        <span>U建钱包支付</span>
        <small>（钱包余额 ¥{{balance}}）</small>
        <i class="icon right">&#xe633;</i>
      </div>
      <div class="item" :class="{action:postData.type == 2}" @click="postData.type = 2">
        <i class="icon left">&#xe651;</i>
        <span>发布点支付</span>
        <small>（企业发布点{{ent_pointBalance}}）</small>
        <i class="icon right">&#xe633;</i>
      </div>
    </div>
    <div class="pay-list" v-else-if="detail.info.listType==3||detail.info.listType==4||detail.info.listType==5">
      <div class="item" :class="{action:postData.type == 3}" @click="postData.type = 3">
        <i class="icon left">&#xe66b;</i>
        <span>U建钱包支付</span>
        <small>（钱包余额 ¥{{balance}}）</small>
        <i class="icon right">&#xe633;</i>
      </div>
      <div class="item" :class="{action:postData.type == 1}" @click="postData.type = 1">
        <i class="icon left">&#xe651;</i>
        <span>发布点支付</span>
        <small>（个人发布点{{pointBalance}}）</small>
        <i class="icon right">&#xe633;</i>
      </div>
    </div>
    <div class="bottom">
      <div class="total">
        <p class="price">
          <span class="txt">总计：</span>
          <span v-if="postData.type==1||postData.type==2" class="val"><small></small><span>1</span>发布点</span>
          <span v-else-if="postData.type==3||postData.type==4" class="val"><small>￥</small><span>5.0</span></span>
        </p>
        <p v-if="postData.type==1||postData.type==2" class="tip">花费1个个人发布点支付</p>
        <p v-else-if="postData.type==3||postData.type==4" class="tip">花费5元支付</p>
      
      </div>
      <!-- <div class="detail" :class="{ open: openDetail }" @click="openDetail = true">
        <span>明细</span>
        <i class="icon">&#xe712;</i>
      </div> -->
      <button @click="modalOpen = true">确认支付</button>
    </div>
    <!-- <div class="detail-box" :class="{ open: openDetail }">
      <div class="mask"></div>
      <div class="wrapper" @click="openDetail = false">
        <div class="wrapper_body" @click.stop>
          <div class="box-top"><span>支付明细</span><i class="icon" @click="openDetail = false">&#xe613;</i></div>
          <div class="box-bottom">
            <div class="title">套餐明细</div>
            <div class="detail-info">
              <span class="name">50点企业发布点</span>
              <span class="price"><small>￥2800</small>￥0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <vaildCodeBox :openModal="modalOpen" @close="modalOpen = false" :priceStr="postData.type==1||postData.type==2?'1发布点':'￥5.0'" :inputBefore="codeBefore" :inputComplete="codeComplete"></vaildCodeBox>
  </div>
</template>
<script>
import vaildCodeBox from "../../components/validCodeBox";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    vaildCodeBox,
  },
  data() {
    return {
      openDetail: false,
      modalOpen: false,
      balance:0,
      pointBalance:0,
      ent_pointBalance:0,
      detail:null,
      postData: {
        listId: 0,
        type: 0,
        verificationCode: "",
        userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      },
    };
  },
  computed:{
    ...mapState({
        userInfo: (state) => state.User.UserInfo,
    }),
    imageFirst() {
      if (this.detail&&this.detail.ext && this.detail.ext.length> 0) 
      {
        var imgItem = this.detail.ext.find((item) => {
          return (item.ext.extType == 1);
        });
        if(imgItem)
          return imgItem.ext.extContent
        else return "";
      }
      else
        return "";
    },
  },
  methods: {
    async codeBefore() {
      var rep = await this.$SupplyAndDemandAPI.SupplyAndDemand_SendPayCode();
      if (rep.ret == 0) {
        return true;
      }
    },
    async codeComplete(code){
      this.postData.verificationCode = code;
      var rep  = await this.$SupplyAndDemandAPI.SupplyAndDemand_Pay(this.postData);
      if(rep.ret == 0&&rep.data)
      {
        this.$router.push({path:'/pages/supply-demand/post-ok',query:{listId:this.postData.listId}})
      }else
      {
        this.toast(rep.msg)
      }
    }
  },
  async mounted() {
    if(this.$route.query.listId)
    {
      this.postData.listId=this.$route.query.listId;
      this.userId = this.userInfo.UserId;
      var rep = await this.$SupplyAndDemandAPI.SupplyAndDemand_Detail(this.$route.query.listId)
      if(rep.ret == 0)
      {
        this.detail = rep.data;
        //设置默认支付方式
        if(this.detail.info.listType==1||this.detail.info.listType==2)
        {
          this.postData.type=4
        }else if(this.detail.info.listType==3||this.detail.info.listType==4||this.detail.info.listType==5)
        {
          this.postData.type=3
        }
      }
      this.$SupplyAndDemandAPI.HallMoney_Balance().then(rep1=>{
        if (rep1.ret == 0) {
          this.pointBalance= rep1.data.selfMoney;
          this.ent_pointBalance = rep1.data.enterpriseMoney
        }
      });

      this.$UJAPI.Balance_Purse().then(rep2=>{
        if (rep2.ret == 0) {
          this.balance = rep2.data
        }
      });

    }

  },
};
</script>
<style lang="scss" scoped>
.root {
  .main {
    display: flex;
    justify-items: center;
    align-items: center;
    margin: 0.55rem 0.37rem 0 0.37rem;
    padding-bottom: 0.7rem;
    border-bottom: 0.03rem solid #e4e4e4;
    .img-box {
      position: relative;
      margin-right: 0.42rem;
      img {
        width: 2.08rem;
        height: 2.08rem;
      }
      .lab {
        position: absolute;
        right: -0.1rem;
        top: -0.1rem;
        border-radius: 0.1rem;
        color: #fff;
        font-size: 0.3rem;
        width: 0.82rem;
        height: 0.48rem;
        line-height: 0.48rem;
        text-align: center;
      }
      .lab.supply {
        background-image: linear-gradient(-31deg, #4d77ff 0%, #4da9ff 100%);
      }
      .lab.demand {
          	background-image: linear-gradient(-31deg, 
		#ff7f4d 0%, 
		#ffa54d 100%);
      }
    }
    .info {
      flex-grow: 1;
      width: 7.39rem;
      .title {
        color: #333333;
        font-size: 0.44rem;
        display: flex;
        justify-items: center;
        align-items: center;
        margin-bottom: 0.31rem;
        small{
          width: 0.42rem;
          height: 0.42rem;
          line-height: 0.42rem;
          text-align: center;
          margin-right: 0.09rem;
          font-size: 0.26rem;
          color: #fff;
        }
        small.p{
          background-image: linear-gradient(85deg, #138df5 0%, #13b6f5 100%);
        }
        small.e {
          background-image: linear-gradient(86deg, #fe475d 0%, #ff6f88 100%);
        }
        small.s {
          background-image: linear-gradient(85deg, #fe7b20 0%, #ff9f29 100%);
        }
        small.g {
          background-image: linear-gradient(85deg, #09cc6c 0%, #22dd7a 100%);
        }
      }
      .content {
        font-size: 0.42rem;
        color: #1a1a1a;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        margin-bottom: 0.39rem;
      }
      .position {
        display: flex;
        justify-items: center;
        align-items: center;
        font-size: 0.4rem;
        color: #888888;
        .icon {
          margin-right: 0.13rem;
          color: #08bb91;
        }
      }
    }
  }
  & > .tip {
    text-align: center;
    width: 100%;
    margin: 0.62rem 0 0.76rem 0;
    font-size: 0.35rem;
    color: #8c8c8c;
    span {
      color: #666666;
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
        font-size: 0.6rem;
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
          align-items: baseline;
          small {
            font-size: 0.4rem;
          }
          span {
            font-weight: bold;
            font-size: 0.8rem;
            line-height: 0.55rem;
          }
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