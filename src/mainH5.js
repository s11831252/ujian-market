import Vue from 'vue'
import App from './AppH5'
import store from './store'
import router from './routerH5'
import UJAPI from "./api/UJAPI"
import ShoppingAPI from "./api/ShoppingAPI"

Vue.prototype.$UJAPI = UJAPI; //在实例中用$UJAPI调用UJAPI封装好的RestAPI
Vue.prototype.$ShoppingAPI = ShoppingAPI; //在实例中用$ShoppingAPI调用ShoppingAPI.js封装好的RestAPI
Vue.mixin({
  methods: {
      go: function(path) {
        this.$router.push(path);
      },
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
