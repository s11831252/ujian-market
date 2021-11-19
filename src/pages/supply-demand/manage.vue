<!--
 * @Author: SuChonghua
 * @Date: 2021-11-17 17:12:21
 * @LastEditTime: 2021-11-19 19:23:31
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
      <li v-for="(item,index) in datalist" :key="index" class="data-item">
        <div class="title">
          <i v-if="item.listType==1||item.listType==5" class="corp">企</i>
          <i v-if="item.listType==2" class="pro">项</i>
          <i v-if="item.listType==4" class="shop">商</i>
          <i v-if="item.listType==3" class="personal">个</i>
          <span class="txt">{{item.title}}</span>
          <span class="status stop" v-if="item.status == 1000">暂停中</span>
          <span class="status" v-else>展示中</span>
        </div>
        <div class="body">
          <div class="img">
            <img :src="item.logoImage" />
            <span class="type supply" v-if="item.listType==3||item.listType==4||item.listType==5">供应</span>
            <span class="type demand" v-else>需求</span>
          </div>
          <div class="context">
            <span class="txt">{{item.content}}</span>
            <span class="time">剩余1天12时23分</span>
          </div>
        </div>
        <div class="bottom">
          <div class="more">···</div>
          <div class="btn-group" v-if="item.status==1">
            <button>编辑</button>
            <button>刷新</button>
            <button>延长展示</button>
          </div>
          <div class="btn-group" v-else-if="item.status==0">
            <button @click="del(item)">删除草稿</button>
            <button @click="go({path:'/pages/supply-demand/release-form',query:{listId:item.listId}})">继续编辑</button>
            <button @click="go({path:'/pages/supply-demand/post'})">发布</button>
          </div>
        </div>
      </li>
    </ul>
    <ul class="data-list" v-else>
      <li class="not404">
        <img src="../../../static/img/sd404.png">
        <button>立即发布</button>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
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
        status:1,//查询状态,0B0000_0000表示草稿,0B0000_0001表示能正常发布,0B0000_0100表示系统禁停,0B0000_1000表示发布人停止
        bindId:"",//返回相关供求，如想返回企业，就传企业ID，店铺就传店铺Id，项目就传项目Id
        pageIndex:1,//当前分页
        pageSize:10,//分页大小
        searchValue:"",//搜索关键词
      },
      datalist:[]
    };
  },
  computed: {
    navbarSliderClass() {
      return "navbar_slider_" + this.activeIndex;
    },
  },
  methods: {
    del(item){
      
    },
    tabClick(item, event) {
      this.activeIndex = item.index;
      if(item.index==0)
      {
        this.search.type=0;
        this.search.status=1;
      }else if(item.index==1)
      {
        this.search.type=1;
        this.search.status=1;
      }else if(item.index==2)
      {
        this.search.type=2;
        this.search.status=1;
      }else if(item.index==3)
      {
        this.search.type=0;
        this.search.status=0;
      }
      this.searchData();
    },
    async searchData(){
      var rep =  await this.$SupplyAndDemandAPI.SupplyAndDemand_GetList(this.search)
      if(rep.ret==0)
      {
        this.datalist = rep.data;
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
    .data-item {
      margin-bottom: 0.27rem;
      background-color: #ffffff;
      border-radius: 0.41rem;
      padding: 0.56rem 0.35rem 0.35rem 0.35rem;
      .title {
        display: flex;
        align-items: center;
        margin-bottom: 0.57rem;
        i {
          font-size: 0.2rem;
          margin-right: 0.08rem;
          width: 0.42rem;
          height: 0.42rem;
          border-radius: 0.05rem;
          line-height: 0.42rem;
          text-align: center;
        }
        i.corp {
          color: #ffffff;
          box-shadow: 0rem 0.01rem 0.01rem 0rem rgba(204, 35, 55, 0.59);
          background-image: linear-gradient(86deg, #fe475d 0%, #ff6f88 100%);
        }
        i.pro {
          color: #ffffff;
          background-image: linear-gradient(85deg, 
            #138df5 0%, 
            #13b6f5 100%);
          border-radius: 0.07rem;
        }
        i.shop {
          color: #ffffff;
          background-image: linear-gradient(85deg, 
            #fe7a1f 0%, 
            #ffa22b 100%);
          border-radius: 0.07rem;
        }
        i.personal {
          color: #ffffff;
          background-image: linear-gradient(85deg, 
            #02c869 0%, 
            #27e07c 100%);
          border-radius: 0.07rem;
        }
        .txt {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 7.36rem;
          font-size: 0.44rem;
          color: #333333;
          margin-right: 0.5rem;
        }
        .status {
          font-size: 0.39rem;
          color: #00b7ee;
        }
        .status.stop{
          color: #ec362b;
        }
      }
      .body {
        display: flex;
        padding-bottom: 0.48rem;
        border-bottom: 0.03rem solid #f2f2f2;
        margin-bottom: 0.37rem;
        .img {
          margin-right: 0.26rem;
          img {
            width: 2.08rem;
            height: 2.08rem;
            border-radius: 0.09rem;
          }
          position: relative;
          .type {
            position: absolute;
            top: -0.09rem;
            right: -0.09rem;
            border-radius: 0.09rem 0.09rem 0 0.09rem;
            width: 0.82rem;
            height: 0.42rem;
            line-height: 0.42rem;
            color: #fff;
            text-align: center;
            font-size: 0.28rem;
            border-radius: 0.12rem 0.12rem 0rem 0.12rem;
          }
          .type.supply{
            background-image: linear-gradient(-31deg, #4d77ff 0%, #4da9ff 100%);
          }
          .type.demand{
          	background-image: linear-gradient(-31deg, 
		#ff7f4d 0%, 
		#ffa54d 100%);
          }


	border-radius: 0.12rem 0.12rem 0rem 0.12rem;
        }
        .context {
          .txt {
            width: 7.11rem;
            font-size: 0.42rem;
            line-height: 0.55rem;
            color: #1a1a1a;
            margin-bottom: 0.29rem;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .time {
            // height: 0.58rem;
            background-color: #fee0e0;
            border-radius: 0.1rem;
            font-size: 0.37rem;
            // line-height: 0.58rem;
            padding: 0.12rem 0.25rem;
            color: #ec362b;
          }
        }
      }
      .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .more {
          font-size: 0.8rem;
          color: #bfbfbf;
        }
        .btn-group {
          display: flex;
          align-items: center;
          button {
            width: 2.3rem;
            height: 0.86rem;
            border-radius: 0.43rem;
            border: solid 0.02rem #dddddd;
            font-size: 0.4rem;
            text-align: center;
            line-height: 0.86rem;
            color: #1a1a1a;
            margin-right: 0.19rem;
          }
        }
      }
    }
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
}
</style>