<!--
 * @Author: SuChonghua
 * @Date: 2021-12-02 16:45:54
 * @LastEditTime: 2021-12-27 17:56:12
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\manage-item.vue
-->
<template>
    <li class="data-item" @click="go({path:'/pages/supply-demand/detail',query:{listId:item.listId}})">
        <div class="title">
          <i v-if="item.listType==1||item.listType==5" class="corp">企</i>
          <i v-if="item.listType==2" class="pro">项</i>
          <i v-if="item.listType==4" class="shop">商</i>
          <i v-if="item.listType==3" class="personal">个</i>
          <span class="txt">{{item.title}}</span>
          <span class="status invalid" v-if="statusClass=='invalid'">已失效</span>
          <span class="status stop" v-else-if="statusClass=='stop'">暂停中</span>
          <span class="status " v-else-if="statusClass=='draft'"></span>
          <span class="status" v-else>展示中</span>
        </div>
        <div class="body">
          <div class="img">
            <img :src="item.logoImage" />
            <span class="type supply" v-if="item.listType==3||item.listType==4||item.listType==5">供应</span>
            <span class="type demand" v-else>需求</span>
          </div>
          <div class="context" :class="statusClass">
            <span class="txt">{{item.content}}</span>
            <span class="time" v-if="statusClass=='draft'">待发布</span>
            <span class="time" v-else>剩余{{item.timeStr}}</span>
          </div>
        </div>
        <div class="bottom" v-if="statusClass==''" @click.stop>
          <div class="more" @click="more">···</div>
          <div class="btn-group" >
            <button @click="go({path:'/pages/supply-demand/release-form',query:{listId:item.listId}})">编辑</button>
            <button @click="RefreshTime">刷新</button>
            <button @click="AddShowDays">延长展示</button>
          </div>
        </div>
        <div class="bottom" v-else-if="statusClass=='draft'" @click.stop>
          <div class="more"></div>
          <div class="btn-group">
            <button @click="del">删除草稿</button>
            <button @click="go({path:'/pages/supply-demand/release-form',query:{listId:item.listId}})">继续编辑</button>
            <button @click="go({path:'/pages/supply-demand/post',query:{listId:item.listId}})">发布</button>
          </div>
        </div>
        <div class="bottom" v-else-if="statusClass=='stop'" @click.stop>
          <div class="more"></div>
          <div class="btn-group">
            <button @click="go({path:'/pages/supply-demand/release-form',query:{listId:item.listId}})">编辑</button>
            <button @click="nostop">恢复展示</button>
            <button @click="go({path:'/pages/supply-demand/post',query:{listId:item.listId}})">发布</button>
          </div>
        </div>
        <div class="bottom" v-else-if="statusClass=='invalid'" @click.stop>
          <div class="more"></div>
          <div class="btn-group">
            <button @click="go({path:'/pages/supply-demand/release-form',query:{listId:item.listId}})">编辑</button>
            <button @click="go({path:'/pages/supply-demand/post',query:{listId:item.listId}})">续费发布</button>
          </div>
        </div>
    </li>    
</template>
<script>
export default {
    props:{
        item:Object,
    },
    computed:{
        statusClass(){
            if(this.item)
            {
                if((this.item.status&0b10) == 0b10)
                {
                    return "invalid"
                }else if((this.item.status&0b1000) == 0b1000)
                {
                    return "stop"
                }
                else if((this.item.status&0b01) == 0b01)
                    return "";
                else
                {
                    return "draft"
                }
            }else
            {
                return "";
            }

        }
    },
    methods:{
        RefreshTime(){
            this.$emit("refreshTime",this.item);
        },
        AddShowDays(){
            this.$emit("addShowDays",this.item);
        },
        del(){
            this.$emit("del",this.item);
        },
        more(){
            this.$emit("more",this.item);
        },
        nostop(){
            this.$emit("stop",this.item,false);
        }
    }
}
</script>
<style lang="scss" scoped>
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
          font-size: 0.26rem;
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
        .status.invalid{
          width: 1.38rem;
          height: 0.5rem;
          line-height: 0.5rem;
          background-color: #a3a3a3;
          border-radius: 0.18rem;
          color: #ffffff;
          text-align: center;
        }
      }
      .body {
        display: flex;
        padding-bottom: 0.48rem;
        border-bottom: 0.03rem solid #f2f2f2;
        margin-bottom: 0.37rem;
        .img {
          margin-right: 0.26rem;
	        border-radius: 0.12rem 0.12rem 0rem 0.12rem;
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
        .context.invalid{
          .txt{
            color: #999999;
          }
          .time{
            background-color: #f2f2f2;
            color: #a3a3a3;
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
</style>