<template>
    <div class="root">
        <img src="https://image.ujianchina.net/mp/discount-code.png">
        <div class="form">
            <img class="title_img" src="../../../static/img/youhui_img.png">
            <span class="title_txt">发送短信 获取福利</span>
            <span class="tip">输入推荐人手机号，获取推荐码</span>
            <div class="group">
                <input class="" placeholder="输入号码">
            </div>
            <div class="group">
                <input class="" placeholder="输入推荐码">
                <span class="txt">已发送短信</span>
            </div>
            <button class="post">确 认</button>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style>
 body{
     height: 100%;
 }
</style>
<style lang="scss" scoped>
.root{
        background-color: #edf0f5;
        height: 100%;
    
    img{
        width: 100%;
        margin-bottom: 0.92rem;
    }
    .form{
        position: relative;
        display: flex;
        flex-direction:column;
        align-items: center;
        justify-content:center;
        .title_img{
            width: 5.37rem;
	        height: 0.71rem;
            position:absolute;
            top: -0.2rem;
            left: 25%;
            z-index: 1;
        }
        .title_txt{
            font-size: 0.4rem;
            color: #fff;
            position:absolute;
            top: -0.1rem;
            left:35.5%;
            z-index: 2;
        }
        .tip{
            margin-top: 0.98rem;
            margin-bottom: 0.79rem;
            color: #333333;
            font-size: 0.4rem;
        }
        .group{
            width: 9.18rem;
            height: 1.5rem;
            background-color: #f7f7f7;
            border-radius: 0.2rem;
            margin-bottom: 0.3rem;
            display: flex;
            align-items: center;
            justify-content:space-between;
            input{
                color: #333333;
                font-size: 0.47rem;
                flex-grow:1;
                text-align: left;
                margin-left: 0.52rem;
            }
            .txt{
                color: #939393;
                font-size: 0.39rem;
                width: 2.62rem;
                height: 0.79rem;
                line-height: 0.79rem;
                border-radius: 0.4rem;
                border: solid 0.01rem #b2b2b2;
                margin-right: 0.34rem;
            }
        }
        .post{
            width: 9.17rem;
            height: 1.2rem;
            line-height: 1.2rem;
            background-image: linear-gradient(0deg, 
                #ffc000 0%, 
                #ffe882 100%);
            border-radius: 0.6rem;
            font-size: 0.5rem;
            letter-spacing: 0.04rem;
            color: #9d3800;
        }
        margin: 0 0.35rem;
        text-align:center; 
        background-color: #ffffff;
        border-radius: 0.41rem;
    }
}
</style>