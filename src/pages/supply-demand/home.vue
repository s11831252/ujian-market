<!--
 * @Author: SuChonghua
 * @Date: 2021-09-18 18:20:32
 * @LastEditTime: 2021-09-24 14:14:46
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\home.vue
-->
<template>
  <div class="root">
    <div class="head">
      <i class="icon">&#xe64d;</i>
      <span>南宁市行业市场</span>
    </div>
    <button class="post" @click="go({path:'/pages/supply-demand/release'})">发布供求</button>
    <div class="demand-box">
      <div class="demand-head">
        <span class="title">市场需求 (756+)</span>
        <span class="all">全部<i class="icon">&#xe601;</i></span>
      </div>
      <ul class="demand-list">
        <li>
          <span class="time">2小时</span>
          <span class="type e">企</span>
          <span class="title">需要求购钢筋素材需要求购钢铁筋素材需要求购钢筋素材需要求购钢铁筋素材</span>
        </li>
        <li>
          <span class="time">07/22</span>
          <span class="type p">项</span>
          <span class="title">需要求购钢筋素材需要求购钢铁筋素材需要求购钢筋素材需要求购钢铁筋素材</span>
        </li>
        <li>
          <span class="time">2小时</span>
          <span class="type e">企</span>
          <span class="title">需要求购钢筋素材需要求购钢铁筋素材需要求购钢筋素材需要求购钢铁筋素材</span>
        </li>
        <li>
          <span class="time">07/22</span>
          <span class="type p">项</span>
          <span class="title">需要求购钢筋素材需要求购钢铁筋素材需要求购钢筋素材需要求购钢铁筋素材</span>
        </li>
        <li>
          <span class="time">2小时</span>
          <span class="type e">企</span>
          <span class="title">需要求购钢筋素材需要求购钢铁筋素材需要求购钢筋素材需要求购钢铁筋素材</span>
        </li>
      </ul>
    </div>
    <ul class="banner">
      <li>
        <img src="../../../static/img/homeshare.jpg" />
        <span class="title">广西工程建设质量管理监督责任有限公...</span>
      </li>
      <li>
        <img src="../../../static/img/homeshare.jpg" />
        <span class="title">广西工程建设质量管理监督责任有限公...</span>
      </li>
      <li>
        <img src="../../../static/img/homeshare.jpg" />
        <span class="title">广西工程建设质量管理监督责任有限公...</span>
      </li>
    </ul>
    <div class="demand-box">
      <div class="demand-head">
        <span class="title">今日供应 (756+)</span>
        <span class="all">全部<i class="icon">&#xe601;</i></span>
      </div>
      <ul class="demand-list">
        <li>
          <span class="time">2小时</span>
          <span class="type s">商</span>
          <span class="title">需要求购钢筋素材需要求购钢铁筋素材需要求购钢筋素材需要求购钢铁筋素材</span>
        </li>
        <li>
          <span class="time">07/22</span>
          <span class="type g">个</span>
          <span class="title">需要求购钢筋素材需要求购钢铁筋素材需要求购钢筋素材需要求购钢铁筋素材</span>
        </li>
        <li>
          <span class="time">2小时</span>
          <span class="type e">企</span>
          <span class="title">需要求购钢筋素材需要求购钢铁筋素材需要求购钢筋素材需要求购钢铁筋素材</span>
        </li>
        <li>
          <span class="time">2小时</span>
          <span class="type s">商</span>
          <span class="title">需要求购钢筋素材需要求购钢铁筋素材需要求购钢筋素材需要求购钢铁筋素材</span>
        </li>
        <li>
          <span class="time">07/22</span>
          <span class="type g">个</span>
          <span class="title">需要求购钢筋素材需要求购钢铁筋素材需要求购钢筋素材需要求购钢铁筋素材</span>
        </li>
      </ul>
    </div>
    <div class="recommend-box">
        <div class="title">好店推荐</div>
        <ul class="recommend-list">
            <li>
                <div class="logo"><img src="../../../static/img/homeshare.jpg"></div>
                <div class="info">
                    <span class="name">广西铭祥南宁旗舰店</span>
                    <span class="maintype">
                        <span class="label">主营：</span>
                        <span>消防设备</span>
                    </span>
                </div>
            </li>
            <li>
                <div class="logo"><img src="../../../static/img/homeshare.jpg"></div>
                <div class="info">
                    <span class="name">广西铭祥南宁旗舰店</span>
                    <span class="maintype">
                        <span class="label">主营：</span>
                        <span>消防设备</span>
                    </span>
                </div>
            </li>
            <li>
                <div class="logo"><img src="../../../static/img/homeshare.jpg"></div>
                <div class="info">
                    <span class="name">广西铭祥南宁旗舰店</span>
                    <span class="maintype">
                        <span class="label">主营：</span>
                        <span>消防设备</span>
                    </span>
                </div>
            </li>
            <li>
                <div class="logo"><img src="../../../static/img/homeshare.jpg"></div>
                <div class="info">
                    <span class="name">广西铭祥南宁旗舰店</span>
                    <span class="maintype">
                        <span class="label">主营：</span>
                        <span>消防设备</span>
                    </span>
                </div>
            </li>
        </ul>
    </div>
  </div>
</template>
<script>
export default {};
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
    // justify-content: center;
    align-items: center;
    padding-left: 1.07rem;
    font-size: 0.43rem;
    color: #fff;
    i {
      margin-right: 0.15rem;
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
  .demand-box {
    background-color: #fff;
    margin: 0 0.32rem;
    padding: 0.55rem 0.45rem 0 0.45rem;
    border-radius: 0.2rem;
    .demand-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.37rem;
      border-bottom: 0.02rem solid #f2f2f2;
      span {
        display: flex;
        align-items: center;
        color: #333333;
        font-size: 0.4rem;
      }
      span.all{
          font-size: 0.38rem;
          line-height: 0.4rem;
          color: #999999;
      }
    }
    .demand-list {
      li {
        display: flex;
        align-items: center;
        padding: 0.45rem 0;
        border-bottom: 0.02rem solid #f2f2f2;
        span {
          flex-grow: 1;
          flex-shrink: 0;
        }
        .time {
          width: 1.08rem;
          height: 0.47rem;
          line-height: 0.47rem;
          background-color: #f3f8fe;
          color: #75aefb;
          border-radius: 0.06rem;
          margin-right: 0.28rem;
          font-size: 0.29rem;
        }
        .type {
          width: 0.42rem;
          height: 0.42rem;
          font-size: 0.29rem;
          border-radius: 0.07rem;
          margin-right: 0.12rem;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
        }
        .type.e {
          background-image: linear-gradient(86deg, #fe475d 0%, #ff6f88 100%);
        }
        .type.p {
          background-image: linear-gradient(85deg, #138df5 0%, #13b6f5 100%);
        }
        .type.s {
          background-image: linear-gradient(85deg, #fe7b20 0%, #ff9f29 100%);
        }
        .type.g {
          background-image: linear-gradient(85deg, #09cc6c 0%, #22dd7a 100%);
        }
        .title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex-shrink: 1;
          font-size: 0.43rem;
          color: #4d4d4d;
        }
      }
    }
  }
  .banner {
    display: flex;
    justify-content: space-around;
    margin: 0.26rem 0.26rem;
    padding: 0.35rem 0.35rem 0.49rem 0;
    background-color: #fff;
    color: #333333;
    border-radius: 0.26rem;
    li {
      text-align: center;
      width: 2.98rem;
      margin-left: 0.35rem;
      img {
        width: 2.98rem;
        height: 1.72rem;
        margin-bottom: 0.31rem;
      }
      span {
        display: block;
        font-size: 0.3rem;
        line-height: 0.47rem;
      }
    }
  }
  .recommend-box{
    padding: 0.38rem 0.34rem;
    margin:0.29rem 0.29rem;
    background-color: #ffffff;
	border-radius: 0.26rem;
      .title{
        text-align: left;
        margin-left: 0.1rem;
        font-size: 0.4rem;
        color: #333333;
        margin-bottom: 0.33rem;
      }
      .recommend-list{
          display: flex;
          flex-wrap:wrap;
          justify-content: space-between;
          li{
            display: flex;
            align-items: center;
            background-color: #f3fcff;
            border-radius: 0.26rem;
            margin-bottom: 0.18rem;
            padding: 0.13rem 0.2rem 0.13rem 0.15rem;
              .logo{
                  margin-right: 0.14rem;
                  img{
                    width: 1.05rem;
                    height: 1.05rem;
                    border-radius: 0.13rem;
                  }
              }
              .info{
                .name{
                    width: 3.2rem;
                    text-align: left;
                    display: block;
                    color: #343434;
                    font-size: 0.33rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                  .maintype{
                      text-align: left;
                      display: block;
                      font-size: 0.28rem;
                      color: #1abaf5;
                      .label{
                          color: #999999;
                      }
                  }

              }
          }
      }
  }
}
</style>