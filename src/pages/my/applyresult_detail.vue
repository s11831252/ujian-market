<template>
  <div class="index">
    <div class="content">
      <div class="upload">
        <div class="auditDemo">
          <p class="audit_title">申请店铺:</p>
          <p class="audit_text">{{ShoppingInfo.sName}}</p>
        </div>
        <div class="auditDemo">
          <p class="audit_title">申请时间:</p>
          <p class="audit_text">{{ShoppingInfo.CreateTime}}</p>
        </div>
        <div class="auditDemo">
          <p class="audit_title">主营类目:</p>
          <p class="audit_text">{{ShoppingInfo.MainTypeName}}</p>
        </div>
        <div class="auditDemo">
          <p class="audit_title">店铺地址:</p>
          <p class="audit_text">{{ShoppingInfo.Address}}</p>
        </div>
        <div class="auditDemo">
          <p class="audit_title">营业执照:</p>
          <div class="auditImg_Div">
            <img class="audit_bussiness" v-for="(item,index) in ShoppingInfo.License" :key="index" :src="item.ImgUrl" alt>
          </div>
        </div>
        <div class="auditDemo">
          <p class="audit_title">店铺照片:</p>
          <div class="auditImg_Div">
            <img class="audit_bussiness" v-for="(item,index) in ShoppingInfo.ShopImages" :key="index" :src="item.ImgUrl" alt>
          </div>
        </div>
      </div>
      <p class="audit_ing" v-if="ShoppingInfo.AudtiState==0">店铺审核中……</p>
      <p class="audit_ing" v-else-if="ShoppingInfo.AudtiState==2">{{ShoppingInfo.Reason}}</p>
      <!-- <p class="audit_ing" v-else-if="ShoppingInfo.AudtiState==1"></p> -->
      <div class="nextBtn" @click="CancelAudti">取消申请</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      sId: "",
      ShoppingInfo: {}
    };
  },
  methods:{
    async CancelAudti(){
      var rep = await this.$ShoppingAPI.Shop_CancelAudti(this.sId);
      console.log(rep);
      if(rep.ret==0)
      {
        this.go({path:"/pages/my/write_info",query:{sId:this.sId}})
      }
    }
  },
  async mounted() {
    if (this.$route.query.sId) {
      //从外面传进来的sId店铺标识
      this.sId = this.$route.query.sId;
      var rep = await this.$ShoppingAPI.Shop_GetDetails({ sId: this.sId });
      if (rep.ret == 0) {
        this.ShoppingInfo = rep.data;
      }
    }
  }
};
</script>
