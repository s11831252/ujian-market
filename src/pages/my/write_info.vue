<template>
  <div class="index">
    <div class="content">
      <div class="fill">
        <div class="fillDemo">
          <div class="fill_title">店主姓名:</div>
          <p class="fill_name">程方益</p>
        </div>
        <div class="fillDemo">
          <div class="fill_title">店铺名称:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <input class="fill_input" type="text">
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
              <input class="fill_input" type="text">
              <p class="fill_fuhao">※</p>
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">固定电话:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <input class="fill_input" type="text">
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">店铺地址:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <div class="selectDiv">
                <select>
                  <option value="1">广西壮族自治区</option>
                  <option value="2">广东</option>
                </select>
                <div class="sjxDiv">
                  <img class="sjx" src="/static/img/next_bottom.png" alt>
                </div>
              </div>
              <div class="selectDiv">
                <select>
                  <option value="1">南宁</option>
                  <option value="2">玉林</option>
                </select>
                <div class="sjxDiv">
                  <img class="sjx" src="/static/img/next_bottom.png" alt>
                </div>
              </div>
              <div class="fillBtn">点击设置</div>
              <input class="fill_input2" type="text">
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
              <!-- <div class="selectDiv2">
                <select>
                  <option value="1">主营商品</option>
                  <option value="2">机械设备</option>
                  <option value="2">劳保安防...</option>
                  <option value="2">几点设备</option>
                  <option value="2">电工电气</option>
                  <option value="2">机械设备</option>
                  <option value="2">机械设备</option>
                </select>
                <div class="sjxDiv">
                  <img class="sjx" src="/static/img/next_bottom.png" alt>
                </div>
              </div>-->
              <!-- <div class="selectDiv2">
                <select>
                  <option value="1">主营商品</option>
                  <option value="2">机械设备</option>
                  <option value="2">劳保安防...</option>
                  <option value="2">几点设备</option>
                  <option value="2">电工电气</option>
                  <option value="2">机械设备</option>
                  <option value="2">机械设备</option>
                </select>
                <div class="sjxDiv">
                  <img class="sjx" src="/static/img/next_bottom.png" alt>
                </div>
              </div>-->
              <p class="fill_fuhao">※</p>
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">店铺介绍:</div>
          <div class="fill_editDiv">
            <div class="fill_edit" contenteditable="true"></div>
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

export default {
  components: {
    myDrop
  },
  data() {
    return {
      KeywordList: [],
      GoodsKeywordType: [],
      GoodsKeywordSelectItem: {}
    };
  },
  computed: {
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
    }
  },
  methods: {
    KeywordSelected(item) {
      // console.log(item);
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
  }
};
</script>
<style>
</style>
