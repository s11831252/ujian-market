<!--
 * @Author: SuChonghua
 * @Date: 2021-11-17 17:12:21
 * @LastEditTime: 2021-12-03 16:01:21
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\manage.vue
-->
<template>
  <div class="root">
    <ul class="navbar">
      <li v-for="(item, index) in Tabs" :key="index" :id="index" :class="{ navbar_item_on: activeIndex == index }" class="navbar_item" @click="tabClick(item, $event)">
        <div class="navbar_title">{{ item.name }}</div>
      </li>
    </ul>
    <div class="navbar_slider" :class="navbarSliderClass"></div>
    <ul class="data-list" v-if="datalist&&datalist.length>0">
      <manageItem v-for="(item,index) in datalist" :key="index" :item="item" @del="del" @refreshTime="RefreshTime" @addShowDays="AddShowDays" @stop="stop" @more="more"></manageItem>
    </ul>
    <ul class="data-list" v-else>
      <li class="not404">
        <img src="../../../static/img/sd404.png">
        <button @click="go({path:'/pages/supply-demand/release'})">立即发布</button>
      </li>
    </ul>
    <div class="more-box" :class="{ open: moreBox_open }">
      <div class="mask"></div>
      <div class="wrapper" @click="moreBox_open = false;">
        <div class="wrapper_body">
          <div class="menu">
            <div class="item" @click="stop(action_more_Item,true)">停止展示</div>
            <div class="item" @click="del(action_more_Item)">删除供需</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import manageItem from './manage-item.vue'
import { mapState } from "vuex";
export default {
  components:{
    manageItem
  },
  data() {
    return {
      Tabs: [
        {
          name: "全部",
          index: 0,
          parm: {
            PageIndex: 1,
            PageSize: 20,
            OrderType: "DEFAULT",
            hasPage: true,
          },
        },
        {
          name: "供应列表",
          index: 1,
          parm: {
            PageIndex: 1,
            PageSize: 20,
            OrderType: "DEFAULT",
            hasPage: true,
          },
        },
        {
          name: "需求列表",
          index: 2,
          parm: {
            PageIndex: 1,
            PageSize: 20,
            OrderType: "DEFAULT",
            hasPage: true,
          },
        },
        {
          name: "草稿箱",
          index: 3,
          parm: {
            PageIndex: 1,
            PageSize: 20,
            OrderType: "DEFAULT",
            hasPage: true,
          },
        },
      ],
      activeIndex: 0,
      search:{
        type:0,//返回类型,0表示返回所有,1表示供应,2表示需求
        isSelf:1,//是否获取公开的,0表示公开的,1表示自己创建的,2表示后台获取全部
        bindId:"",//返回相关供求，如想返回企业，就传企业ID，店铺就传店铺Id，项目就传项目Id
        pageIndex:1,//当前分页
        pageSize:10,//分页大小
        searchValue:"",//搜索关键词
      },
      datalist:[],
      moreBox_open:false,
      action_more_Item:null
    };
  },
  computed: {
    navbarSliderClass() {
      return "navbar_slider_" + this.activeIndex;
    },
    ...mapState({
        userInfo: (state) => state.User.UserInfo,
    }),
  },
  methods: {
    // 秒数 转为 XX时XX分XX秒   time = 传入的秒数
    formatTime(time) {
      var day =  Math.floor(time / (3600*24))
      var hours = Math.floor(Math.floor(time % (3600*24))/3600)
      var minute = Math.floor(Math.floor(time % 3600) / 60)
      var second = time % 60
      var hours =
        hours.toString().length === 1 ? `0${hours}` : hours
      minute =
        minute.toString().length === 1 ? `0${minute}` : minute
      second =
        second.toString().length === 1 ? `0${second}` : second
      return day +'天'+ hours + '时' + minute + '分'
    },
    tabClick(item, event) {
      this.activeIndex = item.index;
      if(item.index==0)
      {
        this.search.type=0;
        delete this.search.status;
      }else if(item.index==1)
      {
        this.search.type=1;
        delete this.search.status;
        // this.search.status=undefined;
      }else if(item.index==2)
      {
        this.search.type=2;
        delete this.search.status;
        // this.search.status=undefined;
      }else if(item.index==3)
      {
        this.search.type=0;
        this.search.status=0;
      }
      this.datalist=[];
      this.searchData();
    },
    more(item){
      var that = this;
      that.action_more_Item=item;
      that.moreBox_open=true;
    },
    del(item){
      var that =this;
      if(item)
      {
        this.modal({
          content : "确定删除这条供需信息吗？", 
          confirm:async function(){
            var {content,title,status,bindId,cityCode,gps_lat,gps_lng,listId,sendUserId} = item;
            var rep = await that.$SupplyAndDemandAPI.SupplyAndDemand_Modify({info:{content,title,status:status|0b10000,bindId,cityCode,gps_lat,gps_lng,listId,sendUserId}});
            if(rep.ret==0)
            {
              that.toast("删除成功");
            }
            that.action_more_Item=null;
            that.moreBox_open=false;
          }, 
          cancel(){
            that.action_more_Item=null;
            that.moreBox_open=false;
          }, 
          confirmText : "确定", 
          confirmColor : "#12b7f5",
          cancelText : "取消", 
          cancelColor : "#989898",
          showCancel : true 
        })
      }

    },
    stop(item,isstop){
      var that = this;
      if(item)
      {
        that.modal({
          content : `确定${isstop?'停止':'恢复'}展示这条供需信息吗？`, 
          confirm:async function(){
            var {content,title,status,bindId,cityCode,gps_lat,gps_lng,listId,sendUserId} = item;
            var rep = await that.$SupplyAndDemandAPI.SupplyAndDemand_Modify({info:{content,title,status:isstop?status|0b1000:status^0b1000,bindId,cityCode,gps_lat,gps_lng,listId,sendUserId}});
              if(rep.ret == 0&&rep.data)
              {
                that.toast(`${isstop?'停止':'恢复'}展示成功`);
              }
              that.action_more_Item=null;
              that.moreBox_open=false;
          }, 
          cancel(){
            that.action_more_Item=null;
            that.moreBox_open=false;
          }, 
          confirmText : "确定", 
          confirmColor : "#12b7f5",
          cancelText : "取消", 
          cancelColor : "#989898",
          showCancel : true 
        })
      }

    },
    async RefreshTime(item){
      var rep  = await this.$SupplyAndDemandAPI.SupplyAndDemand_RefreshTime(item.listId);
      if(rep.ret == 0&&rep.data)
      {
        this.toast("刷新成功")
      }
    },
    async AddShowDays(item){
      var rep = await this.$SupplyAndDemandAPI.SupplyAndDemand_AddShowDays(item.listId,7);
      if(rep.ret == 0&&rep.data )
      {
        this.toast("延长展示成功")
      }
    },
    async searchData(){
      var rep =  await this.$SupplyAndDemandAPI.SupplyAndDemand_GetList(this.search)
      if(rep.ret==0)
      {
        for (let index = 0; index < rep.data.length; index++) {
          const element = rep.data[index];
          // element.time()
          element.timeStr = this.formatTime(element.timeRemaining);
          this.datalist.push(element)
        }
      }
    }
  },
  mounted(){
    this.searchData();
  }
};
</script>
<style>
body {
  background-color: #edf0f5;
}
</style>
<style lang="scss" scoped>
.root {
  .data-list {
    margin: 0 0.35rem;
    margin-top: 0.51rem;

    .not404{
      img{
        margin:0 auto;
        display: block;
        margin-top:2.69rem;
        margin-bottom:4.33rem;
        width: 5.04rem;
        height: 3.07rem;
      }
      button{
        width: 7.6rem;
        height: 1.24rem;
        border-radius: 0.12rem;
        border: solid 0.03rem #008de7;
        font-size: 0.55rem;
        line-height: 1.24rem;
        color: #008de7;
      }
    }
  }
  .navbar {
    height: 1.09rem;
    line-height: 1.09rem;
    width: 100%;
    // border-bottom: 0.01rem solid #ccc;
    position: relative;
    font-size: 0.41rem;
  }

  .navbar_item {
    text-align: center;
    display: inline-block;
    width: 25%;
  }

  .navbar_item_on {
    color: #12b7f5;
  }

  .navbar_title {
    font-weight: 500;
    display: inline-block;
  }

  .navbar_slider {
    position: absolute;
    content: " ";
    left: 0;
    // bottom: 0;
    width: 25%;
    height: 0.06rem;
    background-color: #00b7ee;
    -webkit-transition: -webkit-transform 0.1s;
    transition: -webkit-transform 0.1s;
    transition: transform 0.1s;
    transition: transform 0.1s, -webkit-transform 0.1s;
  }

  .navbar_slider_0 {
    transform: translateX(0);
  }

  .navbar_slider_1 {
    transform: translateX(100%);
  }
  .navbar_slider_2 {
    transform: translateX(200%);
  }
  .navbar_slider_3 {
    transform: translateX(300%);
  }
  .more-box{
    .mask {
      position: fixed;
      z-index: 10;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: none;
      opacity: 0;
      transform: scale3d(1, 1, 0);
      transition: all 0.3s ease-in;
    }
    .wrapper {
      position: fixed;
      z-index: 10;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      text-align: center;
      font-size: 0;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      align-items: center;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      transform: translateY(-100%);
      visibility: hidden;
      opacity: 0;
      transition: opacity 700ms ease-out, transform 300ms ease-out, visibility 700ms ease-out;
      .wrapper_body {
        width: 9.18rem;
        // border-radius: 0.5rem;
        .menu {
          background-color: #fff;
          border-radius: 0.4rem;
            // padding: 0 0.35rem;
          .item {
            font-size: 0.42rem;
            color: #000;
            padding: 0.4rem;
            text-align: left;
          }
          .item:first-child{
            border-bottom: 0.02rem solid #f2f2f2;
          }
        }
        // button{
        //     margin-top: 0.36rem;
        //     padding: 0.6rem 0;
        //     background-color: #fff;
        //     color: #808080;
        //     border-radius: 0.2rem;
        // }
      }
    }
  }
  .more-box.open{
    .mask {
      display: block;
      opacity: 1;
      transform: scale3d(1, 1, 1);
    }
    .wrapper {
      transform: none;
      visibility: visible;
      opacity: 1;
    }
  }
}
</style>