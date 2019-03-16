<template>
  <ul class="grade">
    <!-- 子组件向父组件传值 给li绑定一个事件click -->
    <!-- 绑定事件 直接绑定到一个方法-->
    <li @click="click(1)">
      <img src="/static/img/star.png" v-if="score>0">
      <img src="/static/img/star (2).png" v-else>
    </li>
    <li @click="click(2)">
      <img src="/static/img/star.png" v-if="score>1">
      <img src="/static/img/star (2).png" v-else>
    </li>
    <li @click="click(3)">
      <img src="/static/img/star.png" v-if="score>2">
      <img src="/static/img/star (2).png" v-else>
    </li>
    <li @click="click(4)">
      <img src="/static/img/star.png" v-if="score>3">
      <img src="/static/img/star (2).png" v-else>
    </li>
    <li @click="click(5)">
      <img src="/static/img/star.png" v-if="score>4">
      <img src="/static/img/star (2).png" v-else>
    </li>
    <li>{{scoreDisplay}}</li>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      score: 5,
      scoreDisplayStrArr:["非常差","差","一般","好","非常好"]
    };
  },
  methods: {
    //从外面传进来的参数 在响应click点击事件的函数中使用$emit来触发一个自定义事件Passingscore，并传递一个参数score
    click: function(score) {
      this.score = score;
      //使用$emit来触发一个自定义事件Passingscore，并传递一个参数score
      this.$emit("Passingscore", score);
    }
  },
  computed:{
    scoreDisplay(){
      return this.scoreDisplayStrArr[this.score-1];
    }
  },
  // 页面显示/切入前台时触发
  onShow() {
  
    this.$emit("Passingscore", this.score);
  },
  //mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
  mounted(){
    this.$emit("Passingscore", this.score);
  }
};
</script>


<style>
/* .logistics {
  font-size: 0.36rem;
  color: #5c5c5c;
  background-color: #ffffff;
  padding-top: 0.23rem;
  padding-left: 0.21rem;
  padding-bottom: 0.3rem;
} */
.grade li{
  padding-top: 0.23rem;
  padding-bottom: 0.3rem;
  display :inline-block;
  vertical-align:middle;
  text-align:center;
}
.grade img {
  width: 0.46rem;
  height: 0.44rem;
  float: left;
  /* display: inline-block; */
  margin:0 0.4rem;
}
/* .speed {
  float: left;
  padding-right: 0.84rem;
} */
</style>
