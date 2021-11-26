<!--
 * @Author: SuChonghua
 * @Date: 2021-10-19 16:14:52
 * @LastEditTime: 2021-11-24 17:30:29
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\post-ok.vue
-->
<template>
    <div class="root">
        <img class="ok_icon" src="../../../static/img/sdok.png">
        <span v-if="$route.query.listId==1||$route.query.listId==2" class="ok_txt">需求发布成功</span>
        <span v-else-if="$route.query.listId==3||$route.query.listId==4||$route.query.listId==5" class="ok_txt">供应发布成功</span>
        <span v-else class="ok_txt">供需发布成功</span>
        
        <span class="h1"><span>·</span>您的信息发布成功，将有7天的展示时间，在展示期 间请注意查看私信</span>
        <span class="h1"><span>·</span>成功发布后3天内，您的信息可以进行编辑修改</span>
        <span class="h1"><span>·</span>客服电话：<small>4000-666-109</small></span>
        <button class="back" @click="go({path:'/pages/supply-demand/manage'})">前往信息中心</button>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" scoped>
.root{
    display: flex;
    flex-direction:column;
    align-items: center;
    justify-content:center;
    // text-align: center;
    padding-top:2.67rem;
    img{
        display: block;
    }
    .ok_icon{
        width: 2.19rem;
        height: 2.19rem;
        text-align: center;
        line-height: 2.19rem;
        color: #fff;
        background-image: linear-gradient(174deg, 
            #f5cb95 0%, 
            #cb9952 100%);
        font-size: 1.01rem;
        border-radius: 50%;
        margin-bottom: 0.87rem;
    }
    .ok_txt{
        color: #333333;
        font-size: 0.52rem;
        margin-bottom: 0.79rem;
    }
    .h1,.h2{
        font-size: 0.33rem;
        color: #999999;
        width: 7.65rem;
        display: flex;
        align-items: center;
        justify-content: start;
        margin-bottom: 0.34rem;
        span{
            margin-right: 0.2rem;
        }
        small{
            color: #008de7;
            text-decoration: underline;
        }
    }
    .back{
        margin-top: 1.36rem;
        width: 7.6rem;
        height: 1.24rem;
        line-height: 1.24rem;
        background-color: #ffffff;
        border-radius: 0.12rem;
        border: solid 0.03rem #008de7;
        font-size: 0.55rem;
        color: #008de7;
    }
}
</style>