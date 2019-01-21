var routes = [
    {
        path: 'pages/home/index',
        name: 'home',
        config: {
            navigationBarTitleText: '行业市场',
            enablePullDownRefresh: true,
            onReachBottomDistance: true
          },
    },
    {
        path: 'pages/home/subject',
        name: 'subject',
        config: {
            navigationBarTitleText: '行业专题',
            enablePullDownRefresh: true,
            onReachBottomDistance: true
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
            onReachBottomDistance: true
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
            onReachBottomDistance: true
          },
    },
    {
        path: 'pages/my/index',
        name: 'my',
        config: {
            navigationBarTitleText: '我的',
            enablePullDownRefresh: false
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
    }
]
module.exports =routes
