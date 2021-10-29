<!--
 * @Author: SuChonghua
 * @Date: 2021-10-19 16:14:52
 * @LastEditTime: 2021-10-19 16:39:22
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\pay-ok.vue
-->
<template>
    <div class="root">
        <div class="ok_icon icon">&#xe633;</div>
        <span class="ok_txt">支付成功</span>
        <span class="h1">您已成功充值了50点企业发布点</span>
        <span class="h2">如有疑问请拨打客服电话：<small>4000-666-109</small></span>
        <button class="back">返回发布点管理</button>
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
    padding-top:2.67rem;
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
        font-size: 0.32rem;
        color: #999999;
    }
    .h2{
        margin-top: 0.35rem;
        font-size: 0.33rem;
        color: #999999;
        margin-bottom: 1.69rem;
        display: flex;
        align-items: center;
        small{
            color: #008de7;
            text-decoration: underline;
        }
    }
    .back{
        width: 5.2rem;
        height: 1.16rem;
        line-height: 1.16rem;
        background-color: #ffffff;
        border-radius: 0.25rem;
        border: solid 0.02rem #727272;
        font-size: 0.42rem;
        color: #232323;
    }
}
</style>