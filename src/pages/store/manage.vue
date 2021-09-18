<!--
 * @Author: SuChonghua
 * @Date: 2021-07-20 11:46:11
 * @LastEditTime: 2021-09-18 17:40:02
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\store\manage.vue
-->
<template>
    <ul class="menu" v-if="ShoppingInfo">
        <li>
            <i class="icon" style="color: #72b0f7">&#xe66f;</i>
            <span class="title">名称</span>
            <span class="value">{{ShoppingInfo.sName}}</span>
            <i class="icon" style="color:#777777">&#xe601;</i>
        </li>
        <li>
            <i class="icon" style="color: #8d27cd">&#xe65b;</i>
            <span class="title">logo</span>
            <span class="value"><img :src="ShoppingInfo.sLogo" /></span>
            <i class="icon" style="color:#777777">&#xe601;</i>
        </li>
        <li>
            <i class="icon" style="color: #fda007">&#xe65c;</i>
            <span class="title">公告</span>
            <span class="value"></span>
            <i class="icon" style="color:#777777">&#xe601;</i>
        </li>
        <li>
            <i class="icon" style="color: #ff5252">&#xe65d;</i>
            <span class="title">简介</span>
            <span class="value"></span>
            <i class="icon" style="color:#777777">&#xe601;</i>
        </li>
        <li>
            <i class="icon" style="color: #ed54b5">&#xe668;</i>
            <span class="title">店铺外观</span>
            <span class="value"><img :src="ShoppingInfo.ShopImages.length>0?ShoppingInfo.ShopImages[0].ThumbnailUrl:''"></span>
            <i class="icon" style="color:#777777">&#xe601;</i>
        </li>
        <li>
            <i class="icon" style="color: #86cd69">&#xe60a;</i>
            <span class="title">联系方式</span>
            <span class="value">{{ShoppingInfo.Tel}}  {{ShoppingInfo.Mobile}}</span>
            <i class="icon" style="color:#777777">&#xe601;</i>
        </li>
        <li>
            <i class="icon" style="color: #52ccb4">&#xe651;</i>
            <span class="title">店铺管理&主营商品</span>
            <span class="value">{{ShoppingInfo.MainTypeName}}</span>
            <i class="icon" style="color:#777777">&#xe601;</i>
        </li>
        <li>
            <i class="icon" style="color: #cbcd27">&#xe654;</i>
            <span class="title">营业执照</span>
            <span class="value"><img :src="ShoppingInfo.License.length>0?ShoppingInfo.License:''"></span>
            <i class="icon" style="color:#777777">&#xe601;</i>
        </li>
        <li>
            <i class="icon" style="color: #72b0f7">&#xe654;</i>
            <span class="title">店铺地址</span>
            <span class="value">{{ShoppingInfo.Address}}</span>
            <i class="icon" style="color:#777777">&#xe601;</i>
        </li>
        <li>
            <i class="icon" style="color: #d12a2a">&#xe661;</i>
            <span class="title">消费保障承诺</span>
            <span class="value"></span>
            <i class="icon" style="color:#777777">&#xe601;</i>
        </li>
        <li>
            <i class="icon" style="color: #8c27cd">&#xe660;</i>
            <span class="title">店员管理</span>
            <span class="value"></span>
            <i class="icon" style="color:#777777">&#xe601;</i>
        </li>
    </ul>
</template>
<script>
export default {
    data(){
        return {
            ShoppingInfo:null
        }
    },
    async mounted(){
        var rep = await this.$ShoppingAPI.Shop_GetDetails({sId:this.$route.query.sId});
        this.ShoppingInfo=rep.data;
    }
}
</script>
<style lang="scss" scoped>
 .menu{
     width:100%;
     background-color: #f2f2f2;
     padding-top: 0.23rem;
     li{
        min-height: 1.22rem;
        padding:0.19rem 0.27rem;
        display: flex;
        align-items: center;
        justify-content: space-around;
        border-bottom: 0.01rem solid #ecf0f1;
        background-color: #fff;
        i{
            font-size: 0.58rem;
        }
        .value{
            // width: 7.3rem;
            font-size: 0.36rem;
            text-align: right;
            color: #a2a2a2;
            display: block;
            margin-right: 0.53rem;
        }
        .title{
            margin-left: 0.3rem;
            font-size: 0.42rem;
            color: #5c5c5c;
            flex-grow:1;
            text-align:left;
        }
        img{
            width: 1.8rem;
            height: 1.82rem;
        }
     }
 }
</style>