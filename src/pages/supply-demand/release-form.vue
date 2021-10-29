<!--
 * @Author: SuChonghua
 * @Date: 2021-09-27 10:04:33
 * @LastEditTime: 2021-10-28 18:05:50
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\release-form.vue
-->
<template>
  <div class="root" v-if="supplyModel">
    <div class="group">
      <input v-model="supplyModel.info.title" placeholder="输入标题" />
      <span class="length">{{(supplyModel.info.title&&supplyModel.info.title.length)||0}}</span>
    </div>
    <div class="group">
      <div>
        <div class="tip" v-if="supplyModel.info.listType==1||supplyModel.info.listType==2">
          <p class="txt"><i class="icon">&#xe6b3;</i>详细描述您所需要的产品</p>
          <p><i>·</i>需求产品的类型</p>
          <p><i>·</i>需求产品的外观、尺寸、型号等</p>
          <p><i>·</i>预算、到货时间、运输方式、区域限定等</p>
          <p class="txt"><i class="icon">&#xe6b3;</i>注意</p>
          <p v-if="supplyModel.info.listType==1"><i>·</i>发布公司需求会自带公司的详细信息，每次发布信息显示时间为30天</p>
          <p v-else-if="supplyModel.info.listType==2"><i>·</i>发布项目需求会自带项目的详细信息，每次发布信息显示时间为30天</p>
        </div>
        <div class="tip" v-else-if="supplyModel.info.listType==3||supplyModel.info.listType==4||supplyModel.info.listType==5">
          <p class="txt"><i class="icon">&#xe6b3;</i>详细描述您所供应的产品</p>
          <p><i>·</i>供应产品的类型</p>
          <p><i>·</i>供应产品的外观、尺寸、型号等</p>
          <p><i>·</i>预算、到货时间、运输方式、区域限定等</p>
        </div>
        <textarea class="content" placeholder="请在此填写详细介绍资料"></textarea>
        <div class="imgList">
          <div class="item" v-for="(item, index) in imageList" :key="index">
            <img :src="item.extContent" />
          </div>
          <div class="item" v-for="(item, index) in addImage" :key="index">
            <img :src="item.url" />
          </div>
          <div class="item add" v-if="imageList.length+addImage.length< imageCountLimit" @click="AddImage(addImageCallback,{count:(imageCountLimit-imageList.length-addImage.length)})">
            <img src="../../../static/img/Images.png" />
          </div>
        </div>
      </div>
    </div>
    <div class="group project" v-if="supplyModel.info.listType=='2'">
      <div class="info" @click="go({path:'/pages/supply-demand/select',query:{type:'project'}})">
        <i class="icon">&#xe66f;</i>
        <span class="label">项目</span>
        <input readonly disabled placeholder="请选择项目" :value="selectProject.ProjectName" />
        <i class="icon go">&#xe601;</i>
      </div>
      <ul class="item">
        <li>
          <i>·</i>
          <span class="label">项目规模</span>
          <input placeholder="输入项目规模">
        </li>
        <li>
          <i>·</i>
          <span class="label">总投资</span>
          <input placeholder="输入总投资">
        </li>
        <li>
          <i>·</i>
          <span class="label">计划工期</span>
          <input placeholder="输入计划工期">
        </li>
        <li>
          <i>·</i>
          <span class="label">建设单位</span>
          <input placeholder="输入建设单位">
        </li>
        <li>
          <i>·</i>
          <span class="label">设计单位</span>
          <input placeholder="输入设计单位">
        </li>
      </ul>
    </div>
    <div class="group" v-if="supplyModel.info.listType=='1'" @click="go({path:'/pages/supply-demand/select',query:{type:'corp'}})" >
      <i class="icon">&#xe66f;</i>
      <span class="label">公司</span>
      <input v-model="title" />
      <i class="icon go">&#xe601;</i>
    </div>
    <div class="group">
      <i class="icon">&#xe64d;</i>
      <span class="label">地址</span>
      <input v-model="title" />
      <i class="icon go">&#xe601;</i>
    </div>
    <div class="group">
      <i class="icon">&#xe66a;</i>
      <span class="label">姓名</span>
      <input v-model="title" />
      <i class="icon go">&#xe601;</i>
    </div>
    <div class="group">
      <i class="icon">&#xe60a;</i>
      <span class="label">联系方式</span>
      <input v-model="title" />
      <i class="icon go">&#xe601;</i>
    </div>
    <div class="group">
      <div class="public">
        <span><i class="icon">&#xe633;</i>公开信息</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      imageCountLimit:9,
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
        ext: [
          {
            extId: 1,
            extTitle: "图片1",
            extContent: `/static/img/homeshare.jpg`,
            extOrder: 0,
            extType: 1,
            extPublic: true,
            listId: 1,
          },
          {
            extId: 2,
            extTitle: "图片2",
            extContent: "/static/img/homeshare.jpg",
            extOrder: 0,
            extType: 1,
            extPublic: true,
            listId: 1,
          },
        ],
      },
      addImage:[

      ]
    };
  },
  computed: {
    ...mapState({
      selectProject: state => state.SupplyDemand.selectProject
    }),
    imageList() {
      if (!this.supplyModel.ext || this.supplyModel.ext.length == 0) return [];

      return this.supplyModel.ext.filter((item) => {
        return (item.extType = 1);
      });
    },
  },
  methods:{
    async addImageCallback(imgBase64,URI){
      var rep =  await  this.$AssembleAPI.UpLoad({
        "uploadCfg": "e_SupplyAndDemandConfig",
        "sessionName": "",
        "file": {
          "fileName": "图片1",
          "mediaType": "image/jpeg",
          "buffer": imgBase64
        }
      });
      if(rep.ret==0)
      {
        this.addImage.push({
            extId: 0,
            extTitle: "图片1",
            extContent: rep.data.filePath,
            url: rep.data.url,
            extOrder: 0,
            extType: 1,
            extPublic: true,
            listId: 0,
        })
        console.log(this.addImage)
      }
    }
  },
  mounted(){
    if(this.$route.query.listType)
    {
      this.supplyModel.info.listType = parseInt(this.$route.query.listType);
      if (this.isMP)
      {
        console.log(this.supplyModel.info.listType)
        switch (this.supplyModel.info.listType)
        {
          case 1:{
              wx.setNavigationBarTitle({ title: `发布企业需求` });
            break;
          }
          case 2:{
              wx.setNavigationBarTitle({ title: `发布项目需求` });
            break;
          }
          case 3:{
              wx.setNavigationBarTitle({ title: `发布个人供应` });
            break;
          }
          case 4:{
              wx.setNavigationBarTitle({ title: `发布店铺供应` });
            break;
          }
          case 5:{
              wx.setNavigationBarTitle({ title: `发布企业供应` });
            break;
          }
        }
      }

    }

  }
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
    input {
      font-size: 0.48rem;
      width: 5.18rem;
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
    }
    .tip {
      color: #8590a4;
      background-color: #f5f6f8;
	    border-radius: 0.35rem;
      padding:0.47rem 0.28rem 0.41rem 0.41rem;
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

    &>.icon, &.project> .info .icon {
      color: #fff;
      background-color: #bfbfbf;
      border-radius: 50%;
      width: 0.5rem;
      height: 0.5rem;
      line-height: 0.5rem;
      font-size: 0.3rem;
      text-align: center;
    }
    
    >.label,&.project> .info .label{
      margin-left: 0.2rem;
      width: 4.08rem;
    }
    &>.icon.go, &.project> .info .icon.go {
      background-color: transparent;
      color: #e6e6e6;
      font-size: 0.7rem;
      font-weight: 800;
    }
    .public {
      font-size: 0.35rem;
      color: #0c64ea;
      display: flex;
      justify-content: flex-end;
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
          background-color: #fff;
          color: #fff;
          text-align: center;
          line-height: 0.32rem;
          font-size: 0.3rem;
          margin-right: 0.1rem;
        }
      }
    }
    .public.action{
         .icon{
           background-color: #0c64ea;
         } 
    }
  }
  .group.project{
      display: block;
      border-bottom: 0;
      padding-bottom: 0;
      > .info{
        display: flex;
        align-items: center;
        input{
          overflow:hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      > .item{
        li{
          display: flex;
          align-items: center;
          padding:0.58rem 0;
          border-bottom: 0.02rem solid #ebebeb;
          font-size: 0.4rem;
          i{
            margin-left: 0.58rem;
            color: #8c8c8c;
            font-size: 0.6rem;
          }
          span,input{
            flex-grow:2;
            text-align: right;
            color: #333333;
            margin-right: 0.86rem;
          }
          span.label{
            margin-left: 0.26rem;
            margin-right:0;
            text-align: left;
            flex-grow:0;
            color: #8c8c8c;
          }

        }

      }
  }
}
</style>