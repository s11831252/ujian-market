import http_axios from '../utils/http/axios'
import http_wx from '../utils/http/wxhttp'
const http = mpvue_Mode === 'WX' ? http_wx : http_axios;

// let BaseHost = "https://market.ujianchina.net/";
let BaseHost = "http://192.168.0.86:811/";


export default {
    baidu_geocoder:param=>{
        //location=35.658651,139.745415
        let ak="yCCZ5HnYGnUoRQNfd0YkTHg8lluFGQRZ";
        return http.get(`http://api.map.baidu.com/geocoder/v2/ak=${ak}&output=json`, param)
    },
    Account_Login: param => {
        return http.post(BaseHost + "api/Account/Login", param)
    },
    Account_ValidationCode: (param) => {
        return http.get(BaseHost + "api/Account/ValidationCode", param)
    },
    Account_wxLogin: (code,param) => {
        return http.post(BaseHost + `api/Account/wxLogin?code=${code}`, param)
    },
    Account_SimpleLogin: param => {
        return http.post(BaseHost + "api/Account/SimpleLogin", param)
    },
    User_Get: param => {
        return http.get(BaseHost + "api/User/Get", param)
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
    GetLogisticsMode: param => {
        return http.get(BaseHost + "api/LogisticsDistribution/GetLogisticsMode", param)
    },
    GetDistributionMode: param => {
        return http.get(BaseHost + "api/LogisticsDistribution/GetDistributionMode", param)
    },
    OrderAddress_Get: param => {
        return http.get(BaseHost + "api/OrderAddress/Get", param)
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
    Order_Cancel: param => {
        return http.post(BaseHost + "api/Order/Cancel", param)
    },
    Order_ApplyCancel: param => {
        return http.post(BaseHost + "api/Order/ApplyCancel", param)
    },
    
    
}