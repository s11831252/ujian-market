import Vue from 'vue'
import App from './AppH5'
import store from './store'
import router from './routerH5'
import UJAPI from "./api/UJAPI"
import ShoppingAPI from "./api/ShoppingAPI"
import WeixinOpenAPI from "./api/WeixinOpenAPI"
import API2 from "./api/API2"
import HXAPI from "./api/HXAPI"

import fts from './utils/autorem'
import Toast from './components/Toast';
import './assets/style.css';
import './assets/global.css';
import './assets/iconfont.less';
import './components/Toast/toast.css';
import VueAwesomeSwiper from 'vue-awesome-swiper'
import WebIM from "@/utils/hx/WebIM";
import md5 from "@/utils/md5";

let { swiper, swiperSlide } = VueAwesomeSwiper

import "swiper/dist/css/swiper.css";

Vue.use(Toast);
Vue.use(VueAwesomeSwiper, /* { default global options } */)

//在实例中用this.$xxx调用封装好的RestAPI
Vue.prototype.$UJAPI = UJAPI; 
Vue.prototype.$ShoppingAPI = ShoppingAPI; 
Vue.prototype.$WeiXinOpenAPI = WeixinOpenAPI; 
Vue.prototype.$API2=API2;
Vue.prototype.$HXAPI=HXAPI;

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
      toast(title){
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
      }, 
      showLoading(opt){
        var obj ={mask:true, ...opt};
        this.$loading.open(obj.title)
      },
      hideLoading(){
        this.$loading.close()

      },
      //全局wx登录函数,vue生命周期执行时,对于需要登录票据才可进行访问请求的异步操作可以放置到获取登录之后执行
      wx_login(callback) {
          var parms ={};
          if(this.launchOptions.query&&this.launchOptions.query.InvitaId)
          {
              parms.InvitaId=this.launchOptions.query.InvitaId;
          }
          
          if(callback)
            callback();
      },
      hx_login(){
        // console.log(this.$store.state,this.$store.state.UserInfo)
        if (this.$store.state.User.UserInfo && this.$store.state.User.UserInfo.UserId) {
            var hx_username = this.$store.state.User.UserInfo.UserId.replace(/-/g, "");
            var hx_psw = md5.hex_md5(hx_username);
            console.log(hx_username, hx_psw);
            let options = {
              grant_type: "password",
              apiUrl: WebIM.conn.apiUrl,
              user: hx_username,
              pwd: hx_psw,
              appKey: WebIM.config.appkey
            };
            this.showLoading({title:"正在连接聊天服务器"})
            WebIM.conn.open(options);
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
