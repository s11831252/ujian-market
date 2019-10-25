import Vue from 'vue'
import App from './App'
import MpvueRoterPatch from 'mpvue-router-patch'
import store from './store'
import UJAPI from "./api/UJAPI"
import ShoppingAPI from "./api/ShoppingAPI"
import { debug } from 'util';
import './assets/style.css';
import './assets/global.css';
import './assets/iconfont.less';

Vue.prototype.$UJAPI = UJAPI; //在实例中用$UJAPI调用UJAPI封装好的RestAPI
Vue.prototype.$ShoppingAPI = ShoppingAPI; //在实例中用$ShoppingAPI调用ShoppingAPI.js封装好的RestAPI
Vue.prototype.$store = store;
Vue.mixin({
    data(){
        return{
            userInfo: {
                Account: "",
                PassWord: "",
                avatarUrl: "",
                nickName: "",
                unionid: "",
                openid: ""
              },
        }
    },
    computed: {
        $route: function () {
            return this.$router.currentRoute
        },
        isMP(){
            return true;
        },
        launchOptions(){
            var options =  wx.getLaunchOptionsSync();
            return options;
        }
    },
    methods: {
        go: function (path) {
            this.$router.push(path);
        },
        replace: function (path) {
            this.$router.replace(path);
        },
        toast(title){
            wx.showToast({
                title: title,
                icon: "none"
              });
        },
        alert(title)
        {
            wx.showToast({
                title: title,
                icon: "none"
              });
        },
        modal(title,content,confirm,cancel){
            wx.showModal({
                title: title,
                content: content,
                success (res) {
                  if (res.confirm) {
                    if(confirm)
                        confirm();
                  } else if (res.cancel) {
                    if(cancel)
                        cancel();
                  }
                }
              })
        },
        //全局wx登录函数,vue生命周期执行时,对于需要登录票据才可进行访问请求的异步操作可以放置到获取登录之后执行
        wx_login(callback) {
            var parms ={};
            if(this.launchOptions.query&&this.launchOptions.query.InvitaId)
            {
                parms.InvitaId=this.launchOptions.query.InvitaId;
            }
            if(!this.$store.getters.Logined)//没有登录尝试登录 
            {
                // 调用wx登录接口
                wx.login({
                    success: obj => {
                        if (obj.errMsg.indexOf("login:ok") > -1) {
                            this.$ShoppingAPI.Account_wxLogin(obj.code,parms.InvitaId).then(rep => {
                                if (rep.ret == 0) {
                                    this.userInfo.unionid = rep.data.result.unionid;
                                    this.userInfo.openid = rep.data.result.openid;
                    
                                    if (rep.data.ticket) {
                                        this.$store.commit("Login", { Ticket: rep.data.ticket }); //存入Ticket
                                        if(rep.data.result.errcode==0)
                                        {
                                            this.$ShoppingAPI.User_Get().then(userinfo => {
                                                if (userinfo.ret == 0) {
                                                    userinfo.data.unionid= rep.data.result.unionid;
                                                    userinfo.data.openid = rep.data.result.openid;
                                                    this.$store.commit("GetUserInfo", userinfo.data);
                                                }
                                            });
                                        }
                                    }
                                    if(callback)
                                        callback();
                                }else
                                {
                                    if(callback)
                                        allback();
                                }
                            });
                        } else {
                            if(callback)
                            callback()
                        }
                    }
                });
            }else
            {
                if(callback)
                    callback();
            }
        }
    },
    onLoad () {
        // debugger;
        // if (this.$initData$) {
        //   Object.assign(this, JSON.parse(this.$initData$))
        // } else {
        //   this.$initData$ = JSON.stringify(this.$data)
        // }
    },
    onUnload(){
        if( this.$options.data)
         Object.assign(this, this.$options.data())
    }
    // created: function () {
    //     if (this.$route)
    //         console.log("进入页面:" + this.$route.path);
    // }
});
Vue.use(MpvueRoterPatch);//在Vue实例中使用$Router访问Vuex
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue(App)


app.$mount()
