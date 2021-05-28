<template>
    <div class="chatbox" id="chatcontainer">
        <slot></slot>
    </div>
</template>
<script>
export default {
    props:[
        "scrollToId"
    ],
    data(){
        return {
            containerEL:{}
        }
    },
    watch:{
        scrollToId(newQuestion, oldQuestion) {
            // console.log("watch:"+newQuestion, oldQuestion)
            if(newQuestion)
                this.scroll(newQuestion)
        }
    },
    methods:{
        scroll(id){
            this.$nextTick(()=>{
                var target = document.getElementById(id);
                this.containerEL.scrollTop = target.offsetTop

                // console.log("scrollTop:"+ this.containerEL.scrollTop)
                // console.log(target,"scroll:#"+id)
                // console.log("targer scrollTop:"+target.scrollTop)
            })
        }
    },
    mounted(){
        this.$nextTick(()=>{
                var container = this.containerEL  = document.getElementById('chatcontainer');
                var containerScrollTop = container.scrollTop;
                var containerClientHeight = container.clientHeight;
                var containerScrollHeight = container.scrollHeight;
                if(containerScrollTop + containerClientHeight >= containerScrollHeight){
                    console.log('到底部了');
                }
                if(containerScrollTop == 0){
                    console.log('到顶部了');
                }
        })
    }
}
</script>
<style lang="scss" scoped>
.chatbox {
  height: 90%;
  flex-grow: 2;
  overflow: hidden;
  overflow-y: scroll;
}
</style>