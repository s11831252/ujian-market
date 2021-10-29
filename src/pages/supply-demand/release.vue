<!--
 * @Author: SuChonghua
 * @Date: 2021-09-24 14:10:37
 * @LastEditTime: 2021-10-20 11:47:42
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\release.vue
-->
<template>
  <div class="root">
    <div class="block top">
      <span class="txt">您好！您想要</span>
      <span class="grade" style="margin-right: 0.3rem"><i class="icon">&#xe6bc;</i>个人发布点 35</span>
      <span class="grade"><i class="icon">&#xeb19;</i>企业发布点 35</span>
    </div>
    <div class="block action">
      <div class="btn blue" @click="demandBox_open=true">
        <span>我有需求</span>
        <img src="../../../static/img/release_img1.png">
      </div>
      <div class="btn green" @click="supplyBox_open = true">
        <span>我要供应</span>
        <img src="../../../static/img/release_img2.png">
      </div>
    </div>
    <div class="block buy" @click="go({path:'/pages/supply-demand/buy'})">
      <span class="label">购买服务</span>
      <span class="remarks">发布成功每条将消耗一个点数<i class="icon">&#xe638;</i></span>
    </div>
    <div class="block tip">
      <div class="label">发布点说明</div>
      <div class="remarks">
        <p><span>1、</span><span>发布点可用于支付发布供需的费用，个人供应扣除1点个人发布点/条，企业供应/需求、店铺供应、项目供应/需求扣除1点企业发布点/条。</span></p>
        <p>2、每条供需信息的展示时间为7天。</p>
      </div>
    </div>
    <div class="release-supply-box" :class="{ open: supplyBox_open }">
      <div class="mask"></div>
      <div class="wrapper" @click="supplyBox_open = false">
        <div class="wrapper_body">
          <div class="menu">
            <div class="item" @click="go({path:'/pages/supply-demand/release-form',query:{listType:5}})">发布企业供应</div>
            <div class="item" @click="go({path:'/pages/supply-demand/release-form',query:{listType:4}})">发布店铺供应</div>
            <div class="item" @click="go({path:'/pages/supply-demand/release-form',query:{listType:3}})">发布个人供应</div>
          </div>
          <button @click="supplyBox_open = false">取消</button>
        </div>
      </div>
    </div>
    <div class="release-demand-box" :class="{ open: demandBox_open }">
      <div class="mask"></div>
      <div class="wrapper" @click="demandBox_open = false">
        <div class="wrapper_body">
          <div class="menu">
            <div class="item" @click="go({path:'/pages/supply-demand/release-form',query:{listType:1}})">发布企业需求</div>
            <div class="item" @click="go({path:'/pages/supply-demand/release-form',query:{listType:2}})">发布项目需求</div>
          </div>
          <button @click="demandBox_open = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      supplyBox_open: false,
      demandBox_open: false,
    };
  },
};
</script>
<style; lang="scss" scoped>
.root {
  padding: 0 0.42rem;
  .block {
    padding: 0.4rem 0;
    border-bottom: 0.03rem solid #f2f2f2;
  }
  .block.top {
    align-items: center;
    display: flex;
    span.txt {
      flex-grow: 1;
      font-size: 0.32rem;
      color: #999999;
    }
    span.grade {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3.35rem;
      height: 0.84rem;
      background-color: #fafafa;
      border-radius: 0.2rem;
      font-size: 0.33rem;
      color: #333333;
      i {
        margin-right: 0.08rem;
      }
    }
  }
  .block.action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .btn {
      line-height: 1.7rem;
      text-align: left;
      width: 4.76rem;
      height: 1.7rem;
      border-radius: 0.3rem;
      color: #fff;
      font-size: 0.44rem;
      position: relative;
      overflow: hidden;
      span{
        margin-left: 0.44rem;
      }
      img{
        position: absolute;
        right: 0;
        bottom: 0;
        width: 1.51rem;
        height: 1.32rem;
      }
    }
    .btn.blue {
      background-color: #0166ff;
    }
    .btn.green {
      background-color: #37cba7;
    }
  }
  .block.buy {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label {
      color: #333333;
      font-size: 0.38rem;
      margin-left: 0.48rem;
    }
    .remarks {
      display: flex;
      align-items: center;
      margin-right: 0.45rem;
      font-size: 0.3rem;
      color: #999999;
      i {
        margin-left: 0.28rem;
      }
    }
  }
  .block.tip {
    background-color: #fafafa;
    border-radius: 0.2rem;
    .label {
      margin-left: 0.48rem;
      font-size: 0.38rem;
      color: #333333;
      margin-bottom: 0.89rem;
    }
    .remarks {
      margin: 0 0.91rem;
      color: #999999;
      font-size: 0.3rem;
      p {
        display: flex;
        justify-content: start;
        margin-bottom: 0.4rem;
      }
    }
  }
  .release-supply-box,.release-demand-box {
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
        .menu {
          background-color: #fff;
          border-radius: 0.2rem;
            padding: 0 0.35rem;
          .item {
            font-size: 0.5rem;
            color: #444444;
            padding: 0.84rem 2.76rem;
            border-bottom: 0.02rem solid #f2f2f2;
          }
        }
        button{
            margin-top: 0.36rem;
            padding: 0.6rem 0;
            background-color: #fff;
            color: #808080;
            border-radius: 0.2rem;
        }
      }
    }
  }
  .release-supply-box.open,.release-demand-box.open {
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