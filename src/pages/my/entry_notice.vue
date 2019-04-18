<template>
  <div class="index">
    <div class="content">
      <div class="application">
        <div class="process">
          <div class="process_titleDiv">
            <div class="process_rectangle"></div>
            <p class="process_title">入驻流程</p>
          </div>
          <div class="process_IconDiv">
            <div class="process_IconDemo">
              <div class="process_icon">
                <img class="application_icon" src="/static/img/application_icon1.png" alt>
              </div>
              <p class="process_Icon_P">填写信息</p>
            </div>
            <img class="next_right" src="/static/img/next_right.png" alt>
            <div class="process_IconDemo">
              <div class="process_icon">
                <img class="application_icon" src="/static/img/application_icon2.png" alt>
              </div>
              <p class="process_Icon_P">上传资料</p>
            </div>
            <img class="next_right" src="/static/img/next_right.png" alt>
            <div class="process_IconDemo">
              <div class="process_icon">
                <img class="application_icon" src="/static/img/application_icon3.png" alt>
              </div>
              <p class="process_Icon_P">等待审核</p>
            </div>
            <img class="next_right" src="/static/img/next_right.png" alt>
            <div class="process_IconDemo">
              <div class="process_icon">
                <img class="application_icon" src="/static/img/application_icon4.png" alt>
              </div>
              <p class="process_Icon_P">开店成功</p>
            </div>
          </div>
        </div>
        <div class="process">
          <div class="process_titleDiv">
            <div class="process_rectangle"></div>
            <p class="process_title">入驻协议</p>
          </div>
          <div class="agreement">
            <wxParse :content="agreement" @preview="preview" @navigate="navigate" />
          </div>
          <div class="agreement_choice">
            <radio-group class="radio-group" @change="radioChange">
              <label>
                <input type="radio" :value="true" name="agree">已阅读，我同意
              </label>
              <label>
                <input type="radio" :value="false" name="agree">不同意
              </label>
            </radio-group>
          </div>
        </div>
      </div>
      <div class="nextBtn" @click="nextGo">下一步</div>
    </div>
  </div>
</template>
<script>
import wxParse from 'mpvue-wxparse'

export default {
  components:{
    wxParse
  },
  data() {
    return {
      agree: false,
      agreement:"",
    };
  },
  methods: {
    radioChange(v) {
      this.agree = v.target.value == "true";
    },
    nextGo(){
      if(this.agree)
      {
        this.go({path:"/pages/my/write_info"});
      }else
      {
        this.toast("同意入驻协议后可进入下一步操作")
      }
    }
  },
  async mounted(){
    this.agreement = await this.$ShoppingAPI.Shop_AgreementHtml();
  }
};
</script>
<style scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
</style>
