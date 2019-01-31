<template>
    <div class="swiper">
        <ul class="swiper-list">
            <li class="swiper-item">
                <img :src="currentImg">
            </li>
        </ul>
        <ul class="direction">
            <li v-if="currentIndex>0" class="icon left" @click="left">&#xe602;</li>
            <li v-if="currentIndex<swiperData.length-1"  class="icon right" @click="right">&#xe601;</li>
        </ul>
        <ul class="dots">
            <li v-for="(dot,index) in swiperData.length" :key="index" class="icon" :class="{'action':index==currentIndex}"></li>
        </ul>
    </div>
</template>
<script>
export default {
  props: {
    swiperData: Array
  },
  data() {
    return {
      currentIndex: 0
    };
  },
  computed: {
    currentImg() {
      if(this.swiperData&&this.swiperData.length>0)
        return this.swiperData[this.currentIndex];
      else
        return "";
    }
  },
  methods: {
    left() {
      if (this.currentIndex > 0) this.currentIndex--;
    },
    right() {
      if (this.currentIndex < this.swiperData.length - 1) this.currentIndex++;
    }
  }
};
</script>
<style lang="less" scoped>
.swiper {
  position: relative;
  width: 100%;
  .swiper-list {
    width: 100%;
    .swiper-item {
      width: 100%;
      img {
        width: 100%;
        height: 10.82rem;
      }
    }
  }

  .direction {
    .left,
    .right {
      position: absolute;
      top: 50%;
      color: #fccb5c;
      z-index: 999;
    font-size: 38px;
    font-weight: bold;
    }
    .left {
      left: 10px;
    }
    .right {
      right: 10px;
    }
  }
  .dots {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    li {
      display: inline-block;
      width: 15px;
      height: 15px;
      margin: 0 3px;
      border: 1px solid white;
      border-radius: 50%;
      background-color: #333;
      cursor: pointer;
    }
    li.action {
      background-color: #fccb5c;
    }
  }
}
</style>

