<template>
    <div v-if="roominfo" class="root">
        <live-player :src="roominfo.livePushUrl" mode="live" autoplay @statechange="statechange" @error="error" class="live-play" />
        <div class="chart-box"></div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import WebIM from "@/utils/hx/WebIM";

export default {
    data(){
        return {
            roominfo:null,
        }
    },
    computed:{
        ...mapState({
            UserInfo: state => state.User.UserInfo,
        })
    },
    methods:{
        statechange(e) {
            console.log('live-player code:', e)
        },
        error(e) {
            console.error('live-player error:', e)
        }
    },
    async mounted(){
        console.log(this.$route)
        if(this.$route.query.roomId)
        {
            var res = await this.$ShoppingAPI.AppServer_LiveRoomsDetail(this.$route.query.roomId)
            if(res)
            {
                this.roominfo = res.data;

            }
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
    height: 100%;
    .live-play{
        width:100%;
        height: 100%;
        z-index: 1;
    }
    .chart-box{
        position:fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 30%;
        background: #fff;
        z-index: 9;
    }
}

</style>