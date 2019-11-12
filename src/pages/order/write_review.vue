<template>
  <div class="content">
    <!-- 订单信息 -->
    <div class="OrderInfo">
      <ul class="OrderId">
        <li class="OrderNo">订单号:</li>
        <li>{{ orderInfo.OrderNo}}</li>
      </ul>
      <div v-for="(item, index) in orderInfo.Order_Goods_items" v-bind:key="index">
        <ul class="shoppingcarList">
          <li class="comment">评论商品：</li>
          <li>
            <span class="goods-img">
              <img :src="item.Image_url	">
            </span>
            <span class="goods-info">
              <p class="goods-name">{{item.gName}}</p>
              <p class="goods-price">单价：<span class="goods-price-num">¥{{item.Price}}</span>/件 <span> (规格：{{item.ItemName?item.ItemName:"默认"}})</span></p>
            </span>
          </li>
        </ul>
        <!-- 商家评论 -->
        <ul class="comment">
          <Comments v-bind:index="index" v-on:CommentModel="goodsCommentModel"></Comments>
        </ul>
        <!-- 文本框 -->
        <textarea class="textarea" v-on:input="Commentsmethod(index,$event)" placeholder="写下您的评价，我们将不断改进希望能满足您的需求，您的宝贵意见也能帮助到其他小伙伴哦~"></textarea>
        <!-- 上传凭证 -->
        <!-- <div class="Images" v-for="(item1,index1) in imgArray" :key="index1">
          <img :src="item1">
        </div>
        <div class="Images"  @click="chooseImage(index)" v-if="imgArray.length==0">
          <img src="/static/img/Images.png">
        </div> -->
      </div>
    </div>
    <!-- 商品质量 -->
    <ul class="logistics">
      <li class="speed">商品质量</li>
      <grade v-on:Passingscore="Processingscores"></grade>
      
    </ul>
    <!-- 物流速度 -->
    <ul class="logistics">
      <li class="speed">物流速度</li>
      <grade v-on:Passingscore="Speedmethod"></grade>
    </ul>
    <!-- 商家服务 -->
    <ul class="logistics">
      <li class="speed">商家服务</li>
      <grade v-on:Passingscore="Servicemethod"></grade>
    </ul>
    <button class="submit" @click="submit">发布</button>
  </div>
</template>
<script>
import { mapState } from "vuex";

import grade from "@/components/grade"; //引入评论星星组件
import Comments from "@/components/Comments";
export default {
  data() {
    return {
      sId: "",
      orderInfo: {},
      postData: {
        OrderId: "",
        UserId: "",
        sId: "",
        Quality: 0,
        Speed: 0,
        Service: 0,
        goodsCommentModelList: []
      },
       imgArray:[],
       uploadfilenames:[]
    };
  },
  computed: {
    ...mapState({
      //当前登录用户
      UserInfo: state => state.User.UserInfo
    })
  },
  //在components使用组件
  components: {
    grade,
    Comments
  },
  methods: {
     //选择图片
    chooseImage(index){
      var that = this;
      if (this.imgArray.length < 9) {
        wx.chooseImage({
          sizeType: ['original', 'compressed'],//所选的图片的尺寸
          //接口调用成功的回调函数
          success: function (res) {
            console.log(res.tempFilePaths);
            for (let index1 = 0; index1 < res.tempFilePaths.length; index1++)
            {
               const element = res.tempFilePaths[index1];
               that.imgArray.push(element);
               that.uploadfilenames.push(`goodsCommentModelList[${index}].imagesList[${that.imgArray.length-1}]`);
            }
          }
        })
      } else {
       that.toast('最多上传9张图片');
      }
    },
    //发布按钮
     async submit() {
      //访问服务器 把发布的信息提交到添加订单评论API中
      // console.log(this.postData);
      if (
        this.postData.Quality == 0 ||
        this.postData.Speed == 0 ||
        this.postData.Service == 0
      ) {
        var that = this;
        wx.showModal({
          title: "评分提示",
          content: "您还没有进行评分呢?",
          cancelText: "继续评分",
          confirmText: "取消评分",
          cancelColor: "#FF0000",
          success(res) {
            if (res.confirm) {
              console.log("用户点击确定");
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      } else {
        // var rep = await this.$ShoppingAPI.OrderComment_GetListAdd(this.postData,this.imgArray,this.uploadfilenames);
        // var rep = rep[rep.length-1];
        console.log(this.postData);
        var rep = await this.$ShoppingAPI.OrderComment_GetListAdd(this.postData);
        if (rep.ret == 0) {
          this.replace({
            path: "/pages/order/Comment",
            query: { OrderId: this.orderInfo.OrderId },
            reLaunch: true
          });
        }
      }
    },

    //添加一个商品质量评分的处理方法Processingscores
    Processingscores: function(data) {
      this.postData.Quality = data;
      console.log(data);
    },
    //添加一个运输速度评分处理方法Speedmethod
    Speedmethod: function(data) {
      this.postData.Speed = data;
      // console.log(data);
    },
    //添加一个服务质量评分方法Servicemethod
    Servicemethod: function(data) {
      this.postData.Service = data;
      // console.log(data);
    },
    //添加一个响应事件的商品评论信息处理方法goodsCommentModel
    goodsCommentModel: function(data) {
      // console.log(data,this.postData.goodsCommentModelList);

      this.postData.goodsCommentModelList[data.index].State = data.score;
    },
    Commentsmethod: function(index, $el) {
      // console.log($el.target.value);
      this.postData.goodsCommentModelList[index].Content = $el.target.value;
    }
  },
  //异步
  async mounted() {
    //打印外面传进来的参数
    // console.log(this.$route.query);
    //把vue this 指向that，方便在其他回调函数里面使用this
    var that = this;
    //访问服务端，请求api获取传进来的OrderId的订单信息
    var res = await this.$ShoppingAPI.Order_Get({
      OrderId: this.$route.query.OrderId
    });
    //res.ret==0表示服务端请求成功
    if (res.ret == 0) {
      //将返回的data数组第一项（因为接口返回的是数组）赋值给 this.orderInfo
      //这里是把订单的Order_Goods_ItemInfo数组信息赋值添加评论里面的goodsCommentModel数组
      this.orderInfo = res.data[0];
      this.postData.OrderId = this.orderInfo.OrderId;
      this.postData.UserId = this.UserInfo.UserId;
      this.postData.sId = this.orderInfo.sId;
      // 循环goodsCommentModelList数组，把里面的每一项循环出来
      for (
        let index = 0;
        index < this.orderInfo.Order_Goods_items.length;
        index++
      ) {
        // const定义的变量不可以修改，而且必须初始化。
        //这里是把订单的Order_Goods_ItemInfo数组信息赋值element
        const element = this.orderInfo.Order_Goods_items[index];
        var goodsComment = {
          //把订单的Order_Goods_ItemInfo数组信息赋值给goodsComment参数下的属性
          gId: element.gId,
          ItemId: element.ItemId,
          Content: "",
          State: 0
        };
        // push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
        this.postData.goodsCommentModelList.push(goodsComment);
      }
    }
  }
};
</script>

<style scoped>
.content {
  width: 10.8rem;
  background-color: #ecf0f1;
  padding-top: 0.21rem;
  padding-bottom: 0.5rem;
}

/* 订单信息 */
.OrderInfo {
  background-color: #ffffff;
  padding-left: 0.28rem;
  padding-top: 0.31rem;
}
.OrderInfo .OrderId {
  font-size: 0.36rem;
  color: #5c5c5c;
  padding-top: 0.39rem;
  padding-bottom: 0.3rem;
}
.OrderNo {
  float: left;
}
.shoppingcarList {
  border-top: solid #ecf0f1 0.02rem;
  width: 10.26rem;
  height: 3.22rem;
}
.goods-img img {
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 0.1rem;
  float: left;
  padding-right: 0.44rem;
}
.goods-info {
  padding-bottom: 0.4rem;
}
.goods-name {
  color: #021218;
  font-size: 0.4rem;
  padding-bottom: 0.9rem;
}
.goods-price {
  color: #5c5c5c;
  font-size: 0.36rem;
  float: left;
}
.goods-price .goods-price-num{
color:#ff5252;
}
.goods-iteminfo {
  color: #5c5c5c;
  font-size: 0.36rem;
}
.goods-iteminfo span{

}
/* 评价的商品 */
.comment {
  padding-top: 0.12rem;
  font-size: 0.36rem;
  color: #5c5c5c;
  padding-bottom: 0.21rem;
}
/* 文本框 */
.textarea {
  width: 10.2rem;
  height: 3.58rem;
  border: solid 0.02rem #e4e5e5;
  margin-top: 0.68rem;
  font-size: 0.4rem;
  color: #cccaca;
}
/* 上传凭证 */
.Images img {
  width: 1.6rem;
  height: 1.61rem;
  border: solid 0.01rem #b4b4b4;
  margin-top: 0.31rem;
  margin-left: 0.2rem;
}
.logistics {
  font-size: 0.36rem;
  color: #5c5c5c;
  background-color: #ffffff;
  padding-left: 0.21rem;
}
.logistics > li{
  vertical-align:middle;
  padding-top: 0.23rem;
  padding-bottom: 0.3rem;
}
.logistics img {
  width: 0.46rem;
  height: 0.44rem;
  float: left;
  margin-right: 0.8rem;
}
.speed {
  float: left;
  padding-right: 0.84rem;
}
/* 发布按钮 */
.submit {
  width: 10.2rem;
  font-size: 0.48rem;
  height: 1.2rem;
  background-color: #12b7f5;
  border-radius: 0.16rem;
  margin: 0 auto;
  margin-top: 0.5rem;
  display: block;
  color: #ffffff;
  border: 0;
}
</style>
