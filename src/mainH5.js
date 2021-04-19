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
import disp from "./utils/hx/broadcast";

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
    /**
     * @description: '判断是否是微信浏览器的函数'
     * @param {*}
     * @return {*} true/false
     */
    isWeiXin(){
        //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
        var ua = window.navigator.userAgent.toLowerCase();
        // alert(JSON.stringify(ua))
        //通过正则表达式匹配ua中是否含有MicroMessenger字符串
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
          console.log("isWeiXin:true")
          return true;
        } else{
          console.log("isWeiXin:false")
          return false;
        }
    }

  },
  methods: {
      go: function(path) {
        this.$router.push(path);
      },
      toast(title){
        this.$toast.center(title);
      },
      modal(opt){
        console.log(opt)
        var { title = "", content = "提示内容", confirm, cancel, confirmText = "确定", confirmColor = "#12b7f5",cancelText="取消", cancelColor = "#989898",showCancel=true } = opt;

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
      extraDataHandler(){

      },
      //全局wx登录函数,vue生命周期执行时,对于需要登录票据才可进行访问请求的异步操作可以放置到获取登录之后执行
      async wx_login(callback) {
          
          callback && await callback()
            
          this.hx_login();
          
      },
      hx_login(){
        // console.log(this.$store.state,this.$store.state.UserInfo)
        if(WebIM.conn.isOpened())
          return
        if (this.$store.state.User.UserInfo && this.$store.state.User.UserInfo.UserId) {
            var hx_username = this.$store.state.User.UserInfo.UserId.replace(/-/g, "");
            var hx_psw = md5.hex_md5(hx_username);
            let options = {
              grant_type: "password",
              apiUrl: WebIM.conn.apiUrl,
              user: hx_username,
              pwd: hx_psw,
              appKey: WebIM.config.appkey
            };
            this.showLoading({title:"正在连接聊天服务器"})
            WebIM.conn.open(options);
            disp.fire('onOpening');
            console.log("环信Login Account or Password",hx_username, hx_psw);
        }
      }
    }
});
Vue.config.ignoredElements = ['wx-open-launch-weapp']
Vue.config.productionTip = false

const app =new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    store
  });
window.$app=app; //vue实例全局变量
