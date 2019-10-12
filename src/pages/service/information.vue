<template>
    <div>
        <div class="content" @click="go({path:'/pages/service/consult'});dialogue()">
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1570530442128&di=010c68fe88d4a65fcfe0868ddf5fa182&imgtype=0&src=http%3A%2F%2Fpic1.zhimg.com%2F50%2Fv2-2103d2bf1adc0e0a68bb0f42033b6a9e_hd.jpg" alt="">
            <div class="right">
                <p class="name">商家名称</p>
                <p class="time">11:12</p>
                <p class="hint">显示最后一条信息,该消息已被阅读...</p>
                <div v-if="shuliang" class="unread" >1</div>
            </div>
        </div>      
    </div>
</template>
<script>
export default {
    data(){
        return{
            shuliang:true
        }
    },
   methods:{
       //信息列表点进去的对话详情
       dialogue() {
           this.shuliang=false
           console.log("点击了")
       }
   }
}
</script>
<style scoped>
.content {
    position: relative;
}
.content img {
    width: 1.44rem;
	height: 1.43rem;
	background-color: #e2e2e2;
	border-radius: 0.05rem;
    margin-top: 0.38rem;
    margin-left: 0.38rem;
    
}
.right {
    border-bottom: 0.02rem solid #dedde3;
    position: absolute;
    right: 0.36rem;
    top: 0.51rem;
    left: 2.15rem;
}
.name {
    font-size: 0.46rem;
    color: #5c5c5c;
    float: left;
}
.time {
    font-size: 0.3rem;
    color: #949494;
    float: right;
}
.hint {
    font-size: 0.36rem;
    color: #5c5c5c;
    margin-top: 0.8rem;
    margin-bottom:0.38rem;
    display: block
    
}
.unread {
    font-size: 0.3rem;
    color: #ffffff;
    width: 0.5rem;
	height: 0.5rem;
	background-color: #f02e2e;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0.34rem;
    right: 0.3rem;
}
</style>