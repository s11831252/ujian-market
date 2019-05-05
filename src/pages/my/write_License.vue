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
                <img class="addImg" src="/static/img/addImg.png" @click="chooseShopImage" alt>
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
      <div class="nextBtn">申请开店</div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      sId:"",
      License:[],
      ShopImages:[]
    };
  },
  methods:{
    //选择店铺营业执照图片
    chooseImage(){
      var that = this;
      if (this.License.length==0) {
        wx.chooseImage({
          sizeType: ['original', 'compressed'],//所选的图片的尺寸
          //接口调用成功的回调函数
          success: function (res) {
            if(res.tempFilePaths.length>0)
            {
              that.License.push(res.tempFilePaths[0]);
              that.$ShoppingAPI.Shop_UpdateLicense(that.sId,that.License);
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
          //接口调用成功的回调函数
          success: function (res) {
            if(res.tempFilePaths.length>0)
            {
              that.ShopImages.push(res.tempFilePaths[0]);
              that.$ShoppingAPI.Shop_UpdateLicense(that.sId,that.License,"ShopImages");
            }
          }
        })
      } else {
        that.toast('最多上传9张图片');
      }
    },
  }
};
</script>
