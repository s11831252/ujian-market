<template>
    <span class="chatmsg">
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
}
</script>
<style lang="less" scoped>
.chatmsg{
    line-height: 0.4rem;
    font-size: 0.4rem;
    img{
        width: 0.45rem;
        height: 0.45rem;
    }
}
</style>