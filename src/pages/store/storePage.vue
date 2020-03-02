<template>
  <div>
    <!-- 头部 -->
    <div class="top">
      <div class="tubiao">
        <div class="icon">&#xe616;</div>
        <div class="icon">&#xe6f1;</div>
        <div class="icon">&#xe60f;</div>
      </div>
      <div class="two">
        <img
          src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2601702678,2203031457&fm=26&gp=0.jpg"
          alt
        />
        <div class="information">
          <ul class="informationNr">
            <li>
              <span>店铺的名称</span>
              <span class="icon">&#xe642;</span>
            </li>
            <li>
              <span>主营类目：</span>
              <span>主材</span>
            </li>
            <li>
              <span>当前身份：</span>
              <span class="jinru">超级管理员</span>
              <span>进入店铺</span>
              <span class="icon">&#xe629;</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 店铺数据 -->
    <div class="data">
      <div class="chunk">
        <span class="number" style="color: #ee6575;">748</span>
        <span class="unit">元</span>
        <p>今日成交</p>
      </div>
      <div class="chunk">
        <span class="number" style="color: #72b0f7;">6</span>
        <span class="unit">单</span>
        <p>成交单数</p>
      </div>
      <div class="chunk">
        <span class="number" style="color: #63d3bd;">86</span>
        <span class="unit">人</span>
        <p>今日访客</p>
      </div>
    </div>
    <!--数据评分 -->
    <div class="middle">
      <div class="middleNr">
        <div>
          <span class="dianpu">店铺综合评分:</span>
          <span class="shuzi" style="color:#46b7ff;">4.5</span>
        </div>
        <div>
          <span class="particulars">查看详情</span>
          <span class="particulars">&gt;</span>
        </div>
      </div>
      <div class="quality">
        <div class="grade">
          <span>质量 :</span>
          <span style="color:#ff8533;">4.4</span>
        </div>
        <div class="grade">
          <span>速度 ：</span>
          <span style="color:#63c230;">4.8</span>
        </div>
        <div class="grade">
          <span>服务 ：</span>
          <span style="color:#f96268;">4.1</span>
        </div>
      </div>
    </div>
    <!-- 各个服务小窗口 -->
    <div>
      <div class="window">
        <div class="windowNr">
          <div class="icon" style="color: #f96268;background-color: #ffeef3;">&#xe675;</div>
          <span>商品管理</span>
        </div>
        <div class="windowNr">
          <div class="icon" style="color: #f96268;background-color: #ffeef3;">&#xe653;</div>
          <span>订单管理</span>
        </div>
      </div>
       <div class="window">
        <div class="windowNr">
          <div class="icon" style="color: #ffecdf;background-color:  #ff8533;">&#xe611;</div>
          <span>运营</span>
        </div>
        <div class="windowNr">
          <div class="icon" style="color: #ffecdf;background-color:  #ff8533;">&#xe667;</div>
          <span>提现</span>
        </div>
      </div>
      <div class="window">
        <div class="windowNr" @click="go({path:'/pages/store/service'})">
          <div class="icon" style="color: #e3f4ff;background-color:#4cb8fd;">&#xe622;</div>
          <span>客服管理</span>
        </div>
        <div class="windowNr">
          <div class="icon" style="color: #e3f4ff;background-color:#4cb8fd;">&#xe62f;</div>
          <span>物流管理</span>
        </div>
      </div>
       <div class="window">
        <div class="windowNr">
          <div class="icon" style="color: #ddffca;background-color:#63c230;">&#xe669;</div>
          <span>数据统计</span>
        </div>
        <div class="windowNr">
          <div class="icon" style="color: #ddffca;background-color:#63c230;">&#xe66f;</div>
          <span>店铺管理</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.top {
  background-image: url("http://img.sccnn.com/bimg/337/31661.jpg");
  width: 100%;
  height: 4.37rem;
  margin-top: 0rem;
  background-color: red;
}
.tubiao {
  float: right;
  display: flex;
  justify-content: center;
}
.tubiao div {
  color: #ffffff;
  /* width: 0.58rem;
  height: 0.58rem; */
  font-size: 0.6rem;
  margin-right: 0.43rem;
  margin-top: 0.36rem;
}
.two {
  padding-top: 2.16rem;
}
.two img {
  width: 2.48rem;
  height: 2.48rem;
  background-color: #ffffff;
  box-shadow: 0rem 0.03rem 0.08rem 0rem rgba(8, 2, 4, 0.08);
  border-radius: 0.1rem;
  margin-left: 0.28rem;
  float: left;
}
.information {
  list-style: none;
  margin-left: 3.07rem;
  font-size: 0.4rem;
  color: #ffffff;
}
.informationNr li:first-child {
  font-size: 0.58rem !important;
}
.informationNr li {
  padding-bottom: 0.18rem;
}
.informationNr li:nth-child(3) {
  padding-bottom: 0rem !important;
}
.informationNr li span {
  padding-right: 0.32rem;
}
.jinru {
  padding-right: 1rem !important;
}
.data {
  width: 100%;
  display: flex;
  border-bottom: 0.02rem solid #e6e6e6;
  overflow: hidden;
}
.chunk {
  flex: 1;
  text-align: center;
  padding-top: 0.63rem;
}
.number {
  font-size: 0.66rem;
  padding-right: 0.18rem;
}
.unit {
  font-size: 0.32rem;
  color: #393939;
}
.chunk p {
  font-size: 0.4rem;
  color: #393939;
  padding-top: 0.4rem;
  padding-bottom: 0.52rem;
}
.middleNr {
  /* height: 1.34rem;
  line-height: 1.34rem; */
  border-bottom: 0.03rem solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  font-size: 0;
  padding: 0.44rem 0.33rem;
}
.dianpu {
  font-size: 0.4rem;
  /* padding-left: 0.34rem;
  padding-right: 0.25rem; */
}
.shuzi {
  padding-left: 0.16rem;
  font-size: 0.5rem;
  /* padding-right: 5.2rem; */
}
.particulars {
  font-size: 0.35rem;
  color: #999999;
  padding-right: 0.25rem;
}
.quality {
  display: flex;
  height: 1.95rem;
  border-bottom: 0.03rem solid #e8e8e8;
}
.grade {
  line-height: 1.95rem;
  flex: 1;
  font-size: 0.4rem;
  text-align: center;
}
.grade span:nth-child(1) {
  padding-right: 0.2rem;
}
.window {
  width: 100%;
  height: 2.04rem;
  display: flex;
  border-bottom: 0.03rem solid #e8e8e8;
}
.windowNr {
  display: flex;
  align-items: center;
  flex: 1;
}
.windowNr:nth-child(1) {
  border-right: 0.03rem solid #e8e8e8;
}
.windowNr div {
  width: 1.16rem;
  height: 1.16rem;
  text-align: center;
  line-height: 1.16rem;
  font-size: 0.6rem;
  border-radius: 50%;
  margin-left: 0.71rem;
  margin-right: 0.32rem;
}
.windowNr span {
    font-size: 0.4rem;
    color: #000000;
}
</style>