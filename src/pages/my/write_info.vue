<template>
  <div class="index">
    <div class="content">
      <div class="fill">
        <div class="fillDemo">
          <div class="fill_title">店主姓名:</div>
          <p class="fill_name">{{UserInfo.UserName}}</p>
        </div>
        <div class="fillDemo">
          <div class="fill_title">店铺名称:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <input class="fill_input" v-model.lazy="CreateShoppingInfo.sName" placeholder="填写店铺名称" type="text">
              <p class="fill_fuhao">※</p>
            </div>
            <p class="fill_hint">注：最多10个字</p>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">店铺Logo:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <img class="fill_addimg" :src="sLogoPath[0]" v-if="sLogoPath.length>0" @click="chooseImage">
              <img class="fill_addimg" v-else src="/static/img/Images.png" @click="chooseImage" alt>
              <p class="fill_fuhao">※</p>
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">手机号码:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <input class="fill_input" placeholder="填写手机号码" v-model.lazy="CreateShoppingInfo.Mobile" type="text">
              <p class="fill_fuhao">※</p>
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">固定电话:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <input class="fill_input" placeholder="填写固定电话" v-model.lazy="CreateShoppingInfo.Tel" type="text">
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">店铺地址:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <myDrop :options="AreaList_level1" :onSelected="AreaSelected"></myDrop>
              <myDrop :options="AreaList_level2" :onSelected="Area2Selected"></myDrop>
              <div class="fillBtn" @click="chooseLocation">点击设置</div>
              <input class="fill_input2" placeholder="请填写店铺详细地址" v-model.lazy="CreateShoppingInfo.Address" type="text">
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">店铺类型:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <!-- <div class="selectDiv2">
                <select>
                  <option value="1">选择类型</option>
                  <option value="2">选择类型</option>
                </select>
                <div class="sjxDiv">
                  <img class="sjx" src="/static/img/next_bottom.png" alt>
                </div>
              </div>-->
              <myDrop :options="KeywordListfilter" :onSelected="KeywordSelected"></myDrop>
              <p class="fill_fuhao">※</p>
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">主营商品:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <myDrop :options="GoodsKeywordTypeFilter" :onSelected="GoodsKeywordSelected"></myDrop>
              <myDrop :options="GoodsKeywordTypeFilter_Sub" :onSelected="GoodsKeywordSelected_Sub"></myDrop>
              <p class="fill_fuhao">※</p>
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">店铺介绍:</div>
          <div class="fill_editDiv">
            <textarea class="fill_edit" v-if="showtextarea" @blur="clickshowtextarea" auto-focus="true" placeholder="请填入店铺介绍..." v-model.lazy="CreateShoppingInfo.Brief" contenteditable="true"></textarea>
            <div class="fill_edit"  @click="clickshowtextarea" v-else >{{CreateShoppingInfo.Brief}}</div>
            <div class="fill_edit_hint">{{CreateShoppingInfo.Brief.length}}/200</div>
          </div>
        </div>
      </div>
      <div class="nextBtn" @click="next">下一步</div>
    </div>
  </div>
</template>
<script>
import myDrop from "@/components/myDrop";
import { mapState } from "vuex";

export default {
  components: {
    myDrop
  },
  data() {
    return {
      showtextarea:false,
      sId: null,
      KeywordList: [],
      GoodsKeywordType: [],
      AreaList: [],
      GoodsKeywordSelectItem: {},
      AreaSelectedItem: {},
      CreateShoppingInfo: {
        sName: "",
        Brief: "",
        Address: "",
        BusinessHours: "",
        Mobile: "",
        Tel: "",
        sType: 0,
        MainType: 0,
        AreaId: 0,
        Latitude: 0,
        Longitude: 0
      },
      sLogoPath: [],
      sLogo: []
    };
  },
  computed: {
    ...mapState({
      UserInfo: state => state.User.UserInfo
    }),
    KeywordListfilter() {
      var temp = this.KeywordList.map(item => {
        return { text: item.KeywordName, value: item.KeywordId };
      });
      return temp;
    },
    GoodsKeywordTypeFilter() {
      if (this.GoodsKeywordType && this.GoodsKeywordType.length > 0) {
        var temp = this.GoodsKeywordType.filter(item => {
          return item.ParentId == 0;
        }).map(item => {
          return { text: item.KeywordName, value: item.KeywordId };
        });
        return temp;
      } else {
        return [];
      }
    },
    GoodsKeywordTypeFilter_Sub() {
      // console.log("这里触发了",this.GoodsKeywordSelectItem)
      var that = this;
      if (
        this.GoodsKeywordSelectItem &&
        this.GoodsKeywordType.length > 0 &&
        this.GoodsKeywordSelectItem
      ) {
        var temp = this.GoodsKeywordType.filter(item => {
          return (
            item.ParentId != 0 &&
            item.ParentId == that.GoodsKeywordSelectItem.value
          );
        }).map(item => {
          return { text: item.KeywordName, value: item.KeywordId };
        });
        return temp;
      } else {
        return [];
      }
    },
    AreaList_level1() {
      if (this.AreaList && this.AreaList.length > 0) {
        var _temp = this.AreaList.filter(item => {
          return item.ParentId == 0;
        }).map(item => {
          return {
            text: item.KeywordName,
            value: item.KeywordId,
            ParentId: item.ParentId
          };
        });
        return _temp;
      } else return [];
    },
    AreaList_level2() {
      if (this.AreaList && this.AreaList.length > 0) {
        if (this.AreaSelectedItem && this.AreaSelectedItem.ParentId == 0) {
          var _temp = this.AreaList.filter(item => {
            return item.ParentId == this.AreaSelectedItem.value;
          }).map(item => {
            return {
              text: item.KeywordName,
              value: item.KeywordId,
              ParentId: item.ParentId
            };
          });
          return _temp;
        } else {
          // var _temp = this.AreaList.filter(item=>{
          //   return item.ParentId==this.AreaSelectedItem.ParentId;
          // }).map(item=>{
          //   return { text: item.KeywordName, value: item.KeywordId,ParentId:item.ParentId };
          // })
          // return _temp;
        }
      } else return [];
    },
    //如果传入sId 则查找一级城市选中的AreaId
    AreaId1() {
      if (this.sId) {
        var areainfo = this.AreaList.find(item => {
          return item.KeywordId == this.CreateShoppingInfo.AreaId;
        });
        if (areainfo) {
          if (areainfo.ParentId == 0) {
            return areainfo.KeywordId;
          } else {
            return areainfo.ParentId;
          }
        }
      }
      return 0;
    }
  },
  methods: {
    clickshowtextarea(){
      // debugger;
      this.showtextarea=!this.showtextarea;
    },
    KeywordSelected(item) {
      this.CreateShoppingInfo.sType = item.value;
    },
    AreaSelected(item) {
      this.AreaSelectedItem = item;
      this.CreateShoppingInfo.AreaId = item.value;
    },
    Area2Selected(item) {
      this.CreateShoppingInfo.AreaId = item.value;
    },
    GoodsKeywordSelected(item) {
      this.GoodsKeywordSelectItem = item;
      this.CreateShoppingInfo.MainType = item.value;
    },
    GoodsKeywordSelected_Sub(item) {
      this.CreateShoppingInfo.MainType = item.value;
    },
    chooseLocation() {
      var that = this;
      wx.chooseLocation({
        success(res) {
          // console.log(res);
          that.CreateShoppingInfo.Latitude = res.latitude;
          that.CreateShoppingInfo.Longitude = res.longitude;
          that.CreateShoppingInfo.Address = res.address+that.CreateShoppingInfo.Address;
        }
      });
    },
    //选择图片
    chooseImage() {
      var that = this;
      if (this.sLogo.length <= 1) {
        wx.chooseImage({
          sizeType: ["original", "compressed"], //所选的图片的尺寸
          //接口调用成功的回调函数
          success: function(res) {
            if (res.tempFilePaths.length > 0) {
              that.sLogo.push(res.tempFilePaths[0]);
              that.sLogoPath.splice(0, 1, res.tempFilePaths[0]);
            }
          }
        });
      } else {
        that.toast("最多上传1张图片");
      }
    },
    async next() {
      if (!this.CreateShoppingInfo.sName) {
        this.toast("请输入店铺名称");
        return;
      }
      if (this.sId) {
        var data = {
          sName: this.CreateShoppingInfo.sName,
          Brief: this.CreateShoppingInfo.Brief,
          Address: this.CreateShoppingInfo.Address,
          BusinessHours:this.CreateShoppingInfo.BusinessHours,
          Mobile: this.CreateShoppingInfo.Mobile,
          Tel: this.CreateShoppingInfo.Tel,
          sType: this.CreateShoppingInfo.sType,
          MainType: this.CreateShoppingInfo.MainType,
          AreaId: this.CreateShoppingInfo.AreaId,
          Latitude: this.CreateShoppingInfo.Latitude,
          Longitude: this.CreateShoppingInfo.Longitude,
        };
        var rep = await this.$ShoppingAPI.Shop_CreateToo(
          this.sId,
          data,
          this.sLogo,
          ["sLogo"]
        );
        if (rep instanceof Array) rep = rep[0];
        if (rep.ret == 0) {
          this.go({
            path: "/pages/my/write_license",
            query: { sId: this.sId }
          });
        }
      } else {
        if (rep instanceof Array) rep = rep[0];
        var rep = await this.$ShoppingAPI.Shop_CreateEasy(
          this.CreateShoppingInfo,
          this.sLogo,
          ["sLogo"]
        );
        if (rep.ret == 0) {
          this.go({ path: "/pages/my/write_license", query: { sId: rep.ret } });
        }
      }
    }
  },
  async mounted() {
    if (this.$route.query.sId) {
      //从外面传进来的sId店铺标识
      this.sId = this.$route.query.sId;
      var rep = await this.$ShoppingAPI.Shop_GetDetails({ sId: this.sId });
      if (rep.ret == 0) {
        this.CreateShoppingInfo = rep.data;
        if (this.CreateShoppingInfo.sLogo)
          this.sLogoPath.push(this.CreateShoppingInfo.sLogo);
      }
    }

    var rep = await this.$ShoppingAPI.CommonInfo_GetKeywordType();
    if (rep.ret == 0) {
      this.KeywordList = rep.data;
    }

    var rep2 = await this.$ShoppingAPI.CommonInfo_GetGoodsKeywordType();
    if (rep2.ret == 0) {
      this.GoodsKeywordType = rep2.data;
    }

    var rep3 = await this.$UJAPI.GetKeyword({ TypeId: 4 });
    if (rep3.ret == 0) {
      this.AreaList = rep3.data;
    }
  }
};
</script>
<style scoped>
page{
  padding-bottom: 30rem;
}
</style>
