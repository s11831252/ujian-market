<template>
    <span class="chatmsg" v-if="msgdata">
        <img :src="emojiPath+msgdata.data" v-if="msgdata.type=='emoji'">
        <span v-else-if="msgdata.type=='txt'">{{ msgdata.data}}</span>
    </span>
</template>
<script>
import WebIM from "@/utils/hx/WebIM";
export default {
    props:{
        msgdata:Object,
    },
    computed:{
        emojiPath(){
            return WebIM.Emoji.path;
        }
        
    },
    mounted(){
        // console.log(this.msgdata)
    }
}
</script>
<style lang="scss" scoped>
.chatmsg{
    // line-height: 0.4rem;
    font-size: 0.4rem;
    img{
        width: 0.48rem;
        height: 0.48rem;
    }
}
</style>