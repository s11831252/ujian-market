<!--
 * @Author: SuChonghua
 * @Date: 2021-12-07 11:24:16
 * @LastEditTime: 2021-12-10 18:53:08
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\home-item.vue
-->
<template>
    <li>
          <span class="time">{{time_fmt}}</span>
          <span class="type e" v-if="item.listType==1||item.listType==5">企</span>
          <span class="type p" v-else-if="item.listType==2">项</span>
          <span class="type g" v-else-if="item.listType==3">个</span>
          <span class="type s" v-else-if="item.listType==4">商</span>
          <span class="title">{{item.title}}</span>
    </li>
</template>
<script>
import utils from '../../utils/index'
export default {
    props:{
        item:Object
    },
    computed:{
        // 秒数 转为 XX时XX分XX秒   time = 传入的秒数
        time_fmt() {
            var day =  Math.floor(this.item.timeRemaining / (3600*24))
            var hours = Math.floor(Math.floor(this.item.timeRemaining % (3600*24))/3600)
            var minute = Math.floor(Math.floor(this.item.timeRemaining % 3600) / 60)
            // var second = timeRemaining % 60
            var hours =
                hours.toString().length === 1 ? `0${hours}` : hours
            minute =
                minute.toString().length === 1 ? `0${minute}` : minute
            // second =
            //     second.toString().length === 1 ? `0${second}` : second
            var s =  new Date();
            
            var str = utils.formatTime(new Date(s.setSeconds(s.getSeconds()+this.item.timeRemaining)),"MM/dd")
            if(day>0)
              return str;
            else if(hours>0)
              return  hours + '时'
            else
              return  minute + '分'
            
        },
    }
}
</script>
<style lang="scss" scoped>
      li {
        display: flex;
        align-items: center;
        padding: 0.45rem 0;
        border-bottom: 0.02rem solid #f2f2f2;
        .time {
          width: 1.08rem;
          height: 0.47rem;
          line-height: 0.47rem;
          background-color: #f3f8fe;
          color: #75aefb;
          border-radius: 0.06rem;
          margin-right: 0.28rem;
          font-size: 0.29rem;
          flex-shrink:0;
        }
        .type {
          width: 0.42rem;
          height: 0.42rem;
          font-size: 0.29rem;
          border-radius: 0.07rem;
          margin-right: 0.12rem;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          flex-shrink:0;

        }
        .type.e {
          background-image: linear-gradient(86deg, #fe475d 0%, #ff6f88 100%);
        }
        .type.p {
          background-image: linear-gradient(85deg, #138df5 0%, #13b6f5 100%);
        }
        .type.s {
          background-image: linear-gradient(85deg, #fe7b20 0%, #ff9f29 100%);
        }
        .type.g {
          background-image: linear-gradient(85deg, #09cc6c 0%, #22dd7a 100%);
        }
        .title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex-shrink: 1;
          font-size: 0.43rem;
          color: #4d4d4d;
          text-align: left;
          flex-grow: 1;
        }
      }
</style>