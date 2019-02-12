<template>
  <div class="content">
    <!-- 退货申请页面 -->
    <div class="Refund">
      <ul>
        <li class="reason">申请服务:</li>
        <li class="reason1">退款并退货</li>
      </ul>
      <ul class="cause">
        <li class="reason">退货原因:</li>
        <li class="reason2">
          <mydrop :options="remaks" :onSelected="reasonselect"></mydrop>
        </li>
      </ul>
      <ul>
        <li class="reason">需退货金额:</li>
        <li class="number">¥165.00</li>
        <li class="return">（仅退货款）</li>
        <li class="infuse">注：消费金额将会全额返还至您的账户</li>
      </ul>
      <ul>
        <li class="reason">退货说明:</li>
        <li class="textarea">
          <textarea v-model="str"></textarea>
        </li>
      </ul>
      <ul>
        <li class="reason">上传凭证:</li>
        <li>
          <img src="/static/img/return _reason.png">
        </li>
      </ul>
    </div>
    <button class="submit">提交</button>
  </div>
</template>
<script>
import mydrop from "@/components/myDrop";

export default {
  data() {
    return {
      str: "这是测试内容"
    };
  },
  computed: {
    remaks() {
      return [
        {
          text: "请选择退货原因",
          value: 1
        },
        {
          text: "选项1",
          value: 2
        },
        {
          text: "选项2",
          value: 3
        },
      ];
    }
  },
  components: {
    mydrop
  },
  methods: {
    reasonselect(selectOps) {
      console.log(selectOps);
    }
  }
};
</script>



<style scoped>
.content {
  background-color: #ecf0f1;
}
/* 退货 */
.Refund {
  background-color: #ffffff;
  padding-left: 0.4rem;
  height: 13.13rem;
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
  background-color: #ecf0f1;
  margin-left: 0.28rem;
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
</style>
