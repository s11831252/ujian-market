<!--
 * @Author: SuChonghua
 * @Date: 2021-09-27 10:04:33
 * @LastEditTime: 2021-12-28 17:52:43
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
            <i class="icon" @click="removeOld(item)">&#xe613;</i>
            <img :src="item.extContent" />
          </div>
          <div class="item" v-for="(item, index) in addImage" :key="index">
            <i class="icon" @click="deleteNew(item)">&#xe613;</i>
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
    <div class="group" v-if="supplyModel.info.listType == '1' ||supplyModel.info.listType == '5' " @click="go({ path: '/pages/supply-demand/select', query: { type: 'corp' } })">
      <i class="icon">&#xe66f;</i>
      <span class="label">公司</span>
      <input readonly disabled placeholder="请选择公司" :value="selectCorp && selectCorp.eName" />
      <i class="icon go">&#xe601;</i>
    </div>
    <div class="group" v-if="supplyModel.info.listType == '4'">
      <i class="icon">&#xe628;</i>
      <span class="label">店铺名</span>
      <input readonly disabled :value="myShop.sName" />
      <i class="icon go"></i>
    </div>
    <div class="group" v-if="supplyModel.info.listType == '4'">
      <i class="icon">&#xe661;</i>
      <span class="label">身份</span>
      <input readonly disabled :value="myShop.Role == 99 ? '管理员' : '店员'" />
      <i class="icon go"></i>
    </div>
    <div class="group goods" v-if="supplyModel.info.listType == '4'">
      <div class="info">
        <i class="icon">&#xe655;</i>
        <span class="label">推荐商品</span>
        <i class="icon go" @click="go({ path: '/pages/supply-demand/selectGoods', query: { sId: myShop.sId } })"
          ><span>添加商品({{ selectGoods.length }}/3)</span>&#xe601;</i>
      </div>

      <ul class="selected-goods">
        <li v-for="(item, index) in selectGoods" :key="index">
          <i class="icon" @click="setSelecGoods(item)">&#xe613;</i>
          <img :src="item.Images && item.Images.length > 0 ? item.Images[0].Thumbnail_url : ''" />
          <div class="title">{{ item.gName }}</div>
          <div class="num">已售{{ item.Sales }}件</div>
          <div class="price">¥{{ item.gType==1?'议价商品':item.Price  }}</div>
        </li>
      </ul>
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
      <input placeholder="请输入联系方式" v-model="contact.extContent" />
      <i class="icon go"></i>
    </div>
    <div class="public" :class="{ action: contact.extPublic }">
      <span @click="contact.extPublic = !contact.extPublic"><i class="icon">&#xe633;</i>公开信息</span>
    </div>
    <button class="post" @click="post">发布</button>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      imageCountLimit: 9,
      titleLenghtLimit: 30,

      supplyModel: {
        info: {
          listId: 0,
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
      corp_ext: {
        extTitle: "企业",
        extContent: "",
        extOrder: 0,
        extType: 4,
        extPublic: true,
      },
      shop_ext: {
        extTitle: "店铺",
        extContent: "",
        extOrder: 0,
        extType: 5,
        extPublic: true,
      },
      delExt:[],
      ptext0: {
        extTitle: "项目名称",
        extContent: "",
        extOrder: 0,
        extType: 7,
        extPublic: true,
      },
      ptext1: {
        extTitle: "项目规模",
        extContent: "",
        extOrder: 0,
        extType: 7,
        extPublic: true,
      },
      ptext2: {
        extTitle: "总投资",
        extContent: "",
        extOrder: 0,
        extType: 7,
        extPublic: true,
      },
      ptext3: {
        extTitle: "计划工期",
        extContent: "",
        extOrder: 0,
        extType: 7,
        extPublic: true,
      },
      ptext4: {
        extTitle: "建设单位",
        extContent: "",
        extOrder: 0,
        extType: 7,
        extPublic: true,
      },
      ptext5: {
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
      address: {
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
      goods_ext:[],
    };
  },
  computed: {
    ...mapState({
      selectProject: (state) => state.SupplyDemand.selectProject,
      selectCorp: (state) => state.SupplyDemand.selectCorp,
      selectGoods: (state) => state.SupplyDemand.selectGoods,
      userInfo: (state) => state.User.UserInfo,
      myShop: (state) => state.User.myShop,
    }),
    imageList() {
      if (!this.supplyModel.ext || this.supplyModel.ext.length == 0) return [];

      return this.supplyModel.ext.filter((item) => {
        return item.extType == 1;
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
      }
    },
    removeOld(olditem)
    {
      var old = this.supplyModel.ext.find(item=>item.listId==olditem.listId);
      var index =  this.supplyModel.ext.indexOf(old);
      this.supplyModel.ext.splice(index,1);
      this.delExt.push(old)
    },
    deleteNew(newItem)
    {
      var index =  this.addImage.indexOf(newItem);
      this.addImage.splice(index,1);
      console.log(this.addImage)
    },
    async post() {
      var that = this;
      var postData = {
        info: this.supplyModel.info,
        ext: [],
      };
      if (!postData.info.title) {
        that.toast("请输入标题");
        return;
      }
      if (!postData.info.content) {
        that.toast("请输入内容");
        return;
      }
      postData.ext.push(that.name);
      postData.ext.push(that.address);
      postData.ext.push(that.contact);

      if (postData.info.listType == 2) {
        if (!that.ptext0.extContent) {
          that.toast("请选择项目");
          return;
        }
        if(!that.ptext1.extContent||!that.ptext2.extContent||!that.ptext3.extContent||!that.ptext4.extContent||!that.ptext4.extContent)
        {
          that.toast("请完善项目信息");
          return;
        }
        postData.ext.push(that.ptext0);
        postData.ext.push(that.ptext1);
        postData.ext.push(that.ptext2);
        postData.ext.push(that.ptext3);
        postData.ext.push(that.ptext4);
        postData.ext.push(that.ptext5);
      } else if (postData.info.listType == 1 || postData.info.listType == 5) {
        if (!that.selectCorp) {
          that.toast("请选择企业");
          return;
        }
        postData.ext.push({
          extId: that.selectCorp.extId||0,
          extTitle: that.selectCorp.eName,
          extContent: that.selectCorp.eId,
          extOrder: 0,
          extType: 4,
          extPublic: true,
          listId: that.selectCorp.listId||0,
        });
      } else if (postData.info.listType == 4) {

        this.shop_ext.extTitle = that.myShop.sName;
        this.shop_ext.extContent = that.myShop.sId;

        if (!that.selectGoods || that.selectGoods.length < 1) {
          that.toast("请选择商品");
          return;
        }
        for (let index = 0; index < that.selectGoods.length; index++) {
          const element = that.selectGoods[index];
          postData.ext.push({
            extId: element.extId||0,
            extTitle: element.gName,
            extContent: element.gId,
            extOrder: 0,
            extType: 6,
            extPublic: true,
            listId: element.listId||0,
          });
        }
        that.goods_ext.forEach(item=>{
          if(!that.selectGoods.find(i=>item.extId==i.extId)){
            that.delExt.push(item);
          }
        })
      }
      // // console.log(postData);
      if(postData.info.listId>0)//编辑
      {
        postData.modifyExt = postData.ext.filter(item=>item.extId>0);
        postData.delExt = this.delExt;
        postData.ext= postData.ext.filter(item=>item.extId==0);
        postData.ext = postData.ext.concat(this.addImage);
        // console.log(postData)
        var rep = await that.$SupplyAndDemandAPI.SupplyAndDemand_Modify(postData);
        if (rep.ret == 0&&rep.data) {
          that.toast("编辑成功");
          that.$router.replace({ path: "/pages/supply-demand/post", query: { listId: postData.info.listId } });
        }else
        {
          that.toast(rep.msg);
        }
      }else{//新发布
        postData.ext = postData.ext.concat(that.addImage);
        var rep = await that.$SupplyAndDemandAPI.SupplyAndDemand_Create(postData);
        if (rep.ret == 0&&rep.data) {
          that.toast("发布成功");
          that.$router.replace({ path: "/pages/supply-demand/post", query: { listId: rep.data } });
        }else
        {
          that.toast(rep.msg);
        }
      }

    },
    setTitle() {
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
    },
    setSelecGoods(item){
      if(this.supplyModel.info.listId>0)
      {
        this.delExt.push({
            extId: item.extId||0,
            extTitle: item.gName,
            extContent: item.gId,
            extOrder: 0,
            extType: 6,
            extPublic: true,
            listId: item.listId||0,
          })
      }
      this.setgoods(item)
    },
    ...mapActions({setgoods:"setSelecGoods"}),
    ...mapMutations(["setSelectProject", "setSelectCorp", "clearSelecGoods"]),
  },
  onUnload() {
    this.setSelectProject(null);
    this.setSelectCorp(null);
    this.clearSelecGoods();
  },
  onShow() {
    // console.log("onShow",this.supplyModel.info.listType)

    switch (this.$route.query.listType) {
      case "1": {
        this.address.extContent = this.address.extContent || (this.selectCorp && this.selectCorp.Address);
        this.supplyModel.info.cityCode = this.supplyModel.info.cityCode || (this.selectCorp && this.$store.getters.getAreaCodeInfoById(this.selectCorp.Area));
        this.supplyModel.info.gps_lng = this.supplyModel.info.gps_lng || (this.selectCorp && this.selectCorp.Longitude);
        this.supplyModel.info.gps_lat = this.supplyModel.info.gps_lat || (this.selectCorp && this.selectCorp.Latitude);
        break;
      }
      case "2": {
        this.ptext0.extContent = (this.selectProject && this.selectProject.ProjectName)
        this.address.extContent = this.address.extContent || (this.selectProject && this.selectProject.Address);
        this.supplyModel.info.cityCode = this.supplyModel.info.cityCode || (this.selectProject && this.$store.getters.getAreaCodeInfoById(this.selectProject.AreaId));
        this.supplyModel.info.gps_lng = this.supplyModel.info.gps_lng || (this.selectProject && this.selectProject.Longitude);
        this.supplyModel.info.gps_lat = this.supplyModel.info.gps_lat || (this.selectProject && this.selectProject.Latitude);
        break;
      }
      case "3": {
        break;
      }
      case "4": {
        this.address.extContent = this.address.extContent || (this.myShop && this.myShop.Address);
        this.supplyModel.info.cityCode = this.supplyModel.info.cityCode || (this.myShop && this.$store.getters.getAreaCodeInfoById(this.myShop.AreaId));
        this.supplyModel.info.gps_lng = this.supplyModel.info.gps_lng || (this.myShop && this.myShop.Longitude);
        this.supplyModel.info.gps_lat = this.supplyModel.info.gps_lat || (this.myShop && this.myShop.Latitude);
        break;
      }
      case "5": {
        this.address.extContent = this.address.extContent || (this.selectCorp && this.selectCorp.Address);
        this.supplyModel.info.cityCode = this.supplyModel.info.cityCode || (this.selectCorp && this.$store.getters.getAreaCodeInfoById(this.selectCorp.Area));
        this.supplyModel.info.gps_lng = this.supplyModel.info.gps_lng || (this.selectCorp && this.selectCorp.Longitude);
        this.supplyModel.info.gps_lat = this.supplyModel.info.gps_lat || (this.selectCorp && this.selectCorp.Latitude);
        break;
      }
    }
    this.contact.extContent = this.contact.extContent || this.userInfo.Phone;
    this.name.extContent = this.name.extContent || this.userInfo.UserName;
    this.supplyModel.info.bindId = this.supplyModel.info.bindId || this.userInfo.UserId;
  },
  async mounted() {
    if (this.$route.query.listType) {
      this.supplyModel.info.listType = parseInt(this.$route.query.listType);
      this.setTitle();
    }
    if (this.$route.query.listId) {
      var rep = await this.$SupplyAndDemandAPI.SupplyAndDemand_Detail(this.$route.query.listId);
      if (rep.ret == 0) {
        this.supplyModel.info = rep.data.info;
        var extList = rep.data.ext.map((item) => {
          return item.ext;
        });
        if(this.supplyModel.info.listType==1||this.supplyModel.info.listType==5)
        {
          var _corp = rep.data.ext.find((item) => {
            return item.ext.extType==4
          });
          if(_corp)
          {
            this.setSelectCorp({..._corp.enterprise,extId:_corp.ext.extId,listId:_corp.ext.listId})
          }
        }
        else if(this.supplyModel.info.listType==2)
        {
          var _project = extList.find((item) => {
            return item.extType==7&&item.extTitle=='项目名称'
          });
          if(_project)
          {
            this.ptext0=_project;
          }
        }else if(this.supplyModel.info.listType==4)
        {
          var _shop = extList.find((item) => {
            return item.extType==5
          });
          if(_shop)
          {
            this.shop_ext = _shop;
          }
          
          var _goodslist = rep.data.ext.filter((item) => {
            return item.ext.extType==6
          });
          this.clearSelecGoods();
          for (let index = 0; index < _goodslist.length; index++) {
            const element = _goodslist[index];
            var {sId,gId,sales,price_min,gName,imageLogo} = element.goods
            var goods = {
              extId:element.ext.extId,
              listId:element.ext.listId,
              sId,
              gId,
              Sales:sales,
              Price:price_min,
              gName,Images:[{Thumbnail_url:imageLogo}]
            };
            this.setgoods(goods);
            this.goods_ext.push(goods)
          }
        }
        
        this.contact = extList.find((item) => {
          return item.extType == 3;
        });
        this.name = extList.find((item) => {
          return item.extType == 2;
        });
        this.supplyModel.ext = extList.filter((item) => {
          return item.extType == 1;
        });
        this.address = extList.find((item) => {
          return item.extType == 7 && item.extTitle == "地址";
        });
        this.ptext1 = extList.find((item) => {
          return item.extType == 7 && item.extTitle == "项目规模";
        });
        this.ptext2 = extList.find((item) => {
          return item.extType == 7 && item.extTitle == "总投资";
        });
        this.ptext3 = extList.find((item) => {
          return item.extType == 7 && item.extTitle == "计划工期";
        });
        this.ptext4 = extList.find((item) => {
          return item.extType == 7 && item.extTitle == "建设单位";
        });
        this.ptext5 = extList.find((item) => {
          return item.extType == 7 && item.extTitle == "设计单位";
        });
      }
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
    .block {
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
        position: relative;
        border-radius: 0.2rem;
        i.icon{
          border-radius: 0.2rem;
          position: absolute;
          top: 0;
          right: 0;
          width: 0.47rem;
          height: 0.47rem;
          text-align: center;
          line-height: 0.47rem;
          font-size: 0.3rem;
          color:#fff;
          background-color: rgba(121,121,121,0.7);
        }
        img {
          width: 2.94rem;
          height: 2.93rem;
          border-radius: 0.2rem;
        }
      }
    }

    & > .icon,
    &.project > .info .icon,
    &.goods > .info .icon {
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
    &.project > .info .label,
    &.goods > .info .label {
      margin-left: 0.2rem;
      width: 3.08rem;
    }
    & > .icon.go,
    &.project > .info .icon.go,
    &.goods > .info .icon.go {
      background-color: transparent;
      color: #e6e6e6;
      font-size: 0.7rem;
      font-weight: 800;
    }
    &.goods > .info .icon.go {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      span {
        font-size: 0.4rem;
        margin-right: 0.4rem;
        color: #b3b3b3;
      }
      flex-grow: 1;
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
  .group.goods {
    display: block;
    border-bottom: 0;
    padding-bottom: 0;
    .info {
      display: flex;
      align-items: center;
      input {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .selected-goods {
      display: flex;
      align-items: center;
      margin-top: 0.46rem;
      li {
        width: 2.82rem;
        background-color: #f5faff;
        border-radius: 0.15rem;
        padding: 0 0.18rem;
        position: relative;
        i.icon {
          position: absolute;
          width: 0.47rem;
          height: 0.47rem;
          line-height: 0.47rem;
          border-radius: 0.06rem;
          border-top-right-radius: 0.11rem;
          background-color: #7a7d7f;
          color: #fff;
          font-size: 0.25rem;
          text-align: center;
          top: 0;
          right: 0;
        }
        img {
          margin-top: 0.56rem;
          display: block;
          margin-top: 0.59rem;
          width: 2.82rem;
          height: 2.55rem;
        }
        .title {
          margin-top: 0.15rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 0.33rem;
          color: #111111;
        }
        .num {
          margin-top: 0.22rem;
          color: #999999;
          font-size: 0.25rem;
        }
        .price {
          margin-top: 0.22rem;
          color: #f19149;
          font-size: 0.42rem;
          margin-bottom: 0.33rem;
        }
      }
      li:nth-of-type(1n + 2) {
        margin-left: 0.2rem;
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
  button.post {
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