<!--
 * @Author: SuChonghua
 * @Date: 2021-09-27 10:04:33
 * @LastEditTime: 2021-12-08 11:25:20
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\release-form.vue
-->
<template>
  <div class="root" v-if="supplyModel">
    <div class="group">
      <input v-model="supplyModel.info.title" :maxlength="titleLenghtLimit" placeholder="输入标题" />
      <span class="length">{{ (supplyModel.info.title && supplyModel.info.title.length) || 0 }}/{{ titleLenghtLimit }}</span>
    </div>
    <div class="group">
      <div class="block">
        <div class="tip" v-if="supplyModel.info.listType == 1 || supplyModel.info.listType == 2">
          <p class="txt"><i class="icon">&#xe6b3;</i>详细描述您所需要的产品</p>
          <p><i>·</i>需求产品的类型</p>
          <p><i>·</i>需求产品的外观、尺寸、型号等</p>
          <p><i>·</i>预算、到货时间、运输方式、区域限定等</p>
          <p class="txt"><i class="icon">&#xe6b3;</i>注意</p>
          <p v-if="supplyModel.info.listType == 1"><i>·</i>发布公司需求会自带公司的详细信息，每次发布信息显示时间为30天</p>
          <p v-else-if="supplyModel.info.listType == 2"><i>·</i>发布项目需求会自带项目的详细信息，每次发布信息显示时间为30天</p>
        </div>
        <div class="tip" v-else-if="supplyModel.info.listType == 3 || supplyModel.info.listType == 4 || supplyModel.info.listType == 5">
          <p class="txt"><i class="icon">&#xe6b3;</i>详细描述您所供应的产品</p>
          <p><i>·</i>供应产品的类型</p>
          <p><i>·</i>供应产品的外观、尺寸、型号等</p>
          <p><i>·</i>预算、到货时间、运输方式、区域限定等</p>
        </div>
        <textarea class="content" v-model="supplyModel.info.content" placeholder="请在此填写详细介绍资料"></textarea>
        <div class="imgList">
          <div class="item" v-for="(item, index) in imageList" :key="index">
            <img :src="item.extContent" />
          </div>
          <div class="item" v-for="(item, index) in addImage" :key="index">
            <img :src="item.url" />
          </div>
          <div class="item add" v-if="imageList.length + addImage.length < imageCountLimit" @click="AddImage(addImageCallback, { count: imageCountLimit - imageList.length - addImage.length })">
            <img src="../../../static/img/Images.png" />
          </div>
        </div>
      </div>
    </div>
    <div class="group project" v-if="supplyModel.info.listType == '2'">
      <div class="info" @click="go({ path: '/pages/supply-demand/select', query: { type: 'project' } })">
        <i class="icon">&#xe66f;</i>
        <span class="label">项目</span>
        <input readonly disabled placeholder="请选择项目" :value="selectProject && selectProject.ProjectName" />
        <i class="icon go">&#xe601;</i>
      </div>
      <ul class="item">
        <li>
          <i>·</i>
          <span class="label">项目规模</span>
          <input placeholder="输入项目规模" v-model="ptext1.extContent" />
        </li>
        <li>
          <i>·</i>
          <span class="label">总投资</span>
          <input placeholder="输入总投资" v-model="ptext2.extContent" />
        </li>
        <li>
          <i>·</i>
          <span class="label">计划工期</span>
          <input placeholder="输入计划工期" v-model="ptext3.extContent" />
        </li>
        <li>
          <i>·</i>
          <span class="label">建设单位</span>
          <input placeholder="输入建设单位" v-model="ptext4.extContent" />
        </li>
        <li>
          <i>·</i>
          <span class="label">设计单位</span>
          <input placeholder="输入设计单位" v-model="ptext5.extContent" />
        </li>
      </ul>
    </div>
    <div class="group" v-if="supplyModel.info.listType == '1'" @click="go({ path: '/pages/supply-demand/select', query: { type: 'corp' } })">
      <i class="icon">&#xe66f;</i>
      <span class="label">公司</span>
      <input readonly disabled placeholder="请选择项目" :value="selectCorp && selectCorp.eName" />
      <i class="icon go">&#xe601;</i>
    </div>
    <div class="group">
      <i class="icon">&#xe64d;</i>
      <span class="label">地址</span>
      <input placeholder="请输入地址" v-model="address.extContent" />
      <i class="icon go"></i>
    </div>
    <div class="group">
      <i class="icon">&#xe66a;</i>
      <span class="label">姓名</span>
      <input placeholder="请输入姓名" v-model="name.extContent" />
      <i class="icon go"></i>
    </div>
    <div class="group">
      <i class="icon">&#xe60a;</i>
      <span class="label">联系方式</span>
      <input placeholder="请输入联系方式"  v-model="contact.extContent" />
      <i class="icon go"></i>
    </div>
      <div class="public" :class="{action:contact.extPublic}" >
        <span @click="contact.extPublic=!contact.extPublic"><i class="icon">&#xe633;</i>公开信息</span>
      </div>
    <button class="post" @click="post">发布</button>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      imageCountLimit: 9,
      titleLenghtLimit: 30,

      supplyModel: {
        info: {
          listId: 1,
          title: "",
          sendUserId: "",
          bindId: "",
          content: "",
          listType: 0,
          status: 0,
          isTop: 0,
          cityCode: 0,
          showDays: 0,
          gps_lng: 0,
          gps_lat: 0,
          sendTime: "",
          reflushTime: "",
          showTime: "",
        },
        ext: [],
      },
      addImage: [],
      ptext1:{
        extTitle: "项目规模",
        extContent: "",
        extOrder: 0,
        extType: 7,
        extPublic: true,
      },
      ptext2:{
        extTitle: "总投资",
        extContent: "",
        extOrder: 0,
        extType: 7,
        extPublic: true,
      },
      ptext3:{
        extTitle: "计划工期",
        extContent: "",
        extOrder: 0,
        extType: 7,
        extPublic: true,
      },
      ptext4:{
        extTitle: "建设单位",
        extContent: "",
        extOrder: 0,
        extType: 7,
        extPublic: true,
      },
      ptext5:{
        extTitle: "设计单位",
        extContent: "",
        extOrder: 0,
        extType: 7,
        extPublic: true,
      },
      name: {
        extTitle: "姓名",
        extContent: "",
        extOrder: 0,
        extType: 2,
        extPublic: true,
      },
      address:{
        extTitle: "地址",
        extContent: "",
        extOrder: 0,
        extType: 7,
        extPublic: true,
      },
      contact: {
        extTitle: "电话",
        extContent: "",
        extOrder: 0,
        extType: 3,
        extPublic: true,
      },
    };
  },
  computed: {
    ...mapState({
      selectProject: (state) => state.SupplyDemand.selectProject,
      selectCorp: (state) => state.SupplyDemand.selectCorp,
      userInfo: (state) => state.User.UserInfo,
    }),
    imageList() {
      if (!this.supplyModel.ext || this.supplyModel.ext.length == 0) return [];

      return this.supplyModel.ext.filter((item) => {
        return (item.extType == 1);
      });
    },
  },
  methods: {
    async addImageCallback(imgBase64, URI) {
      var rep = await this.$AssembleAPI.UpLoad({
        uploadCfg: "e_SupplyAndDemandConfig",
        sessionName: "",
        file: {
          fileName: "图片1",
          mediaType: "image/jpeg",
          buffer: imgBase64,
        },
      });
      if (rep.ret == 0) {
        this.addImage.push({
          extId: 0,
          extTitle: "图片1",
          extContent: rep.data.filePath,
          url: rep.data.url,
          extOrder: 0,
          extType: 1,
          extPublic: true,
          listId: 0,
        });
        console.log(this.addImage);
      }
    },
    async post(){
      var postData= {
        info:this.supplyModel.info,
        ext:[]
      };
      postData.ext.push(this.name);
      postData.ext.push(this.address);
      postData.ext.push(this.contact);
      postData.ext = postData.ext.concat(this.imageList);
      postData.ext = postData.ext.concat(this.addImage);
      if(postData.info.listType==2)
      {
        postData.ext.push(this.ptext1);
        postData.ext.push(this.ptext2);
        postData.ext.push(this.ptext3);
        postData.ext.push(this.ptext4);
        postData.ext.push(this.ptext5);
      }

      var rep = await this.$SupplyAndDemandAPI.SupplyAndDemand_Create(postData)
      if(rep.ret==0)
      {
        this.toast("发布成功");
        this.$router.push({path:"/pages/supply-demand/post",query:{listId:rep.data}})
      }
    },
    setTitle(){
      if (this.isMP) {
        switch (this.supplyModel.info.listType) {
          case 1: {
            wx.setNavigationBarTitle({ title: `发布企业需求` });
            break;
          }
          case 2: {
            wx.setNavigationBarTitle({ title: `发布项目需求` });
            break;
          }
          case 3: {
            wx.setNavigationBarTitle({ title: `发布个人供应` });
            break;
          }
          case 4: {
            wx.setNavigationBarTitle({ title: `发布店铺供应` });
            break;
          }
          case 5: {
            wx.setNavigationBarTitle({ title: `发布企业供应` });
            break;
          }
        }
      }
    }
  },
  onShow(){
      // console.log("onShow",this.supplyModel.info.listType)
        this.contact.extContent = this.contact.extContent||this.userInfo.Phone;
        this.name.extContent = this.name.extContent||this.userInfo.UserName;
        this.supplyModel.info.bindId =this.supplyModel.info.bindId|| this.userInfo.UserId;
        this.address.extContent =this.address.extContent|| (this.selectProject && this.selectProject.Address) || (this.selectCorp && this.selectCorp.Address)
        this.supplyModel.info.cityCode=this.supplyModel.info.cityCode||(this.selectProject && this.selectProject.AreaId) || (this.selectCorp && this.selectCorp.Area)
        this.supplyModel.info.gps_lng=this.supplyModel.info.gps_lng||(this.selectProject && this.selectProject.Longitude) || (this.selectCorp && this.selectCorp.Longitude) 
        this.supplyModel.info.gps_lat=this.supplyModel.info.gps_lat||(this.selectProject && this.selectProject.Latitude) || (this.selectCorp && this.selectCorp.Latitude)

  },
  async mounted() {
    if (this.$route.query.listType) {
      this.supplyModel.info.listType = parseInt(this.$route.query.listType);
      this.setTitle();
    }
    if(this.$route.query.listId)
    {
      var rep = await this.$SupplyAndDemandAPI.SupplyAndDemand_Detail(this.$route.query.listId)
    }
  },
};
</script>
<style lang="scss" scoped>
.root {
  padding: 0 0.49rem;
  .group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0;
    border-bottom: 0.02rem solid #ebebeb;
    color: #333333;
    .block{
      flex-grow: 1;
    }
    input {
      font-size: 0.48rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex-grow: 1;
    }
    ::-webkit-input-placeholder {
      /* Edge */
      color: #a6a6a6;
    }

    :-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #a6a6a6;
    }

    ::placeholder {
      color: #a6a6a6;
    }
    .length {
      font-size: 0.32rem;
      color: #a6a6a6;
      margin-left: 0.18rem;
    }
    .tip {
      color: #8590a4;
      background-color: #f5f6f8;
      border-radius: 0.35rem;
      padding: 0.47rem 0.28rem 0.41rem 0.41rem;
      p {
        font-size: 0.36rem;
        display: flex;
        margin-bottom: 0.22rem;
        i {
          margin-right: 0.2rem;
        }
      }
      p.txt {
        margin-top: 0.41rem;
        font-size: 0.4rem;
        margin-bottom: 0.37rem;
      }
    }
    .content {
      margin-top: 0.69rem;
      height: 4.56rem;
      font-size: 0.43rem;
      margin-bottom: 0.2rem;
    }
    .imgList {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .item {
        margin-left: 0.23rem;
        margin-bottom: 0.2rem;
        img {
          width: 2.94rem;
          height: 2.93rem;
          border-radius: 0.2rem;
        }
      }
    }

    & > .icon,
    &.project > .info .icon {
      color: #fff;
      background-color: #bfbfbf;
      border-radius: 50%;
      width: 0.5rem;
      height: 0.5rem;
      line-height: 0.5rem;
      font-size: 0.3rem;
      text-align: center;
    }

    > .label,
    &.project > .info .label {
      margin-left: 0.2rem;
      width: 3.08rem;
    }
    & > .icon.go,
    &.project > .info .icon.go {
      background-color: transparent;
      color: #e6e6e6;
      font-size: 0.7rem;
      font-weight: 800;
    }

  }
  .group.project {
    display: block;
    border-bottom: 0;
    padding-bottom: 0;
    > .info {
      display: flex;
      align-items: center;
      input {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    > .item {
      li {
        display: flex;
        align-items: center;
        padding: 0.58rem 0;
        border-bottom: 0.02rem solid #ebebeb;
        font-size: 0.4rem;
        i {
          margin-left: 0.58rem;
          color: #8c8c8c;
          font-size: 0.6rem;
        }
        span,
        input {
          flex-grow: 2;
          text-align: right;
          color: #333333;
          margin-right: 0.86rem;
        }
        span.label {
          margin-left: 0.26rem;
          margin-right: 0;
          text-align: left;
          flex-grow: 0;
          color: #8c8c8c;
        }
      }
    }
  }
    .public {
      font-size: 0.35rem;
      color: #8e98ac;
      display: flex;
      justify-content: flex-end;
      margin: 0.6rem 0;
      width: 100%;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f4f5f9;
        border-radius: 0.32rem;
        text-align: center;
        width: 2.4rem;
        height: 0.64rem;
        .icon {
          width: 0.32rem;
          height: 0.32rem;
          border-radius: 0.05rem;
          background-color: #f4f5f9;
          color: #f4f5f9;
          text-align: center;
          line-height: 0.32rem;
          font-size: 0.3rem;
          margin-right: 0.1rem;
          border: 0.01rem solid #8e98ac;
        }
      }
    }
    .public.action {
      color: #0c64ea;
      .icon {
        background-color: #0c64ea;
        color: #fff;
        border: 0.01rem solid #f4f5f9;
      }
    }
  button.post{
    width: 9.89rem;
    height: 1.21rem;
    line-height: 1.21rem;
    background-color: #00b7ee;
    border-radius: 0.6rem;
    font-family: PingFang-SC-Bold;
    font-size: 0.5rem;
    color: #ffffff;
    margin: auto;
    margin-bottom: 1.84rem;
  }
}
</style>