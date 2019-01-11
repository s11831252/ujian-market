<template>
  <div>
    <div class="shop_nr" @click="go({path:'/pages/shop/detail',query:{sId:sid,gId:goods.gId}})">
      <div class="dian"></div>
      <div class="nr_right">
        <img :src="goods.Images[0].Thumbnail_url" alt>
        <div class="contents">
          <p class="bt" v-html="_gName"></p>
          <div class="ft">
            <b>月售 {{goods.Month_Sales}}</b>
            <p class="comment">评论 {{goods.CommentCount}}</p>
          </div>
          <p class="money">￥{{goods.Price}}</p>
        </div>
      </div>
      <div class="fgx"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    goods: Object,
    keyword: String,
    sid: String
  },
  computed: {
    _gName() {
      if (this.goods) {
        var str = this.goods.gName.replace(
          this.keyword,
          `<b style="color:#d7000f;">${this.keyword}</b>`
        );
        return `<p style="color: #021218;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">${str}</p>`;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.search .main .demo .shop_nr {
  padding-left: 0.28rem;
}

.search .main .demo .shop_nr .dian {
  width: 0.14rem;
  height: 0.14rem;
  background-color: #12b7f5;
  margin-top: 1.08rem;
  margin-bottom: 1.08rem;
  float: left;
  margin-right: 0.36rem;
}

.search .main .demo .shop_nr .nr_right {
  overflow: hidden;
  padding-bottom: 0.35rem;
}

.search .main .demo .shop_nr .nr_right img {
  width: 2.3rem;
  height: 2.3rem;
  float: left;
  padding-top: 0.05rem;
  margin-right: 0.33rem;
}

.search .main .demo .shop_nr .nr_right .contents {
  overflow: hidden;
}

.search .main .demo .shop_nr .nr_right .contents .bt {
  color: #021218;
  font-size: 0.44rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.search .main .demo .shop_nr .nr_right .contents .bt b {
  font-weight: normal;
  color: #d7000f;
  display: inline;
}

.search .main .demo .shop_nr .nr_right .contents .ft {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #5c5c5c;
  margin-top: 0.28rem;
}

.search .main .demo .shop_nr .nr_right .contents .ft b {
  font-size: 0.4rem;
  float: left;
  font-weight: normal;
  margin-right: 1rem;
  height: 0.5rem;
}

.search .main .demo .shop_nr .nr_right .contents .ft .comment {
  font-size: 0.28rem;
  line-height: 0.55rem;
}

.search .main .demo .shop_nr .nr_right .contents .money {
  color: #f76b1b;
  font-size: 0.48rem;
  margin-top: 0.4rem;
  padding-bottom: 0.2rem;
}

.search .main .demo .shop_nr .fgx {
  border-top: solid #ecf0f1 0.01rem;
  height: 0.4rem;
}
</style>
