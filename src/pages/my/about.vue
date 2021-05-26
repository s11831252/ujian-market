<template>
    <div class="root">
        <img class="logo" src="../../../static/img/logo108.png">
        <p class="title">U建商城</p>
        <small class="version">V{{version}}</small>
        <div class="content">本地化建筑行业交易商城，找建材，找机电，找主材，找五金，找耗材，找配件，找技术找服务，找人才……“U建商城”全都有！</div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            version:"1.1.0"
        }
    },
    mounted(){
        const accountInfo = wx.getAccountInfoSync();
        if(accountInfo.miniProgram&&accountInfo.miniProgram.version)
        {
            this.version=accountInfo.miniProgram.version;
        }
    }
}
</script>
<style>
body{
    height: 100%;
}
</style>
<style lang="scss" scoped>
.root{
    text-align: center;
    padding: 0 0.42rem;
    img.logo{
        margin-top: 1.08rem;
        width: 1.7rem;
	    height: 1.74rem;
    }
    .title{
        margin-top: 0.36rem;
        font-size: 0.6rem;
        color: #000;
    }
    .version{
        margin-top: 0.42rem;
        font-size: 0.44rem;
        color: #cacaca;
        padding-bottom: 0.96rem;
        border-bottom: 0.02rem solid #e5e5e5;
    }
    .content{
        text-align: left;
        padding: 0.96rem 0.45rem 0 0.45rem;
        font-size: 0.4rem;
        line-height: 0.54rem;
    }
}
</style>