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
              <input class="fill_input" placeholder="填写店铺名称" type="text">
              <p class="fill_fuhao">※</p>
            </div>
            <p class="fill_hint">注：最多10个字</p>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">店铺Logo:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <img class="fill_addimg" src="/static/img/addImg.png" alt>
              <p class="fill_fuhao">※</p>
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">手机号码:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <input class="fill_input" placeholder="填写手机号码" type="text">
              <p class="fill_fuhao">※</p>
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">固定电话:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <input class="fill_input" placeholder="填写固定电话" type="text">
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">店铺地址:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <myDrop :options="AreaList_level1" :onSelected="AreaSelected"></myDrop>
              <myDrop :options="AreaList_level2" :onSelected="Area2Selected"></myDrop>
              <div class="fillBtn">点击设置</div>
              <input class="fill_input2" placeholder="请填写店铺详细地址" type="text">
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
            <textarea class="fill_edit" placeholder="请填入店铺介绍..." contenteditable="true"></textarea>
            <div class="fill_edit_hint">0/200</div>
          </div>
        </div>
      </div>
      <div class="nextBtn">下一步</div>
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
      KeywordList: [],
      GoodsKeywordType: [],
      AreaList:[],
      GoodsKeywordSelectItem: {},
      AreaSelectedItem:{},
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
      if(this.GoodsKeywordType&&this.GoodsKeywordType.length>0)
      {
        var temp = this.GoodsKeywordType.filter(item => {
          return item.ParentId == 0;
        }).map(item => {
          return { text: item.KeywordName, value: item.KeywordId };
        });
        return temp;
      }else
      {
        return [];
      }
    },
    GoodsKeywordTypeFilter_Sub() {
      // console.log("这里触发了",this.GoodsKeywordSelectItem)
      var that =this;
      if (this.GoodsKeywordSelectItem&&this.GoodsKeywordType.length>0&&this.GoodsKeywordSelectItem) {
        var temp = this.GoodsKeywordType.filter(item => {
          return item.ParentId !=0 && item.ParentId == that.GoodsKeywordSelectItem.value;
        }).map(item => {
          return { text: item.KeywordName, value: item.KeywordId };
        });
        return temp;
      } else {
        return [];
      }
    },
    AreaList_level1(){
      if(this.AreaList&&this.AreaList.length>0)
      {
        var _temp = this.AreaList.filter(item=>{
          return item.ParentId==0;
        }).map(item=>{
          return { text: item.KeywordName, value: item.KeywordId, ParentId:item.ParentId};
        })
        return _temp;
      }
      else
        return [];
    },
    AreaList_level2(){
      if(this.AreaList&&this.AreaList.length>0)
      {
        if(this.AreaSelectedItem&&this.AreaSelectedItem.ParentId==0)
        {
          var _temp = this.AreaList.filter(item=>{
            return item.ParentId==this.AreaSelectedItem.value;
          }).map(item=>{
            return { text: item.KeywordName, value: item.KeywordId,ParentId:item.ParentId };
          })
          return _temp;
        }else{
          // var _temp = this.AreaList.filter(item=>{
          //   return item.ParentId==this.AreaSelectedItem.ParentId;
          // }).map(item=>{
          //   return { text: item.KeywordName, value: item.KeywordId,ParentId:item.ParentId };
          // })
          // return _temp;
        }

      }
      else
        return [];
    }
  },
  methods: {
    KeywordSelected(item) {
      // console.log(item);
    },
    AreaSelected(item){
      // console.log(item);
      this.AreaSelectedItem=item;
    },
    Area2Selected(item)
    {
       console.log(item);
    },
    GoodsKeywordSelected(item) {
      // console.log(item);
      this.GoodsKeywordSelectItem=item;
    },
    GoodsKeywordSelected_Sub(item) {
      // console.log(item);
    }
  },
  async mounted() {
    var rep = await this.$ShoppingAPI.CommonInfo_GetKeywordType();
    if (rep.ret == 0) {
      this.KeywordList = rep.data;
    }

    var rep2 = await this.$ShoppingAPI.CommonInfo_GetGoodsKeywordType();
    if (rep2.ret == 0) {
      this.GoodsKeywordType = rep2.data;
    }

    var rep3 = await this.$UJAPI.GetKeyword({TypeId:4});
    if(rep3.ret==0)
    {
      this.AreaList = rep3.data;
    }
  }
};
</script>
<style>
</style>
