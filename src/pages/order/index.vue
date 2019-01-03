<template>
  <div>
    <ul class="orderlist">
      <li v-for="(order,i) in OrderList" :key="i">
        <orderItemView :order="order"></orderItemView>
      </li>
    </ul>
  </div>
</template>
<script>
import orderItemView from '@/pages/order/index-orderItem'
export default {
  components: {
    orderItemView
  },
  data() {
    return {
      OrderList: null,
      searchModel:{
         PageIndex: 1,
         PageSize: 10
      },
      hasPage:true,
    };
  },
  methods: {
   async init(){
      var rep = await this.$ShoppingAPI.Order_Get(this.searchModel);
      if (rep.ret == 0) {
        this.OrderList = rep.data;
      }
    }
  },
   mounted() {
    this.init();
  },
  onPullDownRefresh(){
    this.init();
    wx.stopPullDownRefresh()
  },
   async onReachBottom() {
     if(this.hasPage)
     {
        this.searchModel.PageIndex++;
        var rep = await this.$ShoppingAPI.Order_Get(this.searchModel);
        
        if (rep.data && rep.data.length) {
          for (const item of rep.data) {
            this.OrderList.push(item);
          }
        }else
        {
          this.hasPage=false;
        }
     }
   }
};
</script>
<style lang="less" scoped>
ul.orderlist{
  background-color:#ecf0f1;
  li{
    background: #fff;
    margin-top: 10px;
  }
}
</style>
