import Vue from 'vue'
import App from './AppH5'
import store from './store'
import router from './routerH5'
import UJAPI from "./api/UJAPI"
import ShoppingAPI from "./api/ShoppingAPI"
import WeixinOpenAPI from "./api/WeixinOpenAPI"

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

Vue.prototype.$UJAPI = UJAPI; //在实例中用this.$UJAPI调用UJAPI封装好的RestAPI
Vue.prototype.$ShoppingAPI = ShoppingAPI; //在实例中用this.$ShoppingAPI调用ShoppingAPI.js封装好的RestAPI
Vue.prototype.$WeiXinOpenAPI = WeixinOpenAPI; //在实例中用this.$WeiXinOpenAPI调用WeiXinOpenAPI.js封装好的RestAPI

Vue.mixin({
  components: {
    swiper,
    swiperSlide
  },
  computed: {
    isMP(){
        return false;
    },
    async launchOptions(){
      return {};
    }
  },
  methods: {
      go: function(path) {
        this.$router.push(path);
      },
      replace: function (path) {
        this.$router.replace(path);
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
      }, //全局wx登录函数,vue生命周期执行时,对于需要登录票据才可进行访问请求的异步操作可以放置到获取登录之后执行
      wx_login(callback) {
          var parms ={};
          if(this.launchOptions.query&&this.launchOptions.query.InvitaId)
          {
              parms.InvitaId=this.launchOptions.query.InvitaId;
          }
          
          if(callback)
            callback();
                  
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
