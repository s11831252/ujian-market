<template>
    <div>
        <ul class="navbar">
            <li v-for="(item,index) in Tabs" :key="index" :id="index" :class="{'navbar_item_on':activeIndex == index}" class="navbar_item" @click="tabClick(item,$event)">
                <div class="navbar_title">{{item.name}}</div>
            </li>
        </ul>
        <div class="navbar_slider" :class="navbarSliderClass"></div>
        <div :hidden="activeIndex != 0">
            <slot name="activeIndex0" v-bind:Todo="Todo"></slot>
        </div>
        <div :hidden="activeIndex != 1">
            <slot name="activeIndex1"></slot>
        </div>
        <div :hidden="activeIndex != 2">
            <slot name="activeIndex2"></slot>
        </div>
    </div>
</template>
<script>
export default {
  props: {
    Tabs: Array,
    Todo:Array,
  },
  data() {
    return {
      activeIndex: 0
    };
  },
  computed: {
    navbarSliderClass() {
      return "navbar_slider_" + this.activeIndex;
    }
  },
  methods: {
    async tabClick(tab, e) {
      if (e) this.activeIndex = e.currentTarget.id;
    }
  }
};
</script>
<style lang="less" scoped>
.navbar {
  height: 40px;
  line-height: 40px;
  width: 100%;
  border-bottom: 1rpx solid #ccc;
  position: relative;
}

.navbar_item {
  text-align: center;
  display: inline-block;
  width: 33%;
}

.navbar_item_on {
  color: #12b7f5;
}

.navbar_title {
  font-weight: 500;
  display: inline-block;
}

.navbar_slider {
  position: absolute;
  content: " ";
  left: 0;
  width: 33%;
  height: 2px;
  background-color: #12b7f5;
  -webkit-transition: -webkit-transform 0.1s;
  transition: -webkit-transform 0.1s;
  transition: transform 0.1s;
  transition: transform 0.1s, -webkit-transform 0.1s;
}

.navbar_slider_0 {
  transform: translateX(0);
}

.navbar_slider_1 {
  transform: translateX(100%);
}
.navbar_slider_2 {
  transform: translateX(200%);
}
.navbar_slider_3 {
  transform: translateX(300%);
}
</style>
