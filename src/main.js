import Vue from 'vue'
import App from './App'
import MpvueRoterPatch from 'mpvue-router-patch'
import store from './store'
import UJAPI from "./api/UJAPI"
import ShoppingAPI from "./api/ShoppingAPI"
import WeixinOpenAPI from "./api/WeixinOpenAPI"
import API2 from "./api/API2"
import HXAPI from "./api/HXAPI"

import { debug } from 'util';
import './assets/style.css';
import './assets/global.css';
import './assets/iconfont.less';
import WebIM from "@/utils/hx/WebIM";
import md5 from "@/utils/md5";

//在实例中用this.$xxx调用封装好的RestAPI
Vue.prototype.$UJAPI = UJAPI; 
Vue.prototype.$ShoppingAPI = ShoppingAPI; 
Vue.prototype.$WeixinOpenAPI = WeixinOpenAPI;
Vue.prototype.$API2=API2;
Vue.prototype.$HXAPI=HXAPI;

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
                icon: "none",
                mask:true
              });
        },
        alert(title)
        {
            wx.showToast({
                title: title,
                icon: "none"
              });
        },
        modal(title,content,confirm,cancel,confirmText){
            
            wx.showModal({
                confirmText,
                title,
                content,
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
                                        if(rep.data.result.errcode==0)//0表示系统用户 -1游客
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
        },
        hx_login(){
            // console.log(this.$store.state,this.$store.state.UserInfo)
            if (this.$store.state.User.UserInfo && this.$store.state.User.UserInfo.UserId) {
                var hx_username = this.$store.state.User.UserInfo.UserId.replace(/-/g, "");
                var hx_psw = md5.hex_md5(hx_username);
                console.log(hx_username, hx_psw);
          
                let options = {
                  grant_type: "password",
                  apiUrl: WebIM.config.apiURL,
                  user: hx_username,
                  pwd: hx_psw,
                  appKey: WebIM.config.appkey
                };
                WebIM.conn.open(options);
                this.toast("正在连接聊天服务器")
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
