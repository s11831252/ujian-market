import Vue from 'vue'
import Router from 'vue-router'
import home from './pages/home/index'
import order from './pages/order/index'
import my from './pages/my/index'
import address from './pages/my/address'
import addressadd from './pages/my/addressadd'
import index from './pages/index/indexH5'
import shop from './pages/shop/indexH5'
import shopgoods from './pages/shop/detail'
import settle from './pages/order/settle'
import logistics from './pages/order/logistics'
import pay from './pages/order/pay'
import home_search from './pages/home/search'
import home_searchresult from './pages/home/searchresult'
import subject from './pages/home/subject'
import orderDetail from './pages/order/orderDetail'
import orderreturn from './pages/order/orderreturn'
import confirm_receipt from './pages/order/confirm_receipt'
import write_review from './pages/order/write_review'
import Comment from './pages/order/Comment'
import entry_notice from './pages/my/entry_notice'
import write_info from './pages/my/write_info'
import write_license from './pages/my/write_license'
import write_location from './pages/my/write_location'
import applyresult from './pages/my/applyresult'
import applyresult_detail from './pages/my/applyresult_detail'
import information from './pages/service/information'
import consult from './pages/service/consult'
import storePage from './pages/store/storePage'
import service from './pages/store/service'
import dialogBox from './pages/store/dialogBox'
import distribution from './pages/order/distribution'
import live from './pages/live/index'
import liveroom from './pages/live/room'

import store from './store'
Vue.use(Router)//使用/注册路由
var routes = [
    {
        path:'/',
        redirect:'pages/home/index'
    },
    {
        path: 'pages/index/index',
        name: 'index',
        config: {
            navigationBarTitleText: '授权登录页',
            enablePullDownRefresh: true
        },
        meta: { noAuth: true },
        alias: '/pages/index/index',
        component: index
    },

    {
        path: 'pages/home/index',
        name: 'home',
        config: {
            navigationBarTitleText: '主页',
            enablePullDownRefresh: true,
            EnableNav:true,
        },
        meta: { noAuth: true },
        alias: '/pages/home/index',
        component: home
    },
    {
        path: 'pages/home/search',
        name: 'home-search',
        config: {
            navigationBarTitleText: '商品搜索',
          },
        alias: '/pages/home/search',
        component: home_search
    },
    {
        path: 'pages/home/subject',
        name: 'subject',
        config: {
            navigationBarTitleText: '行业专题',
            enablePullDownRefresh: true,
            onReachBottomDistance: true
          },
          meta: { noAuth: true },
          alias: '/pages/home/subject',
          component: subject
    },
    {
        path: 'pages/home/searchresult',
        name: 'home-searchresult',
        config: {
            navigationBarTitleText: '商品搜索结果',
            enablePullDownRefresh: true,
            onReachBottomDistance: true
        },
        alias: '/pages/home/searchresult',
        component: home_searchresult
    },
    {
        path: 'pages/order/index',
        name: 'order',
        config: {
            navigationBarTitleText: '订单',
            enablePullDownRefresh: true,
            EnableNav:true,
        },
        alias: '/pages/order/index',
        component: order
    },
    {
        path: 'pages/order/orderDetail',
        name: 'orderDetail',
        config: {
            navigationBarTitleText: '订单详情',
            enablePullDownRefresh: true,
            onReachBottomDistance: true,
            onReachBottomDistance: 50
          },
        alias: '/pages/order/orderDetail',
        component: orderDetail
    },
    {
        path: 'pages/order/orderreturn',
        name: 'orderreturn',
        config: {
            navigationBarTitleText: '售后服务',
          },
        alias: '/pages/order/orderreturn',
        component: orderreturn
    },
    {
        path: 'pages/order/write_review',
        name: 'write_review',
        config: {
            navigationBarTitleText: '写评论',
          },
        alias: '/pages/order/write_review',
        component: write_review
    },
   
    {
        path: 'pages/order/confirm_receipt',
        name: 'confirm_receipt',
        config: {
            navigationBarTitleText: '确认收货',
          },
        alias: '/pages/order/confirm_receipt',
        component: confirm_receipt
    },
    {
        path: 'pages/order/Comment',
        name: 'Comment',
        config: {
            navigationBarTitleText: '评价完成',
          },
        alias: '/pages/order/Comment',
        component: Comment
    },
    {
        path: 'pages/my/index',
        name: 'my',
        config: {
            navigationBarTitleText: '我的',
            enablePullDownRefresh: true,
            EnableNav:true,

        },
        alias: '/pages/my/index',
        component: my
    },
    {
        path: 'pages/my/address',
        name: 'address',
        config: {
            navigationBarTitleText: '收货地址管理',
            enablePullDownRefresh: false,
          },
          alias: '/pages/my/address',
          component: address
    },
    {
        path: 'pages/my/addressadd',
        name: 'addressadd',
        config: {
            navigationBarTitleText: '新增收货地址',
            enablePullDownRefresh: false
          },
          alias: '/pages/my/addressadd',
          component: addressadd
    },
    {
        path: 'pages/my/entry_notice',
        name: 'entry_notice',
        config: {
            navigationBarTitleText: '入驻商城申请',
            enablePullDownRefresh: false
          },
          alias: '/pages/my/entry_notice',
          component: entry_notice
    },
    {
        path: 'pages/my/write_info',
        name: 'write_info',
        config: {
            navigationBarTitleText: '填写基础信息',
            enablePullDownRefresh: false
          },
          alias: '/pages/my/write_info',
          component: write_info
    },
    {
        path: 'pages/my/write_license',
        name: 'write_license',
        config: {
            navigationBarTitleText: '上传资料',
            enablePullDownRefresh: false
          },
          alias: '/pages/my/write_license',
          component: write_license
    },
    {
        path: 'pages/my/write_location',
        name: 'write_location',
        config: {
            navigationBarTitleText: '选择位置',
            enablePullDownRefresh: false
          },
          alias: '/pages/my/write_location',
          component: write_location
    },
    {
        path: 'pages/my/applyresult',
        name: 'applyresult',
        config: {
            navigationBarTitleText: '申请结果',
            enablePullDownRefresh: false
          },
          alias: '/pages/my/applyresult',
          component: applyresult
    },
    {
        path: 'pages/my/applyresult_detail',
        name: 'applyresult_detail',
        config: {
            navigationBarTitleText: '详细资料',
            enablePullDownRefresh: false
          },
          alias: '/pages/my/applyresult_detail',
          component: applyresult_detail
    },
    {
        path: 'pages/shop/index',
        name: 'shopindex',
        config: {
            navigationBarTitleText: '店铺详情',
            enablePullDownRefresh: true
        },
        meta: { noAuth: true },
        alias: '/pages/shop/index',
        component: shop
    },
    {
        path:'pages/shop/detail',
        name:'shopgoods',
        config: {
            navigationBarTitleText: '商品详情',
            enablePullDownRefresh: false
        },
        meta: { noAuth: true },
        alias: '/pages/shop/detail',
        component: shopgoods
    },    
    {
        path:'pages/order/settle',
        name:'settle',
        config: {
            navigationBarTitleText: '订单结算',
            enablePullDownRefresh: false
        },
        alias: '/pages/order/settle',
        component: settle
    },
    {
        path:'pages/order/logistics',
        name:'logistics',
        config: {
            navigationBarTitleText: '物流选择',
            enablePullDownRefresh: false
        },
        alias: '/pages/order/logistics',
        component: logistics
    },
    {
        path:'pages/order/pay',
        name:'pay',
        config: {
            navigationBarTitleText: '订单支付',
            enablePullDownRefresh: false
        },
        alias: '/pages/order/pay',
        component: pay
    },
    {
        path:'pages/service/information',
        name:'information',
        config: {
            navigationBarTitleText: '消息',
            enablePullDownRefresh: false
        },
        alias: '/pages/service/information',
        component: information
    },
    {
        path:'pages/service/consult',
        name:'consult',
        config: {
            navigationBarTitleText: '商家名称',
            enablePullDownRefresh: false
        },
        alias: '/pages/service/consult',
        component: consult
    },
    {
        path:'pages/store/storePage',
        name:'storePage',
        config: {
            navigationBarTitleText: '商家中心',
            enablePullDownRefresh: false
        },
        alias: '/pages/store/storePage',
        component: storePage
    },
    {
        path:'pages/store/service',
        name:'service',
        config: {
            navigationBarTitleText: '客服管理',
            enablePullDownRefresh: false
        },
        alias: '/pages/store/service',
        component: service
    },
    {
        path:'pages/store/dialogBox',
        name:'dialogBox',
        config: {
            navigationBarTitleText: '用户名称',
            enablePullDownRefresh: false
        },
        alias: '/pages/store/dialogBox',
        component: dialogBox
    },
    {
        path:'pages/order/distribution',
        name:'distribution',
        config: {
            navigationBarTitleText: '物流选择',
            enablePullDownRefresh: false
        },
        alias: '/pages/order/distribution',
        component: distribution
    },    
    {
        path:'pages/live/index',
        name:'live',
        config: {
            navigationBarTitleText: '直播列表',
            enablePullDownRefresh: false
        },
        meta: { noAuth: true },
        alias: '/pages/live/index',
        component: live
    },
    {
        path:'pages/live/room',
        name:'liveroom',
        config: {
            navigationBarTitleText: '在线咨询',
            enablePullDownRefresh: false
        },
        meta: { noAuth: true },
        alias: '/pages/live/room',
        component: liveroom
    },
    {
        path:'pages/web/webview',
        name:'webview',
        config: {
            navigationBarTitleText: '访问网页',
        },
        meta: { noAuth: true },
        alias: '/pages/web/webview',
        component: liveroom
    }

]

let router =new Router({routes:routes})
router.beforeEach((to, from, next) => {
    if (!to.matched.some(record => record.meta.noAuth)) {
        //这里判断用户是否登录，验证store中的token是否已登录
        if (!store.getters.Logined) { // 判断当前的token是否存在
            next({
                path: '/pages/index/index',
                query: { redirect: to.fullPath }
            })
        } else {
            next()
        }
    } else {
        next() // 确保一定要调用 next()
    }
  })
export default router
