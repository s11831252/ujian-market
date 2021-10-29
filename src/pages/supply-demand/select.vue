<template>
    <div class="root">
        <div class="search-box">
            <i class="icon">&#xe6e3;</i>
            <input v-model="keyword" placeholder="搜索项目">
            <span>搜索</span>
        </div>
        <ul class="list" v-if="$route.query.type=='project'">
            <li class="item" @click="doubleTap($event,item)" @touchstart="touchStart" @touchend="touchEnd" v-for="(item,index) in projectListFilter" :key="index">{{item.ProjectName}}</li>
        </ul>
        <ul class="list" v-else-if="$route.query.type=='corp'">
            <li class="item" v-for="(item,index) in corpListFilter" :key="index">{{item.eName}}</li>
        </ul>
        
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
    data(){
        return{
            projectList:[],
            corpList:[],
            keyword:"",
            // 触摸开始时间
            touchStartTime: 0,
            // 触摸结束时间
            touchEndTime: 0,  
            // 最后一次单击事件点击发生时间
            lastTapTime: 0, 
        }
    },
    methods:{
        ...mapMutations(["setSelectProject","setSelectCorp","setSelectShop"]),
        /// 按钮触摸开始触发的事件
        touchStart: function(e) {
            console.log(e)
            this.touchStartTime = e.timeStamp
        },

        /// 按钮触摸结束触发的事件
        touchEnd: function(e) {
            console.log(e)
            this.touchEndTime = e.timeStamp
        },
        doubleTap(e,item){
            var that = this
            // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
            if (that.touchEndTime - that.touchStartTime < 350) {
                // 当前点击的时间
                var currentTime = e.timeStamp
                var lastTapTime = that.lastTapTime
                // 更新最后一次点击时间
                that.lastTapTime = currentTime

                // 如果两次点击时间在300毫秒内，则认为是双击事件
                if (currentTime - lastTapTime < 300) {
                    console.log("double tap")
                    if(that.$route.query.type=="project")
                    {
                        that.setSelectProject(item)
                        that.setSelectCorp(null);

                    }else if(this.$route.query.type=="corp")
                    {
                        that.setSelectCorp(item);
                        that.setSelectProject(null)
                    }
                    that.$router.back();
                }
            }
        }
    },
    computed:{
        projectListFilter(){
           var _arr =  this.projectList.filter(item=>{
               return item.ProjectName.indexOf(this.keyword)>=0
            });
            return _arr
        },
        corpListFilter(){
           var _arr =  this.corpList.filter(item=>{
               return item.eName.indexOf(this.keyword)>=0
            });
            return _arr;
        }
    },
    async mounted(){
        console.log(this.$route.query.type)
        if(this.$route.query.type=="project")
        {
           var rep = await this.$UJAPI.Project_GetList({OrderType:"last",PageIndex:1,PageSize:9999});
           if(rep.ret==0)
           {
               this.projectList=rep.data;
                console.log(this.projectList)
           }
        }else if(this.$route.query.type=="corp")
        {
           var rep = await this.$UJAPI.Enterprise_Get();
           if(rep.ret==0)
           {
               this.corpList=rep.data;
                console.log(this.corpList)
           }
        }
    }
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
            color: #333333;
            border-bottom: 0.02rem solid  #ebebeb;
        }
    }
}
</style>