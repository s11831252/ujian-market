<template>
  <div class="index">
    <!-- <div class="top">
      <img class="back" src="../../../static/img/back.png" alt>
      <p class="title">温馨提示</p>
      <div class="moreDiv">
        <img class="more" src="../../../static/img/more.png" alt>
        <img class="eyes" src="../../../static/img/eyes.png" alt>
      </div>
    </div>-->
    <div class="content" v-if="ShoppingInfo">
      <div class="prompt" v-if="ShoppingInfo.AudtiState==1">
        <div class="prompt_storeDiv">
          <div class="prompt_storeImg">
            <img class="store" src="../../../static/img/success.png" alt>
          </div>
        </div>
        <p class="prompt_store_P">店铺已申请成功！</p>
        <div class="prompt_url_nr">
          <div class="prompt_urlDiv" @click="copyLink('https://live.ujianchina.net/')">
            <p class="prompt_url" >https://live.ujianchina.net/</p>
          </div>
          <div class="prompt_urlDiv">
            <p class="prompt_url_hint">（点击复制以上网址前往pc端管理店铺）</p>
          </div>
        </div>
        <div class="prompt_knowBtn" @click="go({path:'/pages/my/index', isTab: true })">知道了</div>
      </div>
      <div class="prompt" v-else-if="ShoppingInfo.AudtiState==0">
        <div class="prompt_storeDiv">
          <div class="prompt_storeImg">
            <img class="store" src="../../../static/img/posting.png" alt>
          </div>
        </div>
        <p class="prompt_store_P2">店铺申请中...</p>
        <div class="prompt_resizeDiv">
          <div class="prompt_resize">
            <p class="prompt_names">申请店铺名称:</p>
            <p class="prompt_texts">{{ShoppingInfo.sName}}</p>
          </div>
        </div>
        <div class="prompt_resizeDiv">
          <div class="prompt_resize">
            <p class="prompt_names">申请时间:</p>
            <p class="prompt_texts">{{ShoppingInfo.CreateTime}}</p>
          </div>
        </div>
        <div class="prompt_knowBtn" @click="go({path:'/pages/my/applyresult_detail',query:{sId:ShoppingInfo.sId}})">查看</div>
      </div>
      <div class="prompt" v-else>
        <div class="prompt_storeDiv">
          <div class="prompt_storeImg">
            <img class="store" src="../../../static/img/lose.png" alt>
          </div>
        </div>
        <p class="prompt_store_P2">店铺申请失败...</p>
        <div class="prompt_resizeDiv">
          <div class="prompt_resize">
            <p class="prompt_names">申请店铺名称:</p>
            <p class="prompt_texts">{{ShoppingInfo.sName}}</p>
          </div>
        </div>
        <div class="prompt_resizeDiv">
          <div class="prompt_resize">
            <p class="prompt_names">申请时间:</p>
            <p class="prompt_texts">{{ShoppingInfo.CreateTime}}</p>
          </div>
        </div>
        <div class="prompt_knowBtn" @click="go({path:'/pages/my/applyresult_detail',query:{sId:ShoppingInfo.sId}})">查看</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      sId:"",
      ShoppingInfo:{},
    }
  },
  methods:{
    copyLink(link){
      var that = this;
      wx.setClipboardData({
        data:link,
        success(){
          that.toast("复制成功,您可以粘贴到pc电脑上使用了。")
        }
      })
    }
  },
  async mounted(){
    if( this.$route.query.sId )//从外面传进来的sId店铺标识
    {
      this.sId=this.$route.query.sId;
      var rep = await this.$ShoppingAPI.Shop_GetDetails({sId:this.sId});
        if(rep.ret==0)
        {
            this.ShoppingInfo=rep.data;
        }
    }
  }
};
</script>
