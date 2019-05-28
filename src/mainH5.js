import Vue from 'vue'
import App from './AppH5'
import store from './store'
import router from './routerH5'
import UJAPI from "./api/UJAPI"
import ShoppingAPI from "./api/ShoppingAPI"
import fts from './utils/autorem'
import Toast from './components/Toast';
import './assets/style.css';
import './assets/global.css';
import './assets/iconfont.less';
import './components/Toast/toast.css';
import VueAwesomeSwiper from 'vue-awesome-swiper'
let { swiper, swiperSlide } = VueAwesomeSwiper

import "swiper/dist/css/swiper.css";

Vue.use(Toast);
Vue.use(VueAwesomeSwiper, /* { default global options } */)

Vue.prototype.$UJAPI = UJAPI; //在实例中用$UJAPI调用UJAPI封装好的RestAPI
Vue.prototype.$ShoppingAPI = ShoppingAPI; //在实例中用$ShoppingAPI调用ShoppingAPI.js封装好的RestAPI
Vue.mixin({
  components: {
    swiper,
    swiperSlide
  },
  computed: {
    isMP(){
        return false;
    }
  },
  methods: {
      go: function(path) {
        this.$router.push(path);
      },
      toast(title){
        this.$toast.center(title);
      },
      alert(title)
      {
        this.$toast.center(title);
      },
      modal(title,content,confirm,cancel){
        if(window.confirm(content)){
          if(confirm)
            confirm();
        }else
        {
          if(cancel)
            cancel();
        }
      }
    }
});
Vue.config.productionTip = false

const app =new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    store
  });
window.$app=app; //vue实例全局变量
