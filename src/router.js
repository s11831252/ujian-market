var routes = [
    {
        path: 'pages/home/index',
        name: 'home',
        config: {
            navigationBarTitleText: '行业市场',
            enablePullDownRefresh: true,
            onReachBottomDistance: 50
          },
    },
    {
        path: 'pages/home/subject',
        name: 'subject',
        config: {
            navigationBarTitleText: '行业专题',
            enablePullDownRefresh: true,
            onReachBottomDistance: 50
          },
    },
    {
        path: 'pages/home/search',
        name: 'home-search',
        config: {
            navigationBarTitleText: '商品搜索',
          },
    },
    {
        path: 'pages/home/searchresult',
        name: 'home-searchresult',
        config: {
            navigationBarTitleText: '商品搜索结果',
            enablePullDownRefresh: true,
            onReachBottomDistance: 50
          },
    },
    {
        path: 'pages/index/index',
        name: 'index',
        config: {
            navigationBarTitleText: '授权登录',
            enablePullDownRefresh: false
          },
    },
    {
        path: 'pages/order/index',
        name: 'order',
        config: {
            navigationBarTitleText: '订单',
            enablePullDownRefresh: true,
            onReachBottomDistance: 50
          },
    },
    
    {
        path: 'pages/order/orderDetail',
        name: 'orderDetail',
        config: {
            navigationBarTitleText: '订单详情',
          },
    },
    {
        path: 'pages/order/orderreturn',
        name: 'orderreturn',
        config: {
            navigationBarTitleText: '售后服务',
          },
    },
    {
        path: 'pages/order/write_review',
        name: 'write_review',
        config: {
            navigationBarTitleText: '写评论',
          },
    },
    {
        path: 'pages/order/confirm_receipt',
        name: 'confirm_receipt',
        config: {
            navigationBarTitleText: '确认收货',
          },
    },
    {
        path: 'pages/order/Comment',
        name: 'Comment',
        config: {
            navigationBarTitleText: '评价完成',
          },
    },

    {
        path: 'pages/my/index',
        name: 'my',
        config: {
            navigationBarTitleText: '我的',
            enablePullDownRefresh: true,
          },
    },
    {
        path: 'pages/my/address',
        name: 'address',
        config: {
            navigationBarTitleText: '收货地址管理',
            enablePullDownRefresh: false
          },
    },
    {
        path: 'pages/my/addressadd',
        name: 'addressadd',
        config: {
            navigationBarTitleText: '新增收货地址',
            enablePullDownRefresh: false
          },
    },
    {
        path: 'pages/my/entry_notice',
        name: 'entry_notice',
        config: {
            navigationBarTitleText: '入驻商城申请',
            enablePullDownRefresh: false
          },
    },
    {
        path: 'pages/my/write_info',
        name: 'write_info',
        config: {
            navigationBarTitleText: '填写基础信息',
            enablePullDownRefresh: false
          },
    },
    {
        path: 'pages/my/write_license',
        name: 'write_license',
        config: {
            navigationBarTitleText: '上传资料',
            enablePullDownRefresh: false
          },
    },
    {
        path: 'pages/my/write_location',
        name: 'write_location',
        config: {
            navigationBarTitleText: '选择位置',
            enablePullDownRefresh: false
          },
    },
    {
        path: 'pages/my/applyresult',
        name: 'applyresult',
        config: {
            navigationBarTitleText: '申请结果',
            enablePullDownRefresh: false
          },
    },
    {
        path: 'pages/my/applyresult_detail',
        name: 'applyresult_detail',
        config: {
            navigationBarTitleText: '详细资料',
            enablePullDownRefresh: false
          },
    },
    {
        path: 'pages/shop/index',
        name: 'shop',
        config: {
            navigationBarTitleText: '店铺主页',
            enablePullDownRefresh: false
          },
    },
    {
        path:'pages/shop/detail',
        name:'good',
        config: {
            navigationBarTitleText: '商品详情',
            enablePullDownRefresh: false
        }
    },
    {
        path:'pages/order/settle',
        name:'settle',
        config: {
            navigationBarTitleText: '订单结算',
            enablePullDownRefresh: false
        }
    },
    {
        path:'pages/order/logistics',
        name:'logistics',
        config: {
            navigationBarTitleText: '物流选择',
            enablePullDownRefresh: false
        }
    },
    {
        path:'pages/order/pay',
        name:'pay',
        config: {
            navigationBarTitleText: '订单支付',
            enablePullDownRefresh: false
        },
    },
    {
        path:'pages/service/information',
        name:'information',
        config: {
            navigationBarTitleText: '消息',
            enablePullDownRefresh: false
        },
    },
    {
        path:'pages/service/consult',
        name:'consult',
        config: {
            navigationBarTitleText: '商家名称',
            enablePullDownRefresh: false,
            disableScroll: true
        },
    },
    {
        path:'pages/store/storehome',
        name:'storehome',
        config: {
            navigationBarTitleText: '商家中心',
            enablePullDownRefresh: false
        },
    },
    {
        path:'pages/store/manage',
        name:'storemanage',
        config: {
            navigationBarTitleText: '店铺管理',
            enablePullDownRefresh: false
        },
    },
    {
        path:'pages/store/service',
        name:'service',
        config: {
            navigationBarTitleText: '客服管理',
            enablePullDownRefresh: false
        },
    },
    {
        path:'pages/store/dialogBox',
        name:'dialogBox',
        config: {
            navigationBarTitleText: '用户名称',
            enablePullDownRefresh: false
        },
    },
    {
        path:'pages/order/distribution',
        name:'distribution',
        config: {
            navigationBarTitleText: '物流选择',
            enablePullDownRefresh: false
        },
    },
    {
        path:'pages/live/room',
        name:'liveroom',
        config: {
            navigationBarTitleText: '在线咨询',
            enablePullDownRefresh: false,
            disableScroll: true
        }
    },
    {
        path:'pages/web/webview',
        name:'webview',
        config: {
            navigationBarTitleText: '访问网页',
        }
    },
    {
        path:'pages/my/about',
        name:'about',
        config: {
            navigationBarTitleText: '关于U建行业市场',
        }
    },
    {
        path:'pages/supply-demand/home',
        name:'sd_home',
        config: {
            navigationBarTitleText: '供求大厅',
            enablePullDownRefresh: false,
        }
    },
    {
        path:'pages/supply-demand/release',
        name:'sd_release',
        config: {
            navigationBarTitleText: '发布供求',
            enablePullDownRefresh: false,
        }
    },
    {
        path:'pages/supply-demand/release-form',
        name:'sd_release_form',
        config: {
            navigationBarTitleText: '发布需求表单',
            enablePullDownRefresh: false,
        }
    },
    {
        path:'pages/supply-demand/select',
        name:'sd_select',
        config: {
            navigationBarTitleText: '选取项目',
            enablePullDownRefresh: false,
        }
    },
    {
        path:'pages/supply-demand/buy',
        name:'sd_buy',
        config: {
            navigationBarTitleText: '购买服务',
            enablePullDownRefresh: false,
        }
    },
    {
        path:'pages/supply-demand/discount-code',
        name:'sd_discount',
        config: {
            navigationBarTitleText: '优惠码',
            enablePullDownRefresh: false,
        }
    },
    {
        path:'pages/supply-demand/pay-ok',
        name:'sd_payok',
        config: {
            navigationBarTitleText: '支付成功',
            enablePullDownRefresh: false,
        }
    },
    {
        path:'pages/supply-demand/post',
        name:'sd_post',
        config: {
            navigationBarTitleText: '发布',
            enablePullDownRefresh: false,
        }
    },
    {
        path:'pages/supply-demand/manage',
        name:'sd_manage',
        config: {
            navigationBarTitleText: '供求管理',
            enablePullDownRefresh: false,
        }
    }
    
]
module.exports =routes
