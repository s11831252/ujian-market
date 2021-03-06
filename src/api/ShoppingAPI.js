import http_axios from '../utils/http/axios'
import http_wx from '../utils/http/wxhttp'
const http = mpvue_Mode === 'WX' ? http_wx : http_axios;

let BaseHost = process.env.NODE_ENV == 'development'?"http://192.168.0.95:811/":"https://market.ujianchina.net/";
// let BaseHost = process.env.NODE_ENV == 'development'?"http://www.luozuzhan.top:811/":"https://market.ujianchina.net/";

export default {
    //百度坐标转换
    baidu_geocoder: param => {
        //location=35.658651,139.745415
        let ak = "yCCZ5HnYGnUoRQNfd0YkTHg8lluFGQRZ";
        if (!param.coordtype) {
            param.coordtype = "gcj02ll";
        }
        return http.get(`https://api.map.baidu.com/geocoder/v2/?ak=${ak}&output=json&coordtype=gcj02ll`, param)
    },
    //普通登录(账号+密码)
    Account_Login: param => {
        return http.post(BaseHost + "api/Account/Login", param)
    },
    //登录验证码
    Account_ValidationCode: (param) => {
        return http.get(BaseHost + "api/Account/ValidationCode", param)
    },
    //微信登录(用户在微信小程序首次登录绑定账号后即可自动登录)
    Account_wxLogin: (code, InvitaId,param) => {
        if(InvitaId)
            return http.post(BaseHost + `api/Account/wxLogin?code=${code}&InvitaId=${InvitaId}`, param)
        else
            return http.post(BaseHost + `api/Account/wxLogin?code=${code}`, param)

    },
    //简单登录(账号+验证码)
    Account_SimpleLogin: param => {
        return http.post(BaseHost + "api/Account/SimpleLogin", param)
    },
    //微信登录(用户在微信小程序首次登录绑定账号后即可自动登录)
    Account_wxAESDecrypt: (param) => {
        return http.post(BaseHost + `api/Account/wxAESDecrypt`, param)
    },
    //获取用户信息
    User_Get: param => {
        return http.get(BaseHost + "api/User/Get", param)
    },
    //退出微信登录
    User_wxExit: (openid,unionid) => {
        return http.post(BaseHost + `api/User/wxExit?openid=${openid}&unionid=${unionid}`,)
    },
    //获取个人优惠券
    User_Coupon_Get: param => {
        //api/User_Coupon/Get?Coupon_RuleId={Coupon_RuleId}&State={State}&PageIndex={PageIndex}&PageSize={PageSize}
        return http.get(BaseHost + "api/User_Coupon/Get", param)
    },
    //获取行业市场信息
    Market_Get: param => {
        return http.get(BaseHost + "api/Market/Get", param)
    },
    //获取店铺
    Shop_Get: param => {
        return http.get(BaseHost + "api/Shop/Get", param)
    },
    //获取当前登录用户可管理的商铺列表
    Shop_GetMy: () => {
        return http.get(BaseHost + "api/Shop/GetMy")
    },
    //获取店铺详情
    Shop_GetDetails: param => {
        return http.get(BaseHost + "api/Shop/GetDetails", param)
    },
    //获取店铺自定义商品分类
    CustomGoodsType_Get: param => {
        return http.get(BaseHost + "api/CustomGoodsType/Get", param)
    },
    //获取店铺商品列表
    Goods_GetByShop: param => {
        return http.get(BaseHost + "api/Goods/GetByShop", param)
    },
    //获取商品
    Goods_Get: param => {
        return http.get(BaseHost + "api/Goods/Get", param)
    },
    //搜索商品
    Goods_Search: param => {
        return http.get(BaseHost + "api/Goods/Search", param)
    },
    //获取热门搜索关键字
    GoodsSearchHistory_GetHot: param => {
        return http.get(BaseHost + "api/GoodsSearchHistory/GetHot", param)
    },
    //获取个人搜素关键字
    GoodsSearchHistory_Get: param => {
        return http.get(BaseHost + "api/GoodsSearchHistory/Get", param)
    },
    //移除个人搜素关键字
    GoodsSearchHistory_Remove: Keyword => {
        return http.get(BaseHost + `api/GoodsSearchHistory/Remove?Keyword=${Keyword}`)
    },
    //移除个人所有的搜素关键字
    GoodsSearchHistory_RemoveALL: () => {
        return http.get(BaseHost + `api/GoodsSearchHistory/RemoveALL`)
    },
    //获取物流
    GetLogisticsMode: param => {
        return http.get(BaseHost + "api/LogisticsDistribution/GetLogisticsMode", param)
    },
    //获取配送方式
    GetDistributionMode: param => {
        return http.get(BaseHost + "api/LogisticsDistribution/GetDistributionMode", param)
    },
    //获取订单地址
    OrderAddress_Get: param => {
        return http.get(BaseHost + "api/OrderAddress/Get", param)
    },
    //新增订单地址
    OrderAddress_Add: (param,LogisticsId) => {
        if(LogisticsId!=undefined)
            return http.post(BaseHost + `api/OrderAddress/Add?LogisticsId=${LogisticsId}`, param)
        else
            return http.post(BaseHost + "api/OrderAddress/Add", param)
    },
    //编辑订单地址
    OrderAddress_Edit: param => {
        return http.post(BaseHost + "api/OrderAddress/Edit", param)
    },
    //删除订单地址
    OrderAddress_Delete: (Order_Address_Id) => {
        if (!Order_Address_Id)
            return;
        return http.post(BaseHost + `api/OrderAddress/Delete?Order_Address_Id=${Order_Address_Id}`)
    },
    //设置默认订单地址
    OrderAddress_SetDefault: (Order_Address_Id) => {
        if (!Order_Address_Id)
            return;
        return http.post(BaseHost + `api/OrderAddress/SetDefault?Order_Address_Id=${Order_Address_Id}`)
    },
    //查询运费
    QueryFreight: param => {
        return http.post(BaseHost + "api/LogisticsDistribution/QueryFreight", param)
    },
    //创建订单
    Order_Create: param => {
        return http.post(BaseHost + "api/Order/Create", param)
    },
    //获取订单
    Order_Get: param => {
        return http.get(BaseHost + "api/Order/Get", param)
    },
    //获取支付验证码
    Order_ValidationCode: param => {
        return http.get(BaseHost + "api/Order/ValidationCode", param)
    },
    //支付订单
    Order_Pay: param => {
        return http.post(BaseHost + "api/Order/Pay", param)
    },
    //更新订单支付状态
    Order_UpdatePayState: param => {
        return http.post(BaseHost + "api/Order/UpdatePayState", param)
    },
    //确认收货
    Order_OrderOver: param => {
        return http.post(BaseHost + "api/Order/OrderOver?OrderId=" + param.OrderId)
    },
    //取消申请
    Order_CancelAudti: param => {
        return http.post(BaseHost + "api/Shop/CancelAudti?sId=" + param.sId)
    },
    //取消订单,只能取消待付款的订单
    Order_Cancel: param => {
        return http.post(BaseHost + "api/Order/Cancel", param)
    },
    //获取订单评论列表
    OrderComment_GetList: param => {
        return http.get(BaseHost + "api/OrderComment/GetList", param)
    },
    //添加订单评论
    OrderComment_GetListAdd: (param, paramfilePath, names) => {
        // if (paramfilePath&&paramfilePath.length > 0)
        //     return http.upload(BaseHost + "api/OrderComment/Add?t=json", param, paramfilePath, names)
        // else
            return http.post(BaseHost + "api/OrderComment/Add", param)
    },
    //删除订单评论
    OrderComment_DeleteGoodsComment: CommentGoodsId => {
        return http.post(BaseHost + `api/OrderComment/DeleteGoodsComment?CommentGoodsId=${CommentGoodsId}`)
    },
    //申请取消订单
    Order_ApplyCancel: (param, filePath, name) => {
        if (filePath && filePath.length > 0)
            return http.upload(BaseHost + "api/Order/ApplyCancel?t=json", param, filePath, name);
        else
            return http.post(BaseHost + "api/Order/ApplyCancel", param);
    },
    //商家处理退款申请,只能用于待发货的订单
    Order_ApplyRefund: (param, filePath, name) => {
        if (filePath && filePath.length > 0)
            return http.upload(BaseHost + "api/Order/ApplyRefund?t=json", param, filePath, name);
        else
            return http.post(BaseHost + "api/Order/ApplyRefund", param);
    },
    //平台介入
    Order_ApplyPlatform: param => {
        return http.post(BaseHost + "api/Order/ApplyPlatform?OrderId=" + param.OrderId)
    },
    //获取店铺分类
    CommonInfo_GetKeywordType: param => {
        return http.get(BaseHost + `api/CommonInfo/GetKeywordType`,param)
    },    
    //获取商品分类
    CommonInfo_GetGoodsKeywordType: param => {
        return http.get(BaseHost + `api/CommonInfo/GetGoodsKeywordType`, param)
    },
    //获取商家协议html
    Shop_AgreementHtml:(uri) =>{
        return http.get(BaseHost + `Shop_Agreement.html`)
    },
    //申请创建店铺
    Shop_CreateEasy:(param, filePath, name) =>{
        if (filePath && filePath.length > 0)
        return http.upload(BaseHost + "api/Shop/CreateEasy?t=json", param, filePath, name);
        else
        return http.post(BaseHost + `api/Shop/CreateEasy`,param)
    },
    //创建店铺申请失败后重试
    Shop_CreateToo:(sId,param, filePath, name) =>{
        if (filePath && filePath.length > 0)
        return http.upload(BaseHost + `api/Shop/CreateEasy?sId=${sId}&t=json`, param, filePath, name);
        else
        return http.post(BaseHost + `api/Shop/CreateEasy?sId=${sId}`,param)
    },
    
    //更新店铺营业执照
    Shop_UpdateLicense:(sId,filePath) =>{
        if (filePath && filePath.length > 0)
            return http.upload(BaseHost + `api/Shop/UpdateLicense?sId=${sId}&t=json`,null, filePath, ["Image"]);
        else
            return http.post(BaseHost + `api/Shop/UpdateLicense`,param)
    },
    //更新店铺照片
    Shop_UpdateImages:(sId,param,filePath,filename) =>{
        if (filePath && filePath.length > 0)
            return http.upload(BaseHost + `api/Shop/UpdateImages?sId=${sId}&t=json`,param, filePath, filename);
        else
            return http.post(BaseHost + `api/Shop/UpdateImages`,param)
    },
    //用户自主取消店铺审核
    Shop_CancelAudti: sId => {
        return http.post(BaseHost + `api/Shop/CancelAudti?sId=${sId}`)
    },
    //获取店铺成员
    ShopEmployee_Get:(sId)=>{
        return http.get(BaseHost + `api/ShopEmployee/Get?sId=${sId}`)
    },
    //获取直播列表
    appserver_Ongoing:(params)=>{
        return http.get(BaseHost + `api/AppServer/Ongoing`,params)
    },
    //获取直播间详情
    AppServer_LiveRoomsDetail:(LiveRoomId)=>{
        return http.get(BaseHost + `api/AppServer/LiveRoomsDetail?LiveRoomId=${LiveRoomId}`)
    },
    //加入直播间
    AppServer_JoinRoom:(UserName,portrait)=>{
        return http.post(BaseHost + `api/AppServer/JoinRoom?UserName=${UserName}&portrait=${portrait}`)
    },
    //获取直播间礼物列表
    AppServer_GetGiftList:()=>{
        return http.get(BaseHost + `api/AppServer/GetGiftList`)
    },
    //获取直播间礼物列表
    AppServer_SendGift:(userId,giftId,Count)=>{
        return http.post(BaseHost + `api/AppServer/SendGift?userId=${userId}&giftId=${giftId}&Count=${Count}`)
    },
    //获取积分用于兑换直播礼物
    AppServer_GetPoints:()=>{
        return http.get(BaseHost + `api/AppServer/GetPoints`)
    },
    //使用U建钱包余额购买礼物积分
    AppServer_BuyPoints:(params)=>{
        return http.post(BaseHost + `api/AppServer/BuyPoints`,params)
    },
    //获取用户是否已经关注了某直播店铺
    AppServer_IsFollow:(userId)=>{
        return http.post(BaseHost + `api/AppServer/IsFollow?userId=${userId}`)
    },
    //获取用户已经关注的直播店铺列表
    AppServer_MyFollowLst:(pageSize,pageIndex)=>{
        return http.post(BaseHost + `api/AppServer/MyFollowLst?pageSize=${pageSize}&pageIndex=${pageIndex}`)
    },
    //返回某直播店铺的关注人数
    AppServer_MyFollowCount:(userId)=>{
        return http.get(BaseHost + `api/AppServer/MyFollowCount?userId=${userId}`)
    },
    //取消关注某店铺
    AppServer_UnFollow:(userId)=>{
        return http.post(BaseHost + `api/AppServer/UnFollow?userId=${userId}`)
    },
    //关注某店铺
    AppServer_Follow:(userId)=>{
        return http.post(BaseHost + `api/AppServer/Follow?userId=${userId}`)
    },
    //获取店铺直播间关联的商品
    Goods_GetLiveGoods:(sId)=>{
        return http.get(BaseHost + `api/Goods/GetLiveGoods?sId=${sId}`)
    },
    /**
     * @description: '直播间连麦'
     * @param {*} liveRoomId 房间ID
     * @param {*} type 连麦类型,video,audio
     * @return {*}
     */    
    AppServer_ConnectRoom(liveRoomId,type){
        return http.post(BaseHost + `api/AppServer/ConnectRoom?liveRoomId=${liveRoomId}&type=${type}`)
    },
    /**
     * @description: '断开连麦'
     * @param {*} liveRoomId 房间ID
     * @param {*} Url 要断开的地址
     * @return {*}
     */
    AppServer_UnConnectRoom(liveRoomId,Url){
        return http.post(BaseHost + `api/AppServer/UnConnectRoom?liveRoomId=${liveRoomId}&Url=${Url}`)
    },
}