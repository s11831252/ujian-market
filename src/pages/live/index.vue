<template>
    <div>
        <ul class="room-list">
            <li v-for="(item,index) in rooms" :key="index" @click="joinRoom(item)">
                <img :src="item.cover">
                <a>{{item.name}}</a>
            </li>
        </ul>
        <!-- <live-player src="rtmp://58.200.131.2:1935/livetv/gxtv" mode="live" autoplay @statechange="statechange" @error="error" style="width: 300px; height: 225px;" /> -->
        <!-- <video src="rtmp://58.200.131.2:1935/livetv/gxtv" autoplay ></video> -->
        <!-- <videoPlayer class="vjs-custom-skin videoPlayer" :options="playerOptions"></videoPlayer> -->
    </div>
</template>
<script>
// import {videoPlayer} from 'vue-video-player'
// import 'video.js/dist/video-js.css' // 引入样式
// import 'vue-video-player/src/custom-theme.css' // 引入样式
// import 'videojs-flash'
// import 'videojs-contrib-hls'

// The actual tech function is registered to video.js automatically; so, there
// is no need to assign it to a variable.
// require('videojs-flash');
// var videojs = require('ue-video-player');

export default {
    // components:{
    //     videoPlayer
    // },
    data(){
        return {
            rooms:[],
            // playerOptions: {
            //     height: '300',
            //     sources: [{
            //         type: 'rtmp/mp4',
            //         src: 'rtmp://58.200.131.2:1935/livetv/hunantv'
            //     }],
            //     techOrder: ['flash'],
            //     autoplay: false,
            //     controls: true,
            //     // notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
			// }
        }
    },
    methods:{
        async joinRoom(item){
            var res2 = await this.$ShoppingAPI.AppServer_JoinRoom(this.UserInfo.UserName,this.$route.query.roomId)
            if(res2.ret==0&&res2.data)
            {
                    that.go({path:'/pages/live/room',query:{roomId:item.id}})
            }
            
        },
        statechange(e) {
            console.log('live-player code:', e)
        },
        error(e) {
            console.error('live-player error:', e)
        }
    },
    async mounted(){
        var res = await this.$ShoppingAPI.appserver_Ongoing({limit:10,video_type:"live"})
        this.rooms = res.data.entities
    }
}
</script>
<style lang="scss" scoped>
.room-list{
    li{
        text-align: center;
         width: 50%;
        img{
           
        }
    }
}
</style>