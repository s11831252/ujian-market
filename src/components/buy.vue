<template>
  <div class="buy" @click.stop>
    <div v-if="goods.Stock>0&&getShoppingCarNumberByItemId>0" class="buy-container" >
      <span class="icon buy-minus" :class="{'action':getShoppingCarNumberByItemId>0}" @click="Minus">&#xe64a;</span>
      <input class="buy-number" @change="Change" v-model="getShoppingCarNumberByItemId"  type="number">
      <span class="icon buy-plus" :class="{'action':getShoppingCarNumberByItemId<goods.Stock}" @click="Plus">&#xe64b;</span>
    </div>
    <div class="zero" v-else-if="goods.Stock>0&&getShoppingCarNumberByItemId==0">
      <span class="action" @click="Plus">立即抢购</span>
    </div>
    <div v-else>
        <p class="noStock">库存不足</p>
    </div>
  </div>
</template>
<script>
import {mapState,mapGetters ,mapMutations } from 'vuex'

export default {
  props: {
    goods: Object,
    image: String,
    sName:String,
  },
  data() {
    return {
      buyNum: 0
    };
  },
  watch:{
    // buyNum(newval,oldval){
    //   if(!isNaN(newval))
    //   {
    //     var n= parseInt(newval);
    //     if(n>=0&&n <this.goods.Stock)
    //     {
    //       console.log(`oldval:${oldval} , newval:${newval}`);
    //       this.ShoppingCarPush({
    //         sId:this.goods.sId,
    //         gId:this.goods.gId,
    //         gName:this.goods.gName,
    //         ItemId:this.goods.ItemId,
    //         Number:newval,
    //         Price:this.goods.Price,
    //         Stock:this.goods.Stock,
    //         });
    //     }
    //   }
    // }
  },
  computed:{
    getShoppingCarBysId(){
      return this.$store.getters.getShoppingCarBysId(this.goods.sId);
    },
    getShoppingCarAmountBysId(){
      return this.$store.getters.getShoppingCarAmountBysId(this.goods.sId);
    },
    getShoppingCarNumberByItemId:{
      get(){
        return this.$store.getters.getShoppingCarNumberByItemId(this.goods.sId,this.goods.ItemId);
      },
      set(newval){
        if(!isNaN(newval))
        {
          var n= parseInt(newval);
          if(n>=0&&n <=this.goods.Stock)
          {
            this.ShoppingCarPush({
              sId:this.goods.sId,
              sName:this.sName,
              gId:this.goods.gId,
              gName:this.goods.gName,
              ItemId:this.goods.ItemId,
              ItemName:this.goods.ItemName,
              Image:this.image,
              Number:newval,
              Price:this.goods.Price,
              Stock:this.goods.Stock,
              });
          }
        }
      }
    }
  },
  methods: {
    ...mapMutations([
      'ShoppingCarPush'
    ]),
    Minus() {
      if (this.getShoppingCarNumberByItemId > 0) this.getShoppingCarNumberByItemId--;
    },
    Plus() {
      if (this.getShoppingCarNumberByItemId < this.goods.Stock) this.getShoppingCarNumberByItemId++;
    },
    Change(e){
      var n= parseInt(e.target.value);
      if(n<0||n >this.goods.Stock)
      {
        this.getShoppingCarNumberByItemId=0;
        return;
      }else
        this.getShoppingCarNumberByItemId=n;
    }
  },
  mounted(){
    console.log("image",this.image)
  }
};
</script>
<style lang="scss" scoped>
.buy {
  float: right;
  display: inline-block;
  // display: inline-block;
  font-size: 17px;
  .buy-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .buy-minus,
    .buy-plus,
    .noStock{
      display: inline-block;
      // width: 20px;
      padding: 0 0.15rem;
      vertical-align: top;
      font-size: 0.45rem;
      margin: 0;
      height: 0.5rem;
      line-height: 0.5rem;
    }
  }

  .action {
    color: #ff5252;
  }
  .zero{
    background: #ff5252;
    font-size: 0.32rem;
    padding: 0.1rem;
    .action{
      color: #ecf0f1;
    }
  }
  .noStock{
    width: 100%;
    color: #979797;
    font-size:0.42rem;
  }
  .buy-number {
    display: inline-block;
    font-size: 0.4rem;
    width: 30px;
    line-height: 0.5rem;
    height: 0.5rem;
    min-height: 0.5rem;
    text-align: center;
  }
}
</style>

