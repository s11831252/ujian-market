<template>
  <div class="content">
    <!-- 退款/退货申请页面 -->
    <div class="Refund">
      <ul>
        <li class="reason">申请服务:</li>
        <li class="reason1">{{RetreatName}}</li>
      </ul>
      <ul class="cause">
        <li class="reason">{{Reasonname}}:</li>
        <li class="reason2">
          <mydrop :options="remaks" :onSelected="reasonselect"></mydrop>
        </li>
      </ul>
      <ul>
        <li class="reason">需{{RetreatName}}金额:</li>
        <li class="number">¥{{orderInfo.GoodsAmount}}</li>
        <li class="return">（{{Moneyname}}）</li>
        <li class="infuse">注：消费金额将会全额返还至您的账户</li>
      </ul>
      <ul>
        <li class="reason">{{accountfor}}</li>
        <li class="textarea">
          <!-- textarea直接将保存的数据传给后台 -->
          <textarea v-model="message"></textarea>
        </li>
      </ul>
      <ul>
        <li class="reason">上传凭证:</li>
        <li class="img" v-for="(item,index) in imgArray" :key="index">
          <img :src="item">
        </li>
        <li class="img" @click="chooseImage" v-if="imgArray.length==0">
          <img src="/static/img/Images.png">
        </li>
      </ul>
    </div>
    <button class="submit" @click="submit">提交</button>
  </div>
</template>
<script>
import mydrop from "@/components/myDrop";
export default {
  data() { // 组件的data必须是函数
    return {
      remaks: [],
      retreat: 1,
      orderInfo: {},
      message: "",
      value: "",
      imgArray:[]
    };
  },
  // 计算
  computed: {
    RetreatName: function() {
      if (this.$route.query.retreat == 1) {
        return "退款";
      } else if (this.$route.query.retreat == 2) {
        return "退货";
      }
    },
    Reasonname: function() {
      if (this.$route.query.retreat == 1) {
        return "退款原因";
      } else if (this.$route.query.retreat == 2) {
        return "退货原因";
      }
    },
    Moneyname: function() {
      if (this.$route.query.retreat == 1) {
        return "仅退款";
      } else if (this.$route.query.retreat == 2) {
        return "仅退货款";
      }
    },
    accountfor: function() {
      if (this.$route.query.retreat == 1) {
        return "退款说明:";
      } else if (this.$route.query.retreat == 2) {
        return "退货说明:";
      }
    }
  },
  // 组件
  components: {
    mydrop
  },
  //异步
  async mounted() {
    //打印外面传进来的参数 Query是一个查询参数类，封装了查询条件，分页，排序等功能。
    //把vue this 指向that，方便在其他回调函数里面使用this
    var that = this;
    this.retreat = this.$route.query.retreat;
    //访问服务端，请求api获取传进来的数据 res返回后台传回来行业市场店铺分类的数据
    var res = await this.$UJAPI.GetKeyword({
      TypeId: this.retreat==1?6:7
    });
    //res.ret==0表示服务端请求成功
    if (res.ret == 0) {
      var order = [];
      // 循环数组，把里面的每一项循环出来
      for (let index = 0; index < res.data.length; index++) {
        const element = res.data[index];
        // 把循环出来的值赋给数组
        order[index] = {
          text: element.KeywordName,
          value: element.KeywordId
        };
      }
      this.remaks = order; //把值赋给数组 remaks
    }

    //访问服务端，请求api获取传进来的OrderId的订单信息
    var res = await this.$ShoppingAPI.Order_Get({
      OrderId: this.$route.query.OrderId
    });
    //res.ret==0表示服务端请求成功
    if (res.ret == 0) {
      //将返回的data数组第一项（因为接口返回的是数组）赋值给 this.orderInfo
      this.orderInfo = res.data[0];
    }
  },
// 方法
  methods: {
    //退货/退款回调
    reasonselect(selectOps) {
      this.value = selectOps.value;
    },
    //选择图片
    chooseImage(){
      var that = this;
      if (this.imgArray.length < 9) {
        wx.chooseImage({
          sizeType: ['original', 'compressed'],
          success: function (res) {
            that.imgArray = that.imgArray.concat(res.tempFilePaths);
          }
        })
      } else {
       that.toast('最多上传9张图片');
      }
    },
    //提交按钮
    async submit() {
      if (this.$route.query.retreat == 1) {
        //访问服务器，获取api传进来的申请取消表单信息 申请退款
        var rep = await this.$ShoppingAPI.Order_ApplyCancel({
          OrderId: this.orderInfo.OrderId,
          CancelType: this.value,
          RevokeRemarks: this.message,
          IsCancelling: "true"
        },this.imgArray,"Images");
        var rep = rep[rep.length-1];
        console.log(rep);

        if (rep.ret == 0) {
          // this.$router.replace({path:'/pages/order/orderDetail',query:{OrderId:this.orderInfo.OrderId},reLaunch: true})
          this.$router.back();
        }
      } 
      else if (this.$route.query.retreat == 2) {
      //访问服务器，获取api传进来的申请取消表单信息 申请退货
        var rep = await this.$ShoppingAPI. Order_ApplyRefund({
          OrderId: this.orderInfo.OrderId,
          RevokeRemarks: this.textarea,
          ReturnGoodsType: this.value,
          IsReturnGoods: "true"
        },this.imgArray,"Images");
        var rep = rep[rep.length-1];
        console.log(rep);
        if (rep.ret == 0) {
          this.$router.back();
          //  this.$router.replace({path:'/pages/order/orderDetail',query:{OrderId:this.orderInfo.OrderId},reLaunch: true})
        }
      }
    }
  }
};
</script>



<style scoped>
.content {
  background-color: #ecf0f1;
}
/* 退款 */
.Refund {
  background-color: #ffffff;
  padding-left: 0.4rem;
  /* height: 13.13rem; */
}
.Refund > ul {
  padding-top: 0.72rem;
}
.Refund .reason {
  font-size: 0.4rem;
  color: #5f5f61;
  float: left;
}
.Refund .reason1 {
  font-size: 0.4rem;
  color: #151515;
  margin-left: 2rem;
}
.Refund .infuse {
  font-size: 0.32rem;
  padding-left: 2.2rem;
  color: #828285;
  padding-top: 0.49rem;
}
.reason2 {
  color: #151515;
  font-size: 0.4rem;
}
.return {
  color: #5c5c5c;
  font-size: 0.36rem;
}
.number {
  color: #ac1d2f;
  font-size: 0.4rem;
  padding-left: 0.2rem;
  float: left;
}
.Refund .textarea {
  width: 7.13rem;
  color: #828285;
  height: 3.74rem;
  border: solid 0.01rem #bfbfbf;
  margin-left: 2.2rem;
}
.Refund img {
  width: 1.92rem;
  height: 1.93rem;
  margin-left: 0.28rem;
  border: dashed 0.001rem #b4b4b4; 
}
/* 按钮 */
.submit {
  width: 10.2rem;
  font-size: 0.48rem;
  height: 1.2rem;
  background-color: #12b7f5;
  border-radius: 0.16rem;
  margin-top: 2.43rem;
  color: #ffffff;
}
ul li.img{
  display: inline-block;
}
</style>
