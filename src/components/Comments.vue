<template>
  <ul>
    <li class="comment-goods">评论商品：</li>
    <li>
       <!-- 子组件向父组件传值 给li绑定一个事件click -->
       <!-- Class 与 Style 绑定 good1样式 score是外面传进来的参数 当ture时 执行v-bind里面条件-->
      <span class="good " v-bind:class="{ good1: score==1 }" @click="click(1)">
        <i class="icon">&#xe643;</i>
        <p>好评</p>
      </span>
      <span class="good " v-bind:class="{ good2: score==3 }"  @click="click(3)">
        <i class="icon">&#xe63e;</i>
        <p>中评</p>
      </span>
      <span class="good " v-bind:class="{ good3: score==6 }"  @click="click(6)">
        <i class="icon">&#xe63f;</i>
        <p>差评</p>
      </span>
    </li>
  </ul>
</template>
<script>
export default {
  props:{
   index:Number,
  },
  data() {
    return {
      score: 1,//默认为好评
    };
  },
  methods: {
    click: function(s) {
      //把外面传进来的参数赋给score this,score指向于外面的score
      this.score = s;
       //使用$emit来触发一个自定义事件CommentModel，并传递一个参数score
       var obj = {
         //这里使用了s直接赋给了score是因为在上面通过this调用了外面的score
         score:s,
         index:this.index
       };
      //从外面传进来的参数 在响应click点击事件的函数中使用$emit来触发一个自定义事件CommentModel，并传递一个参数obj
       this.$emit("CommentModel",obj);
    }
  },
  //mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
 mounted(){
  this.$emit("CommentModel",{score:this.score,index:this.index});
  },
  // 页面显示/切入前台时触发
  onshow(){  
    this.$emit("CommentModel",{score:this.score,index:this.index});
  }
};
</script>


<style>
.comment {
  padding-top: 0.12rem;
  font-size: 0.36rem;
  color: #5c5c5c;
  padding-bottom: 0.21rem;
}
.comment-goods {
  float: left;
  line-height: 0.56rem;
}
.good img,.good i {
  height: 0.52rem;
  width: 0.52rem;
  font-size: 0.56rem;
  float: left;
}
.good p {
  float: left;
  line-height: 0.56rem;
  padding-left: 0.23rem;
  padding-right: 1.2rem;
}
.good1{
    color: #ff5252;
}
.good2{
    color: #ffa200;
}
.good3{
    color: #65b7fd;
}
</style>
