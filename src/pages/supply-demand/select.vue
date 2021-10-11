<template>
    <div class="root">
        <div class="search-box">
            <i class="icon">&#xe6e3;</i>
            <input placeholder="搜索项目">
            <span>搜索</span>
        </div>
        <ul class="list">
            <li class="item">广西南宁建设学院西校区建设工程项目</li>
            <li class="item">南宁市建设工程模拟数字项目</li>
            <li class="item">广西南宁于浩有限责任公司工作交流平台</li>
            <li class="item">2021年广西工程建设质量管理小组活动成果发布会</li>

        </ul>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" scoped>
.root{
    margin: 0.41rem;
    .search-box{
        display: flex;
        align-items: center;
        padding: 0.34rem 0;
        background-color: #f5f6fa;
	    border-radius: 0.15rem;
        font-size: 0.43rem;
        color: #999999;
        i{
            margin-left: 0.26rem;
            margin-right: 0.14rem;
            font-size: 0.36rem;
        }
        input{
            flex-grow:1;
            font-size: 0.36rem;
        }
        span{
            margin-left: 0.51rem;
            margin-right: 0.47rem;
            border-left: 0.03rem;
            color: #00b7ee;
        }
    }
    .list{
        margin-top: 0.56rem;
        .item{
            padding: 0.61rem;
            border-bottom: 0.02rem solid  #ebebeb;
        }
    }
}
</style>