import Vue from 'vue'
import App from './App'
import MpvueRoterPatch from 'mpvue-router-patch'
import store from './store'
import UJAPI from "./api/UJAPI"
import ShoppingAPI from "./api/ShoppingAPI"
import WeixinOpenAPI from "./api/WeixinOpenAPI"
import API2 from "./api/API2"
import HXAPI from "./api/HXAPI"
import MoneyAPI from "./api/MoneyAPI"

import { debug } from 'util';
import WebIM from "@/utils/hx/WebIM";
import utils from "@/utils/index.js";
import md5 from "@/utils/md5";
import disp from "./utils/hx/broadcast";

//在实例中用this.$xxx调用封装好的RestAPI
Vue.prototype.$UJAPI = UJAPI;
Vue.prototype.$ShoppingAPI = ShoppingAPI;
Vue.prototype.$WeixinOpenAPI = WeixinOpenAPI;
Vue.prototype.$API2 = API2;
Vue.prototype.$HXAPI = HXAPI;
Vue.prototype.$MoneyAPI = MoneyAPI;

Vue.prototype.$store = store;
Vue.mixin({
    computed: {
        $route: function () {
            return this.$router.currentRoute
        },
        isMP() {
            return true;
        },
        isWeiXin(){
            return true;
        }
    },
    methods: {
        go: function (path) {
            this.$router.push(path);
        },
        replace: function (path) {
            this.$router.replace(path);
        },
        toast(title) {
            if (typeof title == 'object') {
                wx.showToast(title);
            } else {
                wx.showToast({
                    title: title,
                    icon: "none",
                    mask: true
                });
            }

        },
        showLoading(opt) {
            var obj = { mask: true, ...opt };
            wx.showLoading(obj);
        },
        hideLoading() {
            wx.hideLoading();
        },
        modal(opt) {
            console.log(opt)
            var { title = "", content = "提示内容", confirm, cancel, confirmText = "确定", confirmColor = "#12b7f5",cancelText="取消", cancelColor = "#989898",showCancel=true } = opt;
            wx.showModal({
                confirmText,
                title,
                content,
                showCancel,
                confirmColor,
                cancelColor,
                cancelText,
                success(res) {
                    if (res.confirm) {
                        if (confirm)
                            confirm();
                    } else if (res.cancel) {
                        if (cancel)
                            cancel();
                    }
                }
            })
        },
        //需要从其他小程序跳转过来的,必须在页面初始事件中调用此函数之后再进行业务接口调用
        extraDataHandler() {
            //1.从其他小程序(U建+、商家独立小程序)跳转到U建行业市场小程序使用功能(微信支付、联系客服、查看商家、查看商品、进入直播间),通过此处获取其他小程序传递过来的用户票据SingleTicket
            //2.可以使用微信api`let options = wx.getEnterOptionsSync()` 或 this.$mp.appOptions 单独获取
            //3.可以从vue实例中使用`let options = this.$mp.appOptions`中获取
            //4.可以在微信的App({onShow(options){}, onLaunch(options){}})事件回调中获取
            let options = wx.getEnterOptionsSync();
            if (options && options.referrerInfo && options.referrerInfo.extraData && options.referrerInfo.extraData.SingleTicket) {
                // console.log("this.$mp.appOptions:",this.$mp.appOptions)
                console.log("extraDataHandler:", options);
                if (options.referrerInfo.extraData.SingleTicket == this.$store.state.User.SingleTicket)//跳转过来票据相同,在这里判断跳出
                    return
                if (this.$store.state.User.UserInfo.isOtherApp)//传递过来的授权票据已失效或已过期时,会有可能重复执行,在这里判断跳出
                    return
                if (WebIM.conn.isOpened())
                    WebIM.conn.close(); //环信IM关闭
                this.$store.commit("Login", { Ticket: options.referrerInfo.extraData.SingleTicket }); //存入Ticket
                this.$store.commit("SetUserInfo", { isOtherApp: true }); //清空userinfo,写入一个变量用来判断是其他小程序跳转,后续重新获取用户信息后再移除
                utils.removeItem("myUsername");
                utils.removeItem("listGroup");
                console.log("isOtherApp ", this.$store.state.User.UserInfo)
                console.log("logined status:", this.$store.getters.Logined);
            }
        },
        /**
         * @description: '全局wx登录函数,调用后会使用微信号对应的U建账号或游客身份登录。请在页面初始化前调用'
         * @param {*} callback 回调函数,对于需要登录票据才可进行访问请求的异步操作可以放置到获取登录之后执行
         * @return {*}
         */
        async wx_login(callback) {
            var that = this;
            var parms = {};
            if (this.$mp.appOptions.query && this.$mp.appOptions.query.InvitaId) {
                parms.InvitaId = this.$mp.appOptions.query.InvitaId;
            }
            if (!(this.$store.state.User.SingleTicket && this.$store.state.User.SingleTicket.length > 0))//没有SingleTicket尝试登录 
            {
                console.log("no login action wxlogin")
                // 调用wx登录接口
                wx.login({
                    success: async (obj) => {
                        if (obj.errMsg.indexOf("login:ok") > -1) {
                            var rep = await that.$ShoppingAPI.Account_wxLogin(obj.code, parms.InvitaId)
                            if (rep.ret == 0) {
                                if (rep.data.ticket) {
                                    that.$store.commit("Login", { Ticket: rep.data.ticket }); //存入Ticket
                                    if (rep.data.result.errcode == 0)//0表示系统用户 -1游客
                                    {
                                        var res = await that.$ShoppingAPI.User_Get()
                                        if (res.ret == 0) {
                                            var userinfo = res.data;
                                            var _u = { ...rep.data.result, ...userinfo }
                                            that.$store.commit("SetUserInfo", _u);
                                        }
                                    } else {
                                        that.$store.commit("SetUserInfo", rep.data.result);
                                    }
                                }
                            }
                        }
                        callback && await callback()
                        that.hx_login();
                    },
                    fail() {
                        callback && callback()
                    }
                });
            } else if (this.$store.state.User.UserInfo.isOtherApp && !this.$store.state.User.UserInfo.openid) {
                console.log("isOtherApp action wxlogin")
                // 调用wx登录接口
                wx.login({
                    success: async (obj) => {
                        if (obj.errMsg.indexOf("login:ok") > -1) {
                            var rep = await that.$ShoppingAPI.Account_wxLogin(obj.code, parms.InvitaId)
                            if (rep.ret == 0) {
                                var rep2 = await this.$ShoppingAPI.User_Get();
                                if (rep2.ret == 0) {
                                    this.$store.commit("SetUserInfo", { ...rep.data.result, ...rep2.data });
                                }
                            }
                        }
                        callback && await callback()
                        if (WebIM.conn.isOpened())
                            WebIM.conn.close(); //环信IM关闭
                        that.hx_login();
                    },
                    fail() {
                        callback && callback()
                    }
                });
            } else {
                console.log("logined action wxlogin")
                callback && await callback()
                this.hx_login();
            }
        },
        hx_login() {
            // console.log("hx_login:",this.$store.state,this.$store.state.User.UserInfo)
            if (this.$store.state.User.UserInfo && this.$store.state.User.UserInfo.UserId) {
                if (WebIM.conn.isOpened())
                    return
                var hx_username = this.$store.state.User.UserInfo.UserId.replace(/-/g, "");
                var hx_psw = md5.hex_md5(hx_username);
                let options = {
                    grant_type: "password",
                    apiUrl: WebIM.config.apiURL,
                    user: hx_username,
                    pwd: hx_psw,
                    appKey: WebIM.config.appkey
                };
                // console.log(WebIM.config)
                this.showLoading({ title: "正在连接聊天服务器" })
                WebIM.conn.open(options);
                disp.fire('onOpening');
                console.log("环信Login Account or Password",hx_username, hx_psw);
            }
        }
    },
    //两个方法都可以解决mpvue 同页面不重置data中的数据问题
    onLoad() {
        if (this.$initData$) {
          Object.assign(this, JSON.parse(this.$initData$))
        } else {
          this.$initData$ = JSON.stringify(this.$data)
        }
    },
    //两个方法都可以解决mpvue 同页面不重置data中的数据问题
    // onUnload() {
    //     if (this.$options.data)
    //         Object.assign(this, this.$options.data())
    // }
    // created: function () {
    //     if (this.$route)
    //         console.log("进入页面:" + this.$route.path);
    // }
});
Vue.use(MpvueRoterPatch);//在Vue实例中使用$route和$router进行调用路由
Vue.config.productionTip = false
Vue.config.ignoredElements = ['wx-open-launch-weapp']

App.mpType = 'app'
const app = new Vue(App)


app.$mount()
