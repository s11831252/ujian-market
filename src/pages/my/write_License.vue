<template>
  <div class="index">
    <div class="content">
      <div class="upload">
        <div class="upload_demo">
          <p class="upload_title">营业执照</p>
          <div class="upload_right">
            <div class="addimgDiv">
              <div class="addImg_demo">
                <img class="addImg" v-if="License.length==0" src="/static/img/addImg.png" @click="chooseImage" alt>
                <img class="addImg" v-for="(item,index) in License" :key="index" :src="item">
              </div>
            </div>
            <div class="upload_text">注：1.请上传“营业执照副本”2.要求图片清晰，不能遮挡图片文字内容 3.支持JPG、PNG、GIF格式。</div>
          </div>
        </div>
        <div class="upload_demo">
          <p class="upload_title">店铺照片</p>
          <div class="upload_right">
            <div class="addimgDiv">
              <div class="addImg_demo">
                <img class="addImg" v-for="(item,index) in ShopImages" :key="index" :src="item">
                <img class="addImg"  v-if="License.length<9" src="/static/img/addImg.png" @click="chooseShopImage" alt>
              </div>
            </div>
            <div class="upload_text">
              注：1.请上传“店铺照片”图至多9张;
              <!-- ，“店内环境”图至少3张 -->
              2.支持JPG、PNG、GIF格式；3.以上图片信息将展示在店铺首页，请商家认真添加。
            </div>
          </div>
        </div>
      </div>
      <div class="nextBtn" @click="post">申请开店</div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      sId:"",
      License:[],
      ShopImages:[],
      ShoppingInfo:null
    };
  },
  methods:{
    //选择店铺营业执照图片
    chooseImage(){
      var that = this;
      if (this.License.length==0) {
        wx.chooseImage({
          sizeType: ['original', 'compressed'],//所选的图片的尺寸
          count:1,
          //接口调用成功的回调函数
           success: async function (res) {
            if(res.tempFilePaths.length>0)
            {
              var rep = await that.$ShoppingAPI.Shop_UpdateLicense(that.sId,[res.tempFilePaths[0]]);
              rep = rep[0];
              if(rep.ret==0)
              {
                that.License.push(res.tempFilePaths[0]);
              }
            }
          }
        })
      } else {
        that.toast('最多上传1张图片');
      }
    },
    //选择店铺图片
    chooseShopImage(){
      var that = this;
      if (this.ShopImages.length<9) {
        wx.chooseImage({
          sizeType: ['original', 'compressed'],//所选的图片的尺寸
          count:1,
          //接口调用成功的回调函数
          success: async function (res) {
            if(res.tempFilePaths.length>0)
            {
              var rep = await that.$ShoppingAPI.Shop_UpdateImages(that.sId,null,[res.tempFilePaths[0]],"ShopImages");
              rep = rep[0];
              if(rep.ret==0)
              {
                that.ShopImages.push(res.tempFilePaths[0]);
              }
            }
          }
        })
      } else {
        that.toast('最多上传9张图片');
      }
    },
    post(){
      if(this.License.length>0)
      {
        this.go({path:"/pages/my/applyresult",query:{sId:this.sId}})
      }else
      {
        this.toast('必须上传营业执照');
      }
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
            var _arrtemp =  this.ShoppingInfo.ShopImages.map(item=>item.ImgUrl);
            for (const item of _arrtemp) {
              this.ShopImages.push(item)
            }
            var _arrtemp2 =  this.ShoppingInfo.License.map(item=>item.ImgUrl);
            for (const item of _arrtemp2) {
              this.License.push(item)
            }

            // console.log(this.ShopImages,this.License)
        }
    }
  }
};
</script>
