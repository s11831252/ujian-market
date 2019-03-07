import http_axios from '../utils/http/axios'
import http_wx from '../utils/http/wxhttp'
const http = mpvue_Mode === 'WX' ? http_wx : http_axios;

// let BaseHost = "https://market.ujianchina.net/";
let BaseHost = "http://192.168.0.86:811/";
// let BaseHost = "http://192.168.0.119:811/";




export default {
    baidu_geocoder: param => {
        //location=35.658651,139.745415
        let ak = "yCCZ5HnYGnUoRQNfd0YkTHg8lluFGQRZ";
        if (!param.coordtype) {
            param.coordtype = "gcj02ll";
        }
        return http.get(`https://api.map.baidu.com/geocoder/v2/?ak=${ak}&output=json&coordtype=gcj02ll`, param)
    },
    Account_Login: param => {
        return http.post(BaseHost + "api/Account/Login", param)
    },
    Account_ValidationCode: (param) => {
        return http.get(BaseHost + "api/Account/ValidationCode", param)
    },
    Account_wxLogin: (code, param) => {
        return http.post(BaseHost + `api/Account/wxLogin?code=${code}`, param)
    },
    Account_SimpleLogin: param => {
        return http.post(BaseHost + "api/Account/SimpleLogin", param)
    },
    User_Get: param => {
        return http.get(BaseHost + "api/User/Get", param)
    },
    User_Coupon_Get: param => {
        //api/User_Coupon/Get?Coupon_RuleId={Coupon_RuleId}&State={State}&PageIndex={PageIndex}&PageSize={PageSize}
        return http.get(BaseHost + "api/User_Coupon/Get", param)
    },
    Market_Get: param => {
        return http.get(BaseHost + "api/Market/Get", param)
    },
    Shop_Get: param => {
        return http.get(BaseHost + "api/Shop/Get", param)
    },
    Shop_GetDetails: param => {
        return http.get(BaseHost + "api/Shop/GetDetails", param)
    },
    CustomGoodsType_Get: param => {
        return http.get(BaseHost + "api/CustomGoodsType/Get", param)
    },
    Goods_GetByShop: param => {
        return http.get(BaseHost + "api/Goods/GetByShop", param)
    },
    Goods_Get: param => {
        return http.get(BaseHost + "api/Goods/Get", param)
    },
    Goods_Search: param => {
        return http.get(BaseHost + "api/Goods/Search", param)
    },
    GoodsSearchHistory_GetHot: param => {
        return http.get(BaseHost + "api/GoodsSearchHistory/GetHot", param)
    },
    GoodsSearchHistory_Get: param => {
        return http.get(BaseHost + "api/GoodsSearchHistory/Get", param)
    },
    GetLogisticsMode: param => {
        return http.get(BaseHost + "api/LogisticsDistribution/GetLogisticsMode", param)
    },
    GetDistributionMode: param => {
        return http.get(BaseHost + "api/LogisticsDistribution/GetDistributionMode", param)
    },
    OrderAddress_Get: param => {
        return http.get(BaseHost + "api/OrderAddress/Get", param)
    },
    OrderAddress_Add: param => {
        return http.post(BaseHost + "api/OrderAddress/Add", param)
    },
    OrderAddress_Edit: param => {
        return http.post(BaseHost + "api/OrderAddress/Edit", param)
    },
    OrderAddress_Delete: (Order_Address_Id) => {
        if (!Order_Address_Id)
            return;
        return http.post(BaseHost + `api/OrderAddress/Delete?Order_Address_Id=${Order_Address_Id}`)
    },
    OrderAddress_SetDefault: (Order_Address_Id) => {
        if (!Order_Address_Id)
            return;
        return http.post(BaseHost + `api/OrderAddress/SetDefault?Order_Address_Id=${Order_Address_Id}`)
    },
    QueryFreight: param => {
        return http.post(BaseHost + "api/LogisticsDistribution/QueryFreight", param)
    },
    Order_Create: param => {
        return http.post(BaseHost + "api/Order/Create", param)
    },
    Order_Get: param => {
        return http.get(BaseHost + "api/Order/Get", param)
    },
    Order_ValidationCode: param => {
        return http.get(BaseHost + "api/Order/ValidationCode", param)
    },
    Order_Pay: param => {
        return http.post(BaseHost + "api/Order/Pay", param)
    },
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
        if (paramfilePath&&paramfilePath.length > 0)
            return http.upload(BaseHost + "api/OrderComment/Add?t=json", param, paramfilePath, names)
        else
            return http.post(BaseHost + "api/OrderComment/Add", param)
    },
    //删除订单评论
    OrderComment_GetListdelete: CommentGoodsId => {
        return http.post(BaseHost + `api/OrderComment/DeleteGoodsComment?CommentGoodsId=${CommentGoodsId}`)
    },

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

}